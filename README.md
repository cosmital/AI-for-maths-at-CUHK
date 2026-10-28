# AI for Mathematics at CUHK-Shenzhen

A first website draft for a one-day conference in December 2026. This is a portable, static website: editable HTML, shared CSS, a small amount of JavaScript, and local image assets. There is no build step, package installation, API key, or database.

## Current status

**Thursday, 3 December 2026, 09:30–17:30 (China Standard Time, UTC+8) is a proposal, not a confirmed event announcement.**

The program contains proposed sessions and example time slots. Speakers, room, campus gate, registration arrangements, fees, and contact details still need confirmation. Information from the earlier June AI Math Day provides background; it does not confirm December participants or arrangements.

## Open the website

1. Extract the complete ZIP archive.
2. Open `index.html` in your browser. Keep the other pages and the `assets` folder beside it.
3. To edit, open the extracted website folder in VS Code.

The pages use relative links and local assets, so the site can be reviewed directly from the extracted folder. External links, including the problem database and any registration form you configure, require an internet connection.

### Optional local web server

Open a terminal in the website folder containing `index.html`, then run:

```bash
python -m http.server 8000
```

On Windows, if `python` is unavailable but the Python launcher is installed:

```powershell
py -m http.server 8000
```

On systems where Python is named `python3`, use `python3 -m http.server 8000`.

Visit <http://localhost:8000>. Stop the server with **Ctrl+C**. This optional preview server requires Python; opening `index.html` directly does not.

## Pages and files

| File | Purpose |
| --- | --- |
| `index.html` | Conference introduction, themes, and main links. |
| `program.html` | Proposed schedule and session descriptions. |
| `registration.html` | Registration status and connection to your external form. |
| `venue.html` | Campus address, travel guidance, and event-specific venue details. |
| `problems.html` | Mathematical problem contributions and the existing database. |
| `about.html` | Scientific purpose, background, and organizational information. |
| `credits.html` | Sources and image attribution. |
| `conference.ics` | Calendar entry used when JavaScript is unavailable. |
| `problem-template.txt` | Downloadable template for preparing a mathematical problem. |
| `assets/js/event-config.js` | Shared event settings in `window.CONFERENCE`. |
| `assets/css/` | Shared styling and responsive layouts. |
| `assets/js/` | Configuration and small interface enhancements. |
| `assets/images/campus.jpg` | Locally stored campus photograph. |

## First edits

1. **Confirm the date and hours.** Update the shared configuration, the readable fallback HTML, and `conference.ics` together.
2. **Confirm the room and campus-entry instructions.** A campus address alone does not establish which gate visitors should use or whether registration grants admission.
3. **Add confirmed speakers and talk titles.** Replace the proposed sessions with the agreed program, keeping time for questions and breaks.
4. **Create the registration form.** Add its URL only when it is ready to accept responses. Check it as an external participant.
5. **Add the deadline, fee policy, and organizer contact.** Leave unresolved details clearly marked until they are agreed.
6. **Review the complete site on a phone and desktop.** Follow the navigation, registration link, calendar download, and venue links.

### Shared configuration

Edit `assets/js/event-config.js`. The configuration object is named `window.CONFERENCE` and uses these fields:

| Field | What to enter |
| --- | --- |
| `title` | Event title used in the generated calendar entry; also update the page headings and browser titles if it changes. |
| `date` | Event date in `YYYY-MM-DD` format. |
| `dateConfirmed` | `false` while provisional; `true` after the date is agreed. |
| `startTime`, `endTime` | Local event hours in `HH:MM` format. |
| `timeZoneLabel` | A clear label, such as `China Standard Time (UTC+8)`. Event date/calendar calculations use UTC+8; changing this label alone does not change the time zone. |
| `registrationUrl` | Complete HTTPS URL of your live external registration form. Leave blank while registration is closed. |
| `registrationQr` | Relative path to a QR image for that same form, if supplied. |
| `registrationDeadline` | Agreed deadline; retain `To be announced` until confirmed. |
| `feeLabel` | Agreed fee policy; retain `To be announced` until confirmed. |
| `contactEmail` | The organizer address intended for public enquiries. |
| `room` | Confirmed building and room. |
| `gate` | Confirmed visitor-entry instructions. |
| `onlineParticipation` | Confirmed arrangements for remote attendance, if offered. |

Preserve the value types and formatting shown in the supplied configuration file. The script updates marked date, time, registration, contact, and information fields. Narrative text, page titles, some status sentences, and the detailed timetable are edited directly in the HTML. Review those when confirming arrangements. The HTML also contains readable fallback content, so editing the configuration alone may leave outdated text visible when JavaScript is unavailable. Keep those versions consistent.

### Registration behavior

With `registrationUrl` blank, the website shows a closed or opening-soon state. Once a valid HTTPS URL is configured, the registration link opens that external form in a new tab. The website itself does not collect, submit, or store participant information. Update the fallback HTML as well when opening registration, so visitors with JavaScript disabled receive the correct information.

Provide both a clickable link and, if useful, a QR code. The QR code must resolve to the same current form. Do not reuse the earlier June event's registration code. The external service controls responses, capacity, confirmations, and its own privacy arrangements.

### Calendar entry

With JavaScript enabled, the calendar button generates an entry from the current configuration and downloads it as `ai-math-conference.ics`. Without JavaScript, the link downloads the supplied static `conference.ics` file. Keep that fallback file's date, start/end times, location, description, and tentative/confirmed status synchronized with the website. Updating the configuration does not rewrite the static file.

## Editing with Codex in VS Code

Open the whole website folder so Codex can see the shared files and all pages. A useful follow-up instruction is:

```text
Update this existing conference website with the confirmed event facts below.

[Paste the agreed date, hours, room, gate, speakers, program, registration
URL, deadline, fee policy, and public contact address here.]

Preserve the existing visual design and the static HTML/CSS/JavaScript
structure. Update assets/js/event-config.js (window.CONFERENCE), every
affected page's fallback HTML, and conference.ics consistently. Change
dateConfirmed only if I have confirmed the date. Keep any remaining
unconfirmed facts clearly labelled.

Check internal links, the mobile menu, registration states, the calendar
entry, and layout at phone and desktop widths. Retain local assets and
the attribution in credits.html. Give me a local preview and a concise
summary of the changes.
```

## Publish when ready

Copy the HTML files, `conference.ics`, `problem-template.txt`, and the complete `assets` folder to a static host. Keep their relative positions unchanged, with `index.html` at the site's entry point. An institutional web server or GitHub Pages can serve this package; no server-side application is required.

For GitHub Pages, put the website files in the chosen repository's publishing folder, then configure **Settings → Pages** to publish that folder. For an institutional host, follow the school's upload process. Keep a copy of the source files and arrange maintenance access for the organizers.

Before announcing the link, replace the proposed event details with confirmed information and test the full registration flow from campus, a mainland mobile connection, and the WeChat browser. Check that external participants can use the form and see the practical instructions.

## Image credit and sources

The campus photograph is by **Jundouchen**, obtained through **Wikimedia Commons**, and licensed under **Creative Commons Attribution-ShareAlike 4.0**. See `credits.html` for the exact source and full attribution. Retain that attribution when publishing or redistributing this package. The photograph's license does not establish university endorsement of this event.

The credits page also identifies sources used for historical background and travel information. Event-specific arrangements should be checked directly with the organizers before publication.
