# Waitlist capture — Google Sheets (free, no cap)

The landing's waitlist form posts emails to a **Google Apps Script web app** that
appends each signup to a Google Sheet. Free, unlimited, and the data lives in a
spreadsheet you can analyze/export.

## One-time setup (~3 min)

1. Create a Google Sheet named e.g. **Tally Waitlist**. In row 1 add headers:
   `timestamp` · `email` · `source`
2. In the Sheet: **Extensions → Apps Script**. Delete the stub and paste:

   ```js
   function doPost(e) {
     try {
       var data = JSON.parse(e.postData.contents);
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
       sheet.appendRow([new Date(), data.email || "", data.source || "landing"]);
       return ContentService
         .createTextOutput(JSON.stringify({ ok: true }))
         .setMimeType(ContentService.MimeType.JSON);
     } catch (err) {
       return ContentService
         .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
         .setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```

3. **Deploy → New deployment → ⚙ → Web app.**
   - Description: `tally waitlist`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - **Deploy**, authorize the permissions, and copy the **Web app URL** (ends in `/exec`).

4. Paste that URL into `WAITLIST_ENDPOINT` in
   [`frontend/src/landing/Waitlist.tsx`](../frontend/src/landing/Waitlist.tsx),
   commit, and push — GitHub Actions redeploys automatically.

## Notes
- The browser sends a `no-cors` POST with a `text/plain` body (Apps Script can't
  answer a CORS preflight). The response is opaque, so the form treats a
  network-success as confirmed. Emails still land in the Sheet.
- The `/exec` URL is not a secret, but anyone with it can POST to your sheet. If
  it gets spammed, redeploy to rotate the URL (or add a shared-token check in
  `doPost`).
- To export: **File → Download → CSV**, or query it from Colab via `gspread`.
