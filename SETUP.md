# TSVC Studio — Google Sheets + Email Setup Guide
## Οδηγίες Σύνδεσης Φόρμας με Google Sheets & Email

---

## Τι κάνει αυτό το σύστημα

Κάθε φορά που κάποιος συμπληρώνει τη φόρμα:

1. ✅ Τα δεδομένα αποθηκεύονται αυτόματα σε **Google Sheet**
2. ✅ Λαμβάνεις **email notification** με όλα τα στοιχεία
3. ✅ Έχεις **πλήρες ιστορικό** από κάθε υποβολή

Κόστος: **ΔΩΡΕΑΝ** — χρησιμοποιεί μόνο Google υπηρεσίες.

---

## Βήμα 1 — Δημιουργία Google Sheet

1. Πήγαινε στο [sheets.google.com](https://sheets.google.com)
2. Πάτα **"+ Blank"** για νέο spreadsheet
3. Ονόμασέ το: `TSVC Studio — Briefs`
4. Άφησε το **ανοιχτό** (το Apps Script θα βρει το πρώτο sheet αυτόματα)

---

## Βήμα 2 — Δημιουργία Google Apps Script

1. Στο Google Sheet, πάτα **Extensions → Apps Script**
2. Άνοιξε το αρχείο `Code.gs` (διαγράφει ό,τι υπάρχει)
3. Άνοιξε το αρχείο `google-apps-script.gs` από αυτόν το φάκελο
4. **Copy-paste** όλο το περιεχόμενο στο Apps Script editor
5. Άλλαξε τις δύο γραμμές στην αρχή:

```javascript
const SHEET_NAME         = 'Briefs';           // ← αυτό μπορεί να μείνει ως έχει
const NOTIFICATION_EMAIL = 'your@email.com';   // ← βάλε το δικό σου email εδώ
```

6. Πάτα **Save** (Ctrl+S)

---

## Βήμα 3 — Deploy ως Web App

1. Πάτα **Deploy → New deployment**
2. Στο "Select type" πάτα το ⚙️ gear → **Web app**
3. Συμπλήρωσε τα εξής:

| Πεδίο | Τιμή |
|---|---|
| Description | TSVC Form Handler |
| Execute as | **Me** (your Google account) |
| Who has access | **Anyone** |

4. Πάτα **Deploy**
5. Θα σου ζητήσει να δώσεις permissions — πάτα **"Allow"**
6. Θα εμφανιστεί ένα **Web App URL** — αντίγραψέ το

Μοιάζει κάπως έτσι:
```
https://script.google.com/macros/s/AKfycbxXXXXXXXXX/exec
```

---

## Βήμα 4 — Σύνδεση με τη φόρμα

1. Άνοιξε το αρχείο `work-with-us.html`
2. Βρες αυτή τη γραμμή (κοντά στο τέλος):

```javascript
const APPS_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
```

3. Αντικατάστησε το `PASTE_YOUR_APPS_SCRIPT_URL_HERE` με το URL που έχεις αντιγράψει:

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXXXXXXXXX/exec';
```

4. **Αποθήκευσε** και ανέβασε ξανά τα αρχεία στον server σου.

---

## Βήμα 5 — Test

1. Άνοιξε τη σελίδα `work-with-us.html` σε browser
2. Συμπλήρωσε τη φόρμα με test δεδομένα
3. Πάτα Submit
4. Ελέγξε:
   - ✅ Google Sheet → νέα γραμμή εμφανίστηκε
   - ✅ Email inbox → ήρθε το notification email

---

## Αντιμετώπιση Προβλημάτων

**Δεν έρχεται email:**
- Βεβαιώσου ότι το `NOTIFICATION_EMAIL` είναι το σωστό email
- Ελέγξε spam/junk folder
- Redeploy το Apps Script μετά από κάθε αλλαγή

**"Something went wrong" error:**
- Βεβαιώσου ότι το "Who has access" είναι **Anyone** (όχι "Anyone with Google account")
- Κάνε redeploy: Deploy → Manage deployments → Edit → New version

**Redeploy μετά από αλλαγές:**
Κάθε φορά που αλλάζεις κώδικα στο Apps Script, πρέπει να κάνεις:
Deploy → Manage deployments → Edit → **New version** → Deploy
(Το URL παραμένει το ίδιο)

---

## Δομή Google Sheet

Δημιουργείται αυτόματα με header row:

| Timestamp | Full Name | Email | Brand | Platform | Service | Budget | Message |
|---|---|---|---|---|---|---|---|
| 15/4/2025 14:30 | John Smith | john@... | Nike GR | Instagram | Short-Form | €500–€1k | We want... |

---

## Σημείωση

Το Google Apps Script έχει δωρεάν όριο:
- **20,000 emails/day** (πολύ παραπάνω από αρκετό)
- **Unlimited** Google Sheet writes

Για ένα agency website αυτό δεν θα φτάσεις ποτέ στο όριο.
