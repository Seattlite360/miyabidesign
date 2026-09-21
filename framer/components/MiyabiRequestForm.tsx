import { useEffect, useId, useRef, useState } from "react"
import type { CSSProperties, FormEvent } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * MiyabiRequestForm: the single lead form for the Miyabi Design pricing page.
 *
 * Entry paths (read from the URL, switchable in place):
 *   ?type=sample                       free sample pack
 *   ?type=start&tier=solo|2-5|6plus    start a plan
 *
 * SUBMIT CONTRACT (for the Apps Script doPost)
 *   POST <endpointUrl>, Content-Type: text/plain;charset=utf-8, body = JSON string.
 *   text/plain is deliberate: it is a "simple" CORS request, so the browser skips the
 *   preflight that Apps Script web apps cannot answer. Parse with
 *   JSON.parse(e.postData.contents), not e.parameter.
 *   Reply with {"ok":true}. Any 2xx counts as sent unless the JSON says ok:false.
 *
 *   Payload keys: form, request_type, tier, name, agency, mobile, email, agents,
 *   listing_url, best_time_to_call, source_url, utm_source, utm_medium, utm_campaign,
 *   timestamp (ISO, UTC).
 *
 * The honeypot is never sent: a bot that fills it sees the success screen and nothing posts.
 */

type RequestType = "sample" | "start"
type Tier = "solo" | "2-5" | "6plus"
type CallTime = "morning" | "afternoon" | "any"
type FieldKey = "name" | "agency" | "mobile" | "email" | "agents" | "listing"
type Errors = Partial<Record<FieldKey, string>>
type Status = "idle" | "sending" | "failed"

interface Values {
    name: string
    agency: string
    mobile: string
    email: string
    agents: Tier | ""
    listing: string
    callTime: CallTime | ""
}

interface MiyabiRequestFormProps {
    endpointUrl: string
    defaultType: RequestType
    sampleHeading: string
    startHeading: string
    logo?: { src: string; srcSet?: string; alt?: string }
    contactEmail: string
    contactPhone: string
    style?: CSSProperties
}

/* Brand tokens, used exactly as briefed. Red is reserved for the primary button
   and the kanji numerals in the success timeline. */
const CANVAS = "#FFFFFF"
const INK = "#000000"
const INK_SOFT = "#696969"
const TINT = "#F2F2F2"
const EDGE = "#8C8C8C"
const RED = "#AC3235"
const ERROR = "#B42318"

const EMPTY: Values = {
    name: "",
    agency: "",
    mobile: "",
    email: "",
    agents: "",
    listing: "",
    callTime: "",
}

const FIELD_ORDER: FieldKey[] = ["name", "agency", "mobile", "email", "agents", "listing"]

const AGENT_OPTIONS = [
    { value: "solo", label: "Just me" },
    { value: "2-5", label: "2 to 5" },
    { value: "6plus", label: "6 or more" },
]

const TIME_OPTIONS = [
    { value: "morning", label: "Morning" },
    { value: "afternoon", label: "Afternoon" },
    { value: "any", label: "Any time" },
]

const TIER_HEADING: Record<Tier, string> = {
    solo: "Solo",
    "2-5": "2-5 agent",
    "6plus": "6+ agent",
}

const KANJI = ["一", "二", "三"]

/* ---------- pure helpers ---------- */

function parseTier(raw: string | null): Tier | "" {
    if (!raw) return ""
    // "6+" arrives as "6 " because + decodes to a space in query strings
    const t = raw.trim().toLowerCase().replace(/\s+/g, "")
    if (t === "solo" || t === "1") return "solo"
    if (t === "2-5" || t === "2to5" || t === "2_5") return "2-5"
    if (t === "6plus" || t === "6+" || t === "6" || t === "6-plus") return "6plus"
    return ""
}

