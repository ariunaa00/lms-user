const token = localStorage.getItem("token");

const firstnameInput = document.getElementById('firstname')
const lastnameInput = document.getElementById('lastname')
const emailInput = document.getElementById('email')
const phonenumInput = document.getElementById('phonenum')
const passInput = document.getElementById('password')
const repassInput = document.getElementById('re-password')

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = atob(base64Url);
    return JSON.parse(base64);
}

const checkUser = () => {
    if (token) {
        const payload = parseJwt(token);
        const expiresAt = payload.exp * 1000;

        if (Date.now() < expiresAt) {
            window.location.replace('index.html')
        }
    }
}

checkUser();

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;


    if (validate()) {

        const res = await fetch("http://44.222.255.219:3000/api/v1/auth/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            window.location.replace('index.html')
        } else {
            console.log(data);
            alert(data.message);
        }
    }

})




const validate = () => {
    const eraseMsgs = () => {
        const spans = document.querySelectorAll('.error-msg');
        const inputs = document.querySelectorAll('.input');

        spans.forEach((span) => {
            span.innerText = ''
        })
        inputs.forEach((input) => {
            input.className = 'input'
        })
    }
    eraseMsgs();
    const emailInput = document.getElementById('email-login')
    const passInput = document.getElementById('password-login')

    const erremailInput = document.getElementById('email-err')
    const errpassInput = document.getElementById('password-err')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{8}$/;

    let errors = []

    if (emailInput.value.trim() === '') {
        erremailInput.innerText = 'И-мэйл заавал оруулна уу.'
        emailInput.className = `${emailInput.className} warning-input`
        errors.push(1)
    }

    if (!emailRegex.test(emailInput.value)) {
        erremailInput.innerText = 'Буруу и-мэйл байна.'
        emailInput.className = `${emailInput.className} warning-input`
        errors.push(1)
    }

    if (passInput.value.trim() === '') {
        errpassInput.innerText = 'Нууц үг заавал оруулна уу.'
        passInput.className = `${passInput.className} warning-input`
        errors.push(1)
    }

    return errors.length === 0;
}