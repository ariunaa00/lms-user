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
            window.location.replace('file:///C:/Users/Kaizen/Desktop/examination-system/examination-system-front/index.html')
        }
    }
}

checkUser();

const signinForm = document.getElementById("signin-form");

const errorMessage = document.getElementById("error");


signinForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page reload

    if (validate()) {

        const res = await fetch("http://44.222.255.219:3000/api/v1/auth/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstname: firstnameInput.value,
                lastname: lastnameInput.value,
                email: emailInput.value,
                phoneNumber: phonenumInput.value,
                password: passInput.value
            })
        })

        const data = await res.json();
        if (res.ok) {
            alert('Амжилттай бүртгэгдлээ.')
            window.location.replace("login.html");
        } else {
            alert(data.message);
        }

    }
});



const validatePassword = (password) => {
    const errors = [];

    if (password.length < 6) {
        errors.push("Нууц үг 6-аас багагүй урттай байх ёстой.");
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("Дор хаяж нэг том үсэг оруулах шаардлагатай.");
    }

    if (!/[!@#$%^&*]/.test(password)) {
        errors.push("Дор хаяж нэг тэмдэгт (!@#$%^&*) оруулах шаардлагатай.");
    }

    return errors;
}

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

    const errfirstnameInput = document.getElementById('firstname-err')
    const errlastnameInput = document.getElementById('lastname-err')
    const erremailInput = document.getElementById('email-err')
    const errphonenumInput = document.getElementById('phonenum-err')
    const errpassInput = document.getElementById('password-err')
    const errrepassInput = document.getElementById('repassword-err')


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{8}$/;

    let errors = []

    if (firstnameInput.value.trim() === '') {
        errfirstnameInput.innerText = 'Овог заавал оруулна уу.'
        firstnameInput.className = `${firstnameInput.className} warning-input`
        errors.push(1)
    }

    if (lastnameInput.value.trim() === '') {
        errlastnameInput.innerText = 'Нэр заавал оруулна уу.'
        lastnameInput.className = `${lastnameInput.className} warning-input`
        errors.push(1)
   
    }

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

    if (!phoneRegex.test(phonenumInput.value)) {
        errphonenumInput.innerText = 'Буруу дугаар байна.'
        phonenumInput.className = `${phonenumInput.className} warning-input`
        errors.push(1)
   
    }

    if (passInput.value.trim() === '') {
        errpassInput.innerText = 'Нууц үг заавал оруулна уу.'
        passInput.className = `${passInput.className} warning-input`
        errors.push(1)
   
    }

    if (repassInput.value.trim() === '') {
        errrepassInput.innerText = 'Нууц үг давтаж заавал оруулна уу.'
        repassInput.className = `${repassInput.className} warning-input`
        errors.push(1)
   
    }

    const passerrs = validatePassword(passInput.value)
    const passerrstr = passerrs.join(', ')
    if (passerrstr !== '') {
        errpassInput.innerText = passerrstr
        passInput.className = `${passInput.className} warning-input`
        errors.push(1)
   
    }

    if (passInput.value !== repassInput.value) {
        errrepassInput.innerText = 'Нууц үгтэй таарахгүй байна.'
        repassInput.className = `${repassInput.className} warning-input`
        errors.push(1)
 
    }

    return errors.length === 0;

}