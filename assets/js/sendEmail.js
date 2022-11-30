function sendMail(contactForm) {
    emailjs.send("service_e8zu2zi", "rosie", {
        //keys for this object are all equal to the
        //parameters names that we've set in our email
        //template back on EmailJS
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "project_request": contactForm.projectsummary.value
    })
    .then(
        function(response) {
            console.log("Success", response);
        },
        function(error) {
            console.log("Failed", error);
        });
    return false;  // To block from loading a new page
}  