# Framer code components

Code components for the Miyabi Design Framer site. Paste a file into Framer (Assets > Code > New component) and set its properties.

## `components/MiyabiRequestForm.tsx`

The single lead form for the pricing funnel: an agent asks for a free sample pack, or starts a plan, in under a minute on a phone.

**Entry paths** (read from the page URL, switchable in place without a reload):

| URL | View |
| --- | --- |
| `?type=sample` | Free sample pack (default) |
| `?type=start&tier=solo` or `2-5` or `6plus` | Start a plan, agent count preselected |

**Properties:** Endpoint URL, Splitforms key, Default type, Sample heading, Start heading (`{tier}` becomes the plan name), Logo (optional, a built-in copy is used if empty), Contact email, Contact phone.

**Submit contract** (what the receiving endpoint must accept):

- `POST` to the Endpoint URL with `Content-Type: text/plain;charset=utf-8` and a JSON string body. Plain text is deliberate: it avoids the CORS preflight that a Google Apps Script web app cannot answer. Read it with `JSON.parse(e.postData.contents)`.
- Reply `{"ok":true}`. Any 2xx counts as sent unless the JSON says `ok:false` or `success:false`.
- Payload keys: `form`, `request_type`, `tier`, `name`, `agency`, `mobile`, `email`, `agents`, `listing_url`, `best_time_to_call`, `source_url`, `utm_source`, `utm_medium`, `utm_campaign`, `timestamp` (ISO, UTC).
- The same payload is also sent as multipart form data to Splitforms (form "Miyabi - Pricing Request") as a second inbox. Both destinations fire together and the request counts as sent if either accepts it. Clear the Splitforms key property to turn that off.
- A honeypot field catches bots. It is never sent.
- A ready-made receiver is in [`../apps-script/pricing-requests.gs`](../apps-script/pricing-requests.gs) (validates the payload, appends a Sheet row, emails an alert). Deploy it as a Web app and paste its URL into the Endpoint URL property.

**Brand:** follows [`docs/MIYABI-BRAND.md`](../docs/MIYABI-BRAND.md). Poppins, `#FFFFFF` canvas, `#000000` ink, `#696969` secondary text, `#F2F2F2` tint, Miyabi Red `#AC3235` only on the primary button and the kanji timeline numerals.

**Status:** behaviour checked in a simulated browser (validation, focus handling, failure and success states, URL params, payload). Not yet checked in a live Framer page or against a live endpoint.
