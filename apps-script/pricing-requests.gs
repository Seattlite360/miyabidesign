/**
 * Miyabi pricing-page request receiver, v1.
 * Receives the JSON POST from the MiyabiRequestForm Framer component and appends one row per request.
 *
 * SET UP (about 5 minutes):
 *  1. Create a blank Google Sheet (name it e.g. "Miyabi pricing requests").
 *  2. Extensions > Apps Script. SELECT ALL and DELETE the placeholder code first, then paste this whole file.
 *     (Pasting around the placeholder nests everything inside myFunction and doPost is not found.)
 *  3. Save. Run "selfTest" once from the editor and accept the permission prompts. It adds one row marked
 *     "SELFTEST" that you can delete.
 *  4. Deploy > New deployment > type Web app. Execute as: Me. Who has access: Anyone. Deploy.
 *  5. Copy the Web app URL (ends in /exec) into the form's "Endpoint URL" property in Framer.
 *  6. Later edits: use Deploy > New deployment again (saving alone does not update a live URL). Bump VERSION
 *     below so opening the URL in a browser proves which version is live.
 *
 * The form sends text/plain with a JSON string body, which avoids the CORS preflight that Apps Script cannot
 * answer. Reply is {"ok":true} on success, {"ok":false,"error":"..."} otherwise.
 */

var VERSION = "pricing-requests v1";
var SHEET_NAME = "Requests";
var NOTIFY_EMAIL = "kalebh@miyabidesign.co"; // new-lead alert. Set to "" to turn emails off.
var TIMEZONE = "Australia/Brisbane"; // shown in the received column, matches the "Brisbane hours" promise

var HEADERS = [
  "received_brisbane",
  "request_type",
  "tier",
  "name",
  "agency",
  "mobile",
  "email",
  "agents",
  "listing_url",
  "best_time_to_call",
  "source_url",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "timestamp_client",
];

var REQUEST_TYPES = ["sample", "start"];
var AGENT_COUNTS = ["solo", "2-5", "6plus"];
var CALL_TIMES = ["", "morning", "afternoon", "any"];

/** Open the URL in a browser to check which version is live. */
function doGet() {
  return ContentService.createTextOutput("Miyabi " + VERSION + " is live.").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    var body = e && e.postData && e.postData.contents;
    if (!body) return json_({ ok: false, error: "empty body" });

    var data;
    try {
      data = JSON.parse(body);
    } catch (parseErr) {
      return json_({ ok: false, error: "invalid json" });
    }
    if (!data || data.form !== "pricing_request") return json_({ ok: false, error: "unknown form" });

    var clean = clean_(data);
    var problem = validate_(clean);
    if (problem) return json_({ ok: false, error: problem });

    lock.waitLock(20000);
    locked = true;
    appendRow_(clean);
    lock.releaseLock();
    locked = false;

    notify_(clean); // never blocks the save
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: "server error" });
  } finally {
    if (locked) lock.releaseLock();
  }
}

/** Run once from the editor to authorise the script and test the whole path. Adds one row marked SELFTEST. */
function selfTest() {
  var fake = {
    postData: {
      contents: JSON.stringify({
        form: "pricing_request",
        request_type: "sample",
        tier: "",
        name: "Self Test",
        agency: "SELFTEST (delete this row)",
        mobile: "+61 412 345 678",
        email: "selftest@example.com",
        agents: "2-5",
        listing_url: "https://www.realestate.com.au/",
        best_time_to_call: "any",
        source_url: "https://miyabidesign.co/pricing",
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        timestamp: new Date().toISOString(),
      }),
    },
  };
  var out = doPost(fake).getContent();
  console.log(out);
  return out;
}

/* ---------- helpers ---------- */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function str_(v, max) {
  if (v === null || v === undefined) return "";
  var s = String(v)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim();
  return s.length > max ? s.slice(0, max) : s;
}

function clean_(d) {
  return {
    request_type: str_(d.request_type, 20),
    tier: str_(d.tier, 20),
    name: str_(d.name, 200),
    agency: str_(d.agency, 200),
    mobile: str_(d.mobile, 40),
    email: str_(d.email, 254),
    agents: str_(d.agents, 20),
    listing_url: str_(d.listing_url, 2000),
    best_time_to_call: str_(d.best_time_to_call, 20),
    source_url: str_(d.source_url, 2000),
    utm_source: str_(d.utm_source, 200),
    utm_medium: str_(d.utm_medium, 200),
    utm_campaign: str_(d.utm_campaign, 200),
    timestamp_client: str_(d.timestamp, 40),
  };
}

function validate_(c) {
  if (REQUEST_TYPES.indexOf(c.request_type) < 0) return "bad request_type";
  if (AGENT_COUNTS.indexOf(c.agents) < 0) return "bad agents";
  if (CALL_TIMES.indexOf(c.best_time_to_call) < 0) return "bad best_time_to_call";
  if (!c.name) return "name required";
  if (!c.agency) return "agency required";
  if (!c.mobile) return "mobile required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email)) return "bad email";
  if (c.request_type === "sample" && !c.listing_url) return "listing_url required";
  return "";
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendRow_(c) {
  var sheet = getSheet_();
  // Match by the header text actually in row 1, so columns can be reordered or renamed-away safely.
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  var values = {};
  for (var k in c) values[k] = c[k];
  values.received_brisbane = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");

  var row = headers.map(function (h) {
    return values[String(h).trim()] !== undefined ? values[String(h).trim()] : "";
  });
  var range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, headers.length);
  range.setNumberFormat("@"); // plain text: keeps "+61 412..." and blocks any cell starting with = from becoming a formula
  range.setValues([row]);
}

function notify_(c) {
  if (!NOTIFY_EMAIL) return;
  try {
    var label = c.request_type === "sample" ? "Free sample request" : "Start plan request";
    var lines = [
      label,
      "",
      "Name: " + c.name,
      "Agency: " + c.agency,
      "Mobile: " + c.mobile,
      "Email: " + c.email,
      "Agents: " + c.agents,
      "Listing: " + (c.listing_url || "(none)"),
      "Best time to call (Brisbane): " + (c.best_time_to_call || "(none)"),
      "Plan they came in on: " + (c.tier || "(none)"),
      "",
      "Sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    ];
    MailApp.sendEmail(NOTIFY_EMAIL, label + ": " + c.agency + " (" + c.agents + ")", lines.join("\n"));
  } catch (mailErr) {
    console.error("notify failed", mailErr);
  }
}