function normaliseUrl(raw: string): string | null {
    const t = raw.trim()
    if (!t) return null
    const withScheme = /^https?:\/\//i.test(t) ? t : "https://" + t
    try {
        const u = new URL(withScheme)
        if (!u.hostname.includes(".")) return null
        return u.toString()
    } catch {
        return null
    }
}

function validateField(key: FieldKey, v: Values, type: RequestType): string {
    switch (key) {
        case "name":
            return v.name.trim() ? "" : "Add your name so I know who to ask for"
        case "agency":
            return v.agency.trim() ? "" : "Add your agency name"
        case "mobile": {
            const raw = v.mobile.trim()
            if (!raw) return "Add a mobile number so I can reach you"
            const cleaned = raw.replace(/[\s().\-]/g, "")
            const ok = /^\+\d{8,15}$/.test(cleaned) || /^\d{8,17}$/.test(cleaned)
            return ok
                ? ""
                : "Check that number. Use digits only, like 0412 345 678 or +61 412 345 678"
        }
        case "email": {
            const raw = v.email.trim()
            if (!raw) return "Add your email so I can send the pack"
            return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw)
                ? ""
                : "Check the email address. It should look like name@agency.com.au"
        }
        case "agents":
            return v.agents ? "" : "Choose how many agents are in your team"
        case "listing": {
            const raw = v.listing.trim()
            if (!raw) {
                return type === "sample"
                    ? "Paste a link to one live listing so I can build your sample"
                    : ""
            }
            return normaliseUrl(raw)
                ? ""
                : "That link doesn't look right. Paste the full address from your browser"
        }
        default:
            return ""
    }
}

function validateAll(v: Values, type: RequestType): Errors {
    const out: Errors = {}
    for (const key of FIELD_ORDER) {
        const msg = validateField(key, v, type)
        if (msg) out[key] = msg
    }
    return out
}

/* ---------- small presentational pieces (module level so inputs never remount) ---------- */

function ErrorIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11.25" r="0.9" fill="currentColor" />
        </svg>
    )
}

