const form = document.querySelector("#contact-form");

const velden = [
    {id: "naam", boodschap: "Vul minimaal 2 tekens in." },
    {id: "email", boodschap: "Vul een geldige e-mail in." },
    {id: "bericht", boodschap: "Schrijf minimaal 10 tekens." },
];

function valideerVeld(veld) {
    const input = document.querySelector(`#${veld.id}`);
    const foutmelding = document.querySelector(`#${veld.id}-error`);
    const geldig = input.checkValidity();

    input.setAttribute("aria-invalid", String(!geldig));
    foutmelding.textContent = geldig ? "" : veld.boodschap;
    return geldig;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const alleGeldig = velden.map(valideerVeld).every(Boolean);
    const status = document.querySelector("#form-status");

    if (!alleGeldig) {
        status.textContent = "Er zijn nog fouten in het formulier.";
        return;
    }

    status.textContent = "Bericht verzonden! Bedankt.";
    form.reset();
});


