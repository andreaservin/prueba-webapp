const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
app.use(cors());
app.cors({
    origin: 'https://andreaservin.github.io',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
});
app.use(express.json());

// ⚠️ Poner esto en Railway como variable de entorno
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = '1aR9PCLzEjtu14aitS2L0JmH_qj4mFLj6VlaetSIiAX4';

app.post('/guardar', async (req, res) => {
    try {
        const { hora, ticket, obs } = req.body;

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Hoja1!A1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    new Date().toLocaleString(),
                    hora,
                    ticket,
                    obs
                ]]
            }
        });

        res.json({ result: 'success' });

    } catch (error) {
        console.error(error);
        res.json({ result: 'error', message: error.message });
    }
});

// health check
app.get('/', (req, res) => {
  res.send('API funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running'));