function TickIcon() {
    return (
        <svg className="mrf-tick" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
            <path
                d="M2.5 6.4l2.3 2.3 4.7-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function FieldNote(props: { id: string; error?: string; help?: string }) {
    const { id, error, help } = props
    if (error) {
        return (
            <p id={`${id}-err`} className="mrf-err">
                <ErrorIcon />
                <span>{error}</span>
            </p>
        )
    }
    if (help) {
        return (
            <p id={`${id}-help`} className="mrf-help">
                {help}
            </p>
        )
    }
    return null
}

interface TextFieldProps {
    id: string
    name: string
    label: string
    value: string
    onChange: (v: string) => void
    onBlur: () => void
    type?: "text" | "tel" | "email" | "url"
    inputMode?: "text" | "tel" | "email" | "url"
    autoComplete?: string
    autoCapitalize?: string
    enterKeyHint?: "next" | "go"
    error?: string
    help?: string
    optional?: boolean
}

function TextField(p: TextFieldProps) {
    const describedBy = p.error ? `${p.id}-err` : p.help ? `${p.id}-help` : undefined
    return (
        <div className="mrf-field">
            <label className="mrf-label" htmlFor={p.id}>
                {p.label}
                {p.optional && <span className="mrf-opt">Optional</span>}
            </label>
            <input
                id={p.id}
                name={p.name}
                className="mrf-input"
                type={p.type ?? "text"}
                inputMode={p.inputMode}
                autoComplete={p.autoComplete}
                autoCapitalize={p.autoCapitalize}
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint={p.enterKeyHint}
                value={p.value}
                required={!p.optional}
                aria-invalid={p.error ? true : undefined}
                aria-describedby={describedBy}
                onChange={(e) => p.onChange(e.target.value)}
                onBlur={p.onBlur}
            />
            <FieldNote id={p.id} error={p.error} help={p.help} />
        </div>
    )
}

interface ChoiceGroupProps {
    idBase: string
    name: string
    legend: string
    options: { value: string; label: string }[]
    value: string
    onChange: (v: string) => void
    size: "tap" | "chip"
    optional?: boolean
    error?: string
    onBlurGroup?: () => void
}

function ChoiceGroup(p: ChoiceGroupProps) {
    return (
        <fieldset
            className="mrf-fieldset"
            aria-describedby={p.error ? `${p.idBase}-err` : undefined}
            onBlur={(e) => {
                if (p.onBlurGroup && !e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    p.onBlurGroup()
                }
            }}
        >
            <legend className="mrf-label">
                {p.legend}
                {p.optional && <span className="mrf-opt">Optional</span>}
            </legend>
            <div
                className={`mrf-choices mrf-choices--${p.size}`}
                data-invalid={p.error ? "true" : undefined}
            >
                {p.options.map((o) => (
                    <label key={o.value} className="mrf-choice">
                        <input
                            id={`${p.idBase}-${o.value}`}
                            className="mrf-vh-input"
                            type="radio"
                            name={p.name}
                            value={o.value}
                            checked={p.value === o.value}
                            required={!p.optional}
                            aria-invalid={p.error ? true : undefined}
                            onChange={() => p.onChange(o.value)}
                        />
                        <span className="mrf-face">
                            {o.label}
                            <TickIcon />
                        </span>
                    </label>
                ))}
            </div>
            <FieldNote id={p.idBase} error={p.error} />
        </fieldset>
    )
}

/* ---------- component ---------- */

/**
 * @framerIntrinsicWidth 520
 * @framerIntrinsicHeight 960
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function MiyabiRequestForm(props: MiyabiRequestFormProps) {
    const {
        endpointUrl = "",
        defaultType = "sample",
        sampleHeading = "Get your free sample pack",
        startHeading = "Start with the {tier} plan",
        contactEmail = "kalebh@miyabidesign.co",
        contactPhone = "+81 80 5732 4224",
        logo,
        style,
    } = props

    const uid = useId()
    const rootRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)

    const [type, setType] = useState<RequestType>(defaultType)
    const [tier, setTier] = useState<Tier | "">("")
    const [values, setValues] = useState<Values>(EMPTY)
    const [errors, setErrors] = useState<Errors>({})
    const [status, setStatus] = useState<Status>("idle")
    const [view, setView] = useState<"form" | "success">("form")
    const [honeypot, setHoneypot] = useState("")
    const [announcement, setAnnouncement] = useState("")
    const [sent, setSent] = useState<{ first: string; type: RequestType }>({
        first: "",
        type: "sample",
    })

    /* Read the funnel entry from the URL after mount (SSR-safe). */
    useEffect(() => {
        if (typeof window === "undefined") return
        let params: URLSearchParams
        try {
            params = new URLSearchParams(window.location.search)
        } catch {
            return
        }
        const urlTier = parseTier(params.get("tier"))
        const urlType = params.get("type")
        const nextType: RequestType =
            urlType === "start" || urlType === "sample"
                ? urlType
                : urlTier
                  ? "start"
                  : defaultType
        setType(nextType)
        if (urlTier) {
            setTier(urlTier)
            setValues((v) => (v.agents ? v : { ...v, agents: urlTier }))
        }
    }, [defaultType])

    /* Success replaces the form: move focus to the heading and bring it into view. */
    useEffect(() => {
        if (view !== "success" || typeof window === "undefined") return
        titleRef.current?.focus({ preventScroll: true })
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        rootRef.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" })
    }, [view])

    const heading =
        type === "sample"
            ? sampleHeading
            : tier
              ? startHeading.replace("{tier}", TIER_HEADING[tier])
              : "Start your plan"
    const sub =
        type === "sample"
            ? "Tell me about one live listing and I'll make you a sample pack within 24 hours."
            : "Your first listing pack's production is free."
    const buttonLabel = type === "sample" ? "Get my free sample" : "Start my plan"
    const sending = status === "sending"

    function setField<K extends keyof Values>(key: K, val: Values[K]) {
        const next = { ...values, [key]: val }
        setValues(next)
        // Only ever clear an error while typing; a new error waits for blur or submit.
        if (key !== "callTime" && errors[key as FieldKey]) {
            if (!validateField(key as FieldKey, next, type)) {
                setErrors((prev) => {
                    const copy = { ...prev }
                    delete copy[key as FieldKey]
                    return copy
                })
            }
        }
    }

    function blurField(key: FieldKey) {
        const msg = validateField(key, values, type)
        setErrors((prev) => {
            const copy = { ...prev }
            if (msg) copy[key] = msg
            else delete copy[key]
            return copy
        })
    }

    function switchType() {
        const next: RequestType = type === "sample" ? "start" : "sample"
        setType(next)
        // The listing link flips between required and optional, so re-check any old message.
        setErrors((prev) => {
            const copy = { ...prev }
            if (copy.listing) {
                const msg = validateField("listing", values, next)
                if (msg) copy.listing = msg
                else delete copy.listing
            }
            return copy
        })
        setStatus("idle")
        setAnnouncement(
            next === "sample"
                ? sampleHeading
                : tier
                  ? startHeading.replace("{tier}", TIER_HEADING[tier])
                  : "Start your plan"
        )
        try {
            const u = new URL(window.location.href)
            u.searchParams.set("type", next)
            window.history.replaceState(null, "", u.toString())
        } catch {
            /* canvas, sandboxed iframe or preview: the in-memory switch is enough */
        }
    }

    function focusField(key: FieldKey) {
        const id = key === "agents" ? `${uid}-agents-solo` : `${uid}-${key}`
        document.getElementById(id)?.focus()
    }

    function mailtoFallback() {
        const subject = type === "sample" ? "Free sample pack request" : "Start my plan request"
        const lines = [
            `Name: ${values.name.trim()}`,
            `Agency: ${values.agency.trim()}`,
            `Mobile: ${values.mobile.trim()}`,
            `Email: ${values.email.trim()}`,
            `Agents: ${values.agents}`,
            `Listing: ${values.listing.trim()}`,
            `Best time to call (Brisbane): ${values.callTime}`,
        ]
        return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (sending) return

        const found = validateAll(values, type)
        setErrors(found)
        const invalid = FIELD_ORDER.filter((k) => found[k])
        if (invalid.length) {
            setAnnouncement(
                `${invalid.length} ${invalid.length === 1 ? "field needs" : "fields need"} attention. ${found[invalid[0]]}`
            )
            focusField(invalid[0])
            return
        }

        const firstName = values.name.trim().split(/\s+/)[0] || ""

        // Bots fill the honeypot. Show them success and post nothing.
        if (honeypot.trim()) {
            setSent({ first: firstName, type })
            setView("success")
            return
        }

        setStatus("sending")
        setAnnouncement("Sending your request")

        let params = new URLSearchParams()
        try {
            params = new URLSearchParams(window.location.search)
        } catch {
            /* keep empty */
        }
        const payload = {
            form: "pricing_request",
            request_type: type,
            tier,
            name: values.name.trim(),
            agency: values.agency.trim(),
            mobile: values.mobile.trim(),
            email: values.email.trim(),
            agents: values.agents,
            listing_url: normaliseUrl(values.listing) || "",
            best_time_to_call: values.callTime,
            source_url: typeof window !== "undefined" ? window.location.href : "",
            utm_source: params.get("utm_source") || "",
            utm_medium: params.get("utm_medium") || "",
            utm_campaign: params.get("utm_campaign") || "",
            timestamp: new Date().toISOString(),
        }

        const controller = new AbortController()
        const timer = window.setTimeout(() => controller.abort(), 15000)
        try {
            if (!endpointUrl) throw new Error("No endpoint URL set in the component properties")
            const res = await fetch(endpointUrl, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(payload),
                signal: controller.signal,
            })
            if (!res.ok) throw new Error(`Endpoint replied ${res.status}`)
            let rejected = false
            try {
                const data = await res.json()
                rejected = data?.ok === false || data?.success === false
            } catch {
                /* a non-JSON reply from a 2xx is still a send */
            }
            if (rejected) throw new Error("Endpoint reported a failure")

            setSent({ first: firstName, type })
            setStatus("idle")
            setView("success")
        } catch (err) {
            console.warn("[MiyabiRequestForm] submit failed:", err)
            setStatus("failed")
        } finally {
            window.clearTimeout(timer)
        }
    }

    /* ---------- render ---------- */

    const telHref = contactPhone.replace(/[^\d+]/g, "")
    const steps =
        sent.type === "sample"
            ? [
                  { main: "I'll message or call within 1 business day.", note: "(Japan time, Brisbane hours)" },
                  { main: "Sample pack delivered within 24 hours of receiving your listing details." },
                  { main: "I'll ring you the next day to talk through it." },
              ]
            : [
                  { main: "I'll message or call within 1 business day.", note: "(Japan time, Brisbane hours)" },
                  { main: "Your first listing pack is delivered within 24 hours of receiving your listing details." },
                  { main: "I'll ring you the next day to talk through it." },
              ]

    return (
        <div ref={rootRef} className="mrf-root" style={{ ...style, position: "relative" }}>
            <style>{CSS}</style>
            <div className="mrf-inner">
                {/* Logo used as-is: no wrapper, shadow or recolour. The property overrides the built-in file. */}
                <img
                    className="mrf-logo"
                    src={logo?.src || DEFAULT_LOGO}
                    srcSet={logo?.src ? logo.srcSet : undefined}
                    alt={logo?.alt || "Miyabi Design"}
                    width={220}
                    height={46}
                />

                {view === "success" ? (
                    <div className="mrf-success">
                        <h2 ref={titleRef} tabIndex={-1} className="mrf-title">
                            {sent.first ? `Got it, ${sent.first}.` : "Got it."}
                        </h2>
                        <p className="mrf-sub">Here's what happens next.</p>
                        <ol className="mrf-steps" role="list">
                            {steps.map((s, i) => (
                                <li key={i} className="mrf-step">
                                    <span className="mrf-num" aria-hidden="true">
                                        {KANJI[i]}
                                    </span>
                                    <p>
                                        {s.main}
                                        {s.note && <span className="mrf-note"> {s.note}</span>}
                                    </p>
                                </li>
                            ))}
                        </ol>
                        <div className="mrf-contact">
                            <p className="mrf-contact-label">Reach me directly</p>
                            <a className="mrf-contact-link" href={`mailto:${contactEmail}`}>
                                {contactEmail}
                            </a>
                            <a className="mrf-contact-link" href={`tel:${telHref}`}>
                                {contactPhone}
                            </a>
                        </div>
                    </div>
                ) : (
                    <>
                        <header>
                            <h2 id={`${uid}-title`} className="mrf-title">
                                {heading}
                            </h2>
                            <p className="mrf-sub">{sub}</p>
                            <button type="button" className="mrf-switch" onClick={switchType}>
                                {type === "sample" ? "Start a plan instead" : "Get a free sample pack instead"}
                            </button>
                        </header>

                        <form
                            className="mrf-form"
                            onSubmit={handleSubmit}
                            noValidate
                            aria-labelledby={`${uid}-title`}
                        >
                            <TextField
                                id={`${uid}-name`}
                                name="name"
                                label="Your name"
                                autoComplete="name"
                                autoCapitalize="words"
                                enterKeyHint="next"
                                value={values.name}
                                error={errors.name}
                                onChange={(v) => setField("name", v)}
                                onBlur={() => blurField("name")}
                            />
                            <TextField
                                id={`${uid}-agency`}
                                name="agency"
                                label="Agency name"
                                autoComplete="organization"
                                autoCapitalize="words"
                                enterKeyHint="next"
                                value={values.agency}
                                error={errors.agency}
                                onChange={(v) => setField("agency", v)}
                                onBlur={() => blurField("agency")}
                            />
                            <TextField
                                id={`${uid}-mobile`}
                                name="mobile"
                                label="Mobile"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                enterKeyHint="next"
                                help="The best number to reach you."
                                value={values.mobile}
                                error={errors.mobile}
                                onChange={(v) => setField("mobile", v)}
                                onBlur={() => blurField("mobile")}
                            />
                            <TextField
                                id={`${uid}-email`}
                                name="email"
                                label="Email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                autoCapitalize="none"
                                enterKeyHint="next"
                                value={values.email}
                                error={errors.email}
                                onChange={(v) => setField("email", v)}
                                onBlur={() => blurField("email")}
                            />

                            <ChoiceGroup
                                idBase={`${uid}-agents`}
                                name={`${uid}-agents`}
                                legend="How many agents?"
                                size="tap"
                                options={AGENT_OPTIONS}
                                value={values.agents}
                                error={errors.agents}
                                onChange={(v) => setField("agents", v as Tier)}
                                onBlurGroup={() => blurField("agents")}
                            />

                            <TextField
                                id={`${uid}-listing`}
                                name="listing"
                                label="Link to one live listing"
                                type="url"
                                inputMode="url"
                                autoComplete="off"
                                autoCapitalize="none"
                                enterKeyHint="next"
                                optional={type === "start"}
                                help="Paste the link from realestate.com.au, Domain or your website."
                                value={values.listing}
                                error={errors.listing}
                                onChange={(v) => setField("listing", v)}
                                onBlur={() => blurField("listing")}
                            />

                            <ChoiceGroup
                                idBase={`${uid}-calltime`}
                                name={`${uid}-calltime`}
                                legend="Best time to call (Brisbane time)"
                                size="chip"
                                optional
                                options={TIME_OPTIONS}
                                value={values.callTime}
                                onChange={(v) => setField("callTime", v as CallTime)}
                            />

                            {/* Honeypot: off-screen, skipped by keyboards and screen readers. */}
                            <div className="mrf-trap" aria-hidden="true">
                                <label>
                                    Leave this field empty
                                    <input
                                        type="text"
                                        name="website"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="mrf-submit">
                                <button
                                    type="submit"
                                    className="mrf-btn"
                                    aria-disabled={sending}
                                    data-sending={sending ? "true" : undefined}
                                >
                                    {sending ? (
                                        <>
                                            <span className="mrf-spin" aria-hidden="true" />
                                            <span>Sending</span>
                                        </>
                                    ) : (
                                        buttonLabel
                                    )}
                                </button>

                                {status === "failed" && (
                                    <p className="mrf-fail" role="alert">
                                        <ErrorIcon />
                                        <span>
                                            Didn't send.{" "}
                                            <a href={mailtoFallback()}>Email {contactEmail} instead</a>
                                        </span>
                                    </p>
                                )}

                                <p className="mrf-fine">
                                    No contract. No card. One sample per agency. I only use your details to contact
                                    you about this.
                                </p>
                            </div>
                        </form>
                    </>
                )}

                <div className="mrf-vh" role="status" aria-live="polite" aria-atomic="true">
                    {announcement}
                </div>
            </div>
        </div>
    )
}

