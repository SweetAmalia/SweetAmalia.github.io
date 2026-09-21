const status = document.getElementById('flight-status');
const flights = document.getElementById('flight-list');

const API_BASE_URL =
    'https://sweetamalia-github-io.onrender.com';

async function laadVluchten() {
    status.textContent = 'Vluchten worden geladen...';
    flights.replaceChildren();

    try {
        console.log('Calling backend...');

        const response = await fetch(
            `${API_BASE_URL}/api/flights`
        );

        console.log(
            'Backend response status:',
            response.status
        );

        if (!response.ok) {
            const errorText = await response.text();

            console.error(
                'Backend returned an error:',
                errorText
            );

            throw new Error(
                `Backend gaf status ${response.status}`
            );
        }

        const data = await response.json();

        console.log(
            'Backend flight data:',
            data
        );

        const departures = data.flights ?? [];

        console.log(
            'Aantal vluchten:',
            departures.length
        );

        if (departures.length === 0) {
            status.textContent =
                'Geen actuele vertrekkende vluchten gevonden.';

            flights.textContent =
                'Geen vertrekkende vluchten gevonden.';

            return;
        }

        departures.forEach((flight) => {
            const item = document.createElement('p');

            const destination =
                flight.route?.destinations?.join(', ') ||
                'Onbekend';

            const time =
                flight.scheduleDateTime
                    ? new Date(
                        flight.scheduleDateTime
                    ).toLocaleTimeString('nl-NL', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    : 'Onbekend';

            const gate =
                flight.gate || 'Onbekend';

            item.textContent =
                `${flight.flightName ?? 'Onbekend'} — ` +
                `${destination} — ` +
                `${time} — Gate ${gate}`;

            flights.appendChild(item);
        });

        status.textContent =
            `Actuele vertrekkende vluchten (${departures.length}):`;

    } catch (error) {
        console.error(
            'Fout bij laden van vluchten:',
            error
        );

        status.textContent =
            'Fout bij het laden van de vluchten.';

        flights.textContent =
            error.message;
    }
}

laadVluchten();
