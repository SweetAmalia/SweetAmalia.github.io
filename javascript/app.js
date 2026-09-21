const status = document.getElementById('flight-status');
const flights = document.getElementById('flight-list');

const API_BASE_URL =
    'https://sweetamalia-github-io.onrender.com';

async function loadFlights() {
    status.textContent = 'Flights are loading...';
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
                `Backend gave status ${response.status}`
            );
        }

        const data = await response.json();

        console.log(
            'Backend flight data:',
            data
        );

        const departures = (data.flights ?? []).slice(0, 2);

        console.log(
            'Amount of flights:',
            departures.length
        );

        if (departures.length === 0) {
            status.textContent =
                'No actual departing flights found.';

            flights.textContent =
                'No flights departing found.';

            return;
        }

        departures.forEach((flight) => {
            const item = document.createElement('p');

            const destination =
                flight.route?.destinations?.join(', ') ||
                'Unknown';

            const time =
                flight.scheduleDateTime
                    ? new Date(
                        flight.scheduleDateTime
                    ).toLocaleTimeString('nl-NL', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    : 'Unknown';

            const gate =
                flight.gate || 'Unknown';

            item.textContent =
                `${flight.flightName ?? 'Unknown'} — ` +
                `${destination} — ` +
                `${time} — Gate ${gate}`;

            flights.appendChild(item);
        });

        status.textContent =
            `Departing flights (${departures.length}):`;

    } catch (error) {
        console.error(
            'Error loading flights:',
            error
        );

        status.textContent =
            'Error while loading flights.';

        flights.textContent =
            error.message;
    }
}

loadFlights();