addPropertyControls(MiyabiRequestForm, {
    endpointUrl: {
        type: ControlType.String,
        title: "Endpoint URL",
        defaultValue: "",
        placeholder: "https://script.google.com/macros/s/.../exec",
    },
    defaultType: {
        type: ControlType.Enum,
        title: "Default type",
        options: ["sample", "start"],
        optionTitles: ["Free sample", "Start plan"],
        defaultValue: "sample",
        displaySegmentedControl: true,
    },
    sampleHeading: {
        type: ControlType.String,
        title: "Sample heading",
        defaultValue: "Get your free sample pack",
    },
    startHeading: {
        type: ControlType.String,
        title: "Start heading",
        defaultValue: "Start with the {tier} plan",
        description: "{tier} becomes Solo, 2-5 agent or 6+ agent.",
    },
    logo: {
        type: ControlType.ResponsiveImage,
        title: "Logo",
        description: "Optional. Leave empty to use the built-in Miyabi logo.",
    },
    contactEmail: {
        type: ControlType.String,
        title: "Contact email",
        defaultValue: "kalebh@miyabidesign.co",
    },
    contactPhone: {
        type: ControlType.String,
        title: "Contact phone",
        defaultValue: "+81 80 5732 4224",
    },
})

/* ---------- styles ---------- */

const FONT = `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
const FONT_KANJI = `'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', 'Songti SC', serif`

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500&text=%E4%B8%80%E4%BA%8C%E4%B8%89&display=swap");

.mrf-root{position:relative;box-sizing:border-box;width:100%;display:flex;justify-content:center;background:${CANVAS};color:${INK};font-family:${FONT};font-weight:300;-webkit-font-smoothing:antialiased;scroll-margin-top:24px}
.mrf-root *,.mrf-root *::before,.mrf-root *::after{box-sizing:border-box}
.mrf-inner{width:100%;max-width:520px;padding:32px 16px 40px}

.mrf-logo{display:block;width:100%;max-width:220px;height:auto;margin:0 auto 40px}

.mrf-title{margin:0;font-size:28px;line-height:1.2;font-weight:600;letter-spacing:-0.01em;color:${INK}}
.mrf-title:focus{outline:none}
.mrf-sub{margin:12px 0 0;font-size:16px;line-height:1.6;font-weight:300;color:${INK_SOFT}}
.mrf-switch{display:inline-flex;align-items:center;min-height:44px;margin:4px 0 0;padding:0;background:none;border:0;font:400 14px/1.4 ${FONT};color:${INK_SOFT};text-decoration:underline;text-underline-offset:3px;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mrf-switch:focus-visible{outline:2px solid ${INK};outline-offset:2px;border-radius:4px}
@media (hover:hover){.mrf-switch:hover{color:${INK}}}

.mrf-form{margin:16px 0 0;display:grid;gap:24px}
.mrf-field{display:block;min-width:0}
.mrf-fieldset{margin:0;padding:0;border:0;min-width:0}
.mrf-label{display:block;margin:0 0 8px;padding:0;font-size:14px;line-height:1.4;font-weight:500;color:${INK}}
.mrf-opt{margin-left:8px;font-weight:300;color:${INK_SOFT}}

.mrf-input{display:block;width:100%;height:52px;margin:0;padding:0 16px;font:300 16px/1.2 ${FONT};color:${INK};background:${TINT};border:1px solid ${EDGE};border-radius:10px;-webkit-appearance:none;appearance:none;transition:border-color .15s ease}
.mrf-input:focus{outline:2px solid ${INK};outline-offset:2px}
.mrf-input[aria-invalid="true"]{border-color:${ERROR}}

.mrf-help{margin:8px 0 0;font-size:14px;line-height:1.45;font-weight:300;color:${INK_SOFT}}
.mrf-err{margin:8px 0 0;display:flex;gap:8px;align-items:flex-start;font-size:14px;line-height:1.45;font-weight:400;color:${ERROR}}
.mrf-err svg,.mrf-fail svg{flex:none;margin-top:2px}

.mrf-choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.mrf-choice{position:relative;display:block;min-width:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mrf-vh-input{position:absolute;top:0;left:0;width:1px;height:1px;margin:0;opacity:0;pointer-events:none}
.mrf-face{position:relative;display:flex;align-items:center;justify-content:center;min-height:52px;padding:0 6px;text-align:center;font-size:16px;line-height:1.2;font-weight:400;color:${INK};background:${TINT};border:1px solid ${EDGE};border-radius:10px;user-select:none;-webkit-user-select:none;transition:background-color .15s ease,color .15s ease,border-color .15s ease}
.mrf-choices--chip .mrf-face{min-height:44px;font-size:15px}
.mrf-vh-input:checked + .mrf-face{background:${INK};border-color:${INK};color:${CANVAS}}
.mrf-vh-input:focus-visible + .mrf-face{outline:2px solid ${INK};outline-offset:2px}
.mrf-choices[data-invalid="true"] .mrf-face{border-color:${ERROR}}
.mrf-tick{display:none;position:absolute;top:6px;right:6px}
.mrf-vh-input:checked + .mrf-face .mrf-tick{display:block}
@media (hover:hover){.mrf-vh-input:not(:checked) + .mrf-face:hover{background:#E8E8E8}}

.mrf-trap{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}

.mrf-submit{display:grid;gap:12px;margin-top:8px}
.mrf-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:52px;margin:0;padding:0 24px;font:500 16px/1 ${FONT};color:#FFFFFF;background:${RED};border:0;border-radius:10px;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background-color .15s ease,transform .1s ease}
@media (hover:hover){.mrf-btn:hover{background:#9A2C2F}}
.mrf-btn:active{transform:translateY(1px)}
.mrf-btn:focus-visible{outline:2px solid ${INK};outline-offset:2px}
.mrf-btn[aria-disabled="true"]{cursor:progress}
.mrf-spin{width:18px;height:18px;border:2px solid rgba(255,255,255,.4);border-top-color:#FFFFFF;border-radius:50%;animation:mrf-rot .8s linear infinite}
@keyframes mrf-rot{to{transform:rotate(360deg)}}

.mrf-fail{margin:0;display:flex;gap:8px;align-items:flex-start;font-size:14px;line-height:1.45;font-weight:400;color:${ERROR}}
.mrf-fail a{color:${ERROR};text-decoration:underline;text-underline-offset:3px}
.mrf-fail a:focus-visible{outline:2px solid ${INK};outline-offset:2px;border-radius:2px}
.mrf-fine{margin:0;text-align:center;font-size:12px;line-height:1.5;font-weight:300;color:${INK_SOFT}}

.mrf-success{animation:mrf-in .28s ease both}
@keyframes mrf-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.mrf-steps{list-style:none;margin:32px 0 0;padding:0}
.mrf-step{position:relative;margin:0;padding:0 0 28px 52px}
.mrf-step:last-child{padding-bottom:0}
.mrf-step::before{content:"";position:absolute;left:17px;top:40px;bottom:6px;width:1px;background:#D4D4D4}
.mrf-step:last-child::before{display:none}
.mrf-num{position:absolute;left:0;top:0;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-family:${FONT_KANJI};font-weight:500;font-size:22px;line-height:1;color:${RED};border:1px solid ${EDGE};border-radius:50%}
.mrf-step p{margin:0;padding-top:6px;font-size:16px;line-height:1.55;font-weight:400;color:${INK}}
.mrf-note{color:${INK_SOFT};font-weight:300}
.mrf-contact{margin-top:40px;padding:20px;background:${TINT};border-radius:10px;display:grid;gap:0}
.mrf-contact-label{margin:0 0 4px;font-size:14px;line-height:1.4;font-weight:500;color:${INK}}
.mrf-contact-link{display:flex;align-items:center;min-height:44px;font-size:16px;font-weight:400;color:${INK};text-decoration:underline;text-underline-offset:3px;word-break:break-word}
.mrf-contact-link:focus-visible{outline:2px solid ${INK};outline-offset:2px;border-radius:2px}

.mrf-vh{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}

@media (prefers-reduced-motion:reduce){
  .mrf-root *,.mrf-root *::before,.mrf-root *::after{transition:none !important}
  .mrf-success{animation:none}
  .mrf-spin{animation:none;border-color:#FFFFFF}
  .mrf-btn:active{transform:none}
}
`

/* Horizontal Miyabi Design logo (雅 miyabi logo design horizontal color.png), resized from
   2670px to 660px wide (3x the 220px display size) and embedded so the form works with no setup. */
const DEFAULT_LOGO = "data:image/png;base64,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"
