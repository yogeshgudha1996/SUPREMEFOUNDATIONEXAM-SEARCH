# SUPREME FOUNDATION JASWATGARH - Volunteer Application Portal

This project provides a modern, responsive volunteer application form with:

- 3D glassmorphism UI card
- Sparkle animated background
- Cascading dropdowns (`Location → Grade → Subject → School`) from local predefined data
- Google Apps Script backend that stores responses in Google Sheets (`Responses` sheet)
- Automatic Unique ID generation (`SF + MMM + YY + serial`, e.g. `SFMAR26001`)

## Files

- `index.html`: Front-end form UI and cascading dropdown logic.
- `apps-script/Code.gs`: Google Apps Script backend for validation, ID generation, and Google Sheets storage.

## Setup

1. Open Google Sheets and create a spreadsheet for responses.
2. Open **Extensions → Apps Script** and paste `apps-script/Code.gs` content.
3. Deploy as web app:
   - Execute as: **Me**
   - Who has access: **Anyone** (or as needed)
4. Copy the deployment URL and replace `SCRIPT_URL` in `index.html`.
5. Serve `index.html` through any static server or hosting.

## Sheet Columns

The script ensures this header row in `Responses`:

`UniqueID | Timestamp | Name | Mobile | RollNumber | Location | Grade | Subject | School`
