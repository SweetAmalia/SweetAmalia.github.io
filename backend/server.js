import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://sweetamalia.github.io'
}));

const SCHIPHOL_TOKEN_URL =
    'https://api.auth.schiphol.nl/oauth/token';

const SCHIPHOL_FLIGHTS_URL =
    'https://api.schiphol.nl/public/public-flights/v4/flights';

const SCHIPHOL_AUDIENCE =
    'https://api.schiphol.nl/public';

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
    const now = Date.now();

    if (
        cachedToken &&
        tokenExpiresAt > now + 60_000
    ) {
        return cachedToken;
    }

    const clientId = process.env.SCHIPHOL_CLIENT_ID;
    const clientSecret = process.env.SCHIPHOL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error(
            'SCHIPHOL_CLIENT_ID or SCHIPHOL_CLIENT_SECRET is missing.'
        );
    }

    const body = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        audience: SCHIPHOL_AUDIENCE
    });

    const response = await fetch(SCHIPHOL_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body
    });

    const responseText = await response.text();

    if (!response.ok) {
        console.error(
            'Schiphol token request failed:',
            response.status,
            responseText
        );

        throw new Error(
            `Schiphol authentication failed (${response.status}).`
        );
    }

    let tokenData;

    try {
        tokenData = JSON.parse(responseText);
    } catch {
        throw new Error(
            'Schiphol returned an invalid token response.'
        );
    }

    if (!tokenData.access_token) {
        throw new Error(
            'Schiphol token response did not contain an access_token.'
        );
    }

    cachedToken = tokenData.access_token;

    const expiresIn =
        Number(tokenData.expires_in) || 1800;

    tokenExpiresAt =
        Date.now() + expiresIn * 1000;

    return cachedToken;
}

async function getFlights() {
    const accessToken = await getAccessToken();

    const url = new URL(SCHIPHOL_FLIGHTS_URL);

    url.searchParams.set('flightDirection', 'D');
    url.searchParams.set('page', '0');
    url.searchParams.set('sort', '+scheduleTime');

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const responseText = await response.text();

    if (!response.ok) {
        console.error(
            'Schiphol Flight API failed:',
            response.status,
            responseText
        );

        if (response.status === 401) {
            cachedToken = null;
            tokenExpiresAt = 0;
        }

        throw new Error(
            `Schiphol Flight API returned ${response.status}.`
        );
    }

    try {
        return JSON.parse(responseText);
    } catch {
        throw new Error(
            'Schiphol returned an invalid JSON response.'
        );
    }
}

app.get('/api/flights', async (req, res) => {
    try {
        const data = await getFlights();

        res.json(data);
    } catch (error) {
        console.error('Flight request error:', error);

        res.status(500).json({
            error: error.message || 'Unknown server error'
        });
    }
});


app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        service: 'schiphol-flight-app'
    });
});


app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});
