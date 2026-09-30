# Miyabi explainer video: campaign plan

Status: PLAN ONLY. Nothing generated. Defaults below stand until Kalebh changes them.

## 1. Overview
- **Name:** One Link, Every Format
- **Summary:** A 75-second motion-graphics explainer for the Miyabi website showing one listing link become a full, on-brand listing pack (EDM, social, ads, brochure, signboard).
- **Primary objective:** Turn website visitors into free sample pack requests.
- **Secondary:** Reusable 30s and 15s cut-downs for ads, socials and cold-email landing pages.

## 2. Audience
- **Primary: independent and boutique agencies.** Care about time per listing, consistency across agents, cost control. Lead: 24 hours or free, free first pack.
- **Secondary: developers/builders.** Care about prestige of each project. Handled with an end tag only (a branded system built once). No developer price on screen.
- **Stage:** consideration to decision. They have seen an email or ad and land on the site to check it is real.

## 3. Messages (locked claims only)
- **Core:** Send a listing link. Get every format, on your brand, within 24 hours.
- Supporting:
  1. One system, built once, replaces repeat design work. (Time back)
  2. Every pack is delivered within 24 hours of receiving listing info, or it is free. (Speed, risk removed)
  3. The first pack is free with every build. (Zero-risk start)
  4. Price wording and AI-edit disclosure follow QLD/NSW rules. (Compliance)
- **Not claimed:** sell faster, more eyes, ROI, "hand crafted", "expert designers", "instant", "automatic". No case study exists yet.
- Print caveat appears on screen wherever print is shown: printing runs on the client's printer's timeline.

## 4. Channels
| Channel | Asset | Effort |
|---|---|---|
| Website hero / how-it-works | 75s master, captions on, autoplay muted with click-for-sound | Low (after production) |
| Cold email + follow-ups | Still frame + link to page (video in email is unreliable) | Low |
| Instagram / LinkedIn organic | 30s vertical 9:16 and 1:1 | Medium |
| Paid social (optional, later) | 15s vertical | Medium |

## 5. Length decision (changed from earlier "90s")
Narration written in the locked voice is about 110 words. That fills roughly 50 seconds of speech. The rest of the 75s is silent visual beats set to music. Padding to 90s would need extra claims the brand has not earned. Industry explainers that sit on landing pages convert best at 60 to 90 seconds; 75 is inside that.

## 6. Production calendar (work-days, one person plus Claude)
| Step | Output | Dependency |
|---|---|---|
| 1 Approve script + storyboard | Locked v1 | Kalebh review |
| 2 Sample content: Sabdia (decided 2026-09-30) | Sabdia wordmark, brand and a real or mocked listing under it | Terminal supplies Sabdia files from Kalebh's Miyabi folder |
| 3 Voice generation (ElevenLabs) | 9 scene WAVs | Script locked |
| 4 Build scenes in Raylight | 75s edit | Voice timing |
| 5 Review stills + filmstrip, fix | Approved master | Step 4 |
| 6 Cut-downs 30s / 15s, vertical + square | 4 files | Master |
| 7 Captions (burned in) + thumbnail | Deliverables | Master |
| 8 Publish on site, track | Live | Site access |

Video production benchmark in the campaign skill is 2 to 4 weeks. This plan compresses because tooling is automated, but expect 2 to 3 review rounds.

## 7. Success metrics
- **Primary:** sample pack requests from the page that hosts the video. Target set after 2 weeks of baseline (no historical data exists; any number now would be invented).
- Secondary: video play rate, average watch time (target: majority reach scene 6), completion rate, click on the CTA inside the video page, cost per free sample requested if ads run.
- Cadence: weekly for the first month.

## 8. Budget
Real cost is tool credits (ElevenLabs speech, Raylight), not a $10,000 spend. Check credit balance before launch. Keep 15% of credits for revisions. No dollar allocation invented here.

## 9. Risks
| Risk | Mitigation |
|---|---|
| Usage limit hits mid-run | Scene-by-scene prompt writes progress to `progress.md`; resumes from last completed scene. Voice is generated per scene so a retry costs one line. |
| Look drifts to generic "AI poster" | Follow Raylight craft rules and template beat sheets (see storyboard). Approved stills gate every scene. |
| Claim drift (speed, results) | Script pre-checked against the brand pre-send list. Re-check any edit. |
| Reference videos not analysed | YouTube is blocked from this environment. Kalebh supplies a per-video note, or motion is taken from Raylight's official templates instead. |
| Copyright | Techniques copied, footage not. |
| Sabdia shown publicly | Kalebh chose Sabdia. Confirm Sabdia is fine with public use of its name and marks; label listing content "Sample" if it is not a real listing. |

## 10. Next steps
1. DONE 2026-09-30: nine questions answered (defaults kept; Sabdia is the sample; the terminal watches the videos and has local file access).
2. Kalebh reviews `02-storyboard-and-script.md`.
3. Before the limit reset: paste `03-production-prompt.md` into a Claude session that has Raylight open in a browser tab and ElevenLabs connected.
