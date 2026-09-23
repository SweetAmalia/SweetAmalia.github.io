const form = document.querySelector("#contact-form");

const fields = [
    {id: "name", message: "Vul minimaal 2 tekens in." },
    {id: "email", message: "Vul een valide e-mail in." },
    {id: "message", message: "Schrijf minimaal 10 tekens." },
];

function validateField(field) {
    const input = document.querySelector(`#${field.id}`);
    const mistake = document.querySelector(`#${field.id}-error`);
    const valid = input.checkValidity();

    input.setAttribute("aria-invalid", String(!valid));
    mistake.textContent = valid ? "" : field.message;
    return valid;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const allevalid = fields.map(validateField).every(Boolean);
    const status = document.querySelector("#form-status");

    if (!allevalid) {
        status.textContent = "There are still errors in the form.";
        return;
    }

    status.textContent = "Your message has been sent, Thank you!";
    form.reset();
});


