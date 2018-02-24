'use strict';
window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('form-contact');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {

            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {


                $("#btnSubmit").attr("disabled", true);
                event.preventDefault();

                // get values from FORM
                var name = $("input#name").val();
                var email = $("input#email").val();
                var message = $("textarea#note").val();
                var firstName = name; // For Success/Failure Message
                // Check for white space in name for Success/Fail message
                if (firstName.indexOf(' ') >= 0) {
                    firstName = name.split(' ').slice(0, -1).join(' ');
                }
                $.ajax({
                    url: "././mail/contact_me.php",
                    type: "POST",
                    data: {
                        name: name,
                        email: email,
                        message: message
                    },
                    cache: false,
                    success: function () {
                        // Enable button & show success message
                        $("#btnSubmit").attr("disabled", false);
                        $('#success').html("<div class='alert alert-success'>");
                        $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('#success > .alert-success')
                            .append("<strong>Sua mensgem foi enviada. </strong>");
                        $('#success > .alert-success')
                            .append('</div>');

                        //clear all fields
                        $('#contactForm').trigger("reset");
                    },
                    error: function () {
                        // Fail message
                        $('#success').html("<div class='alert alert-danger'>");
                        $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('#success > .alert-danger').append("<strong>Ops! parece que temos um problema, tente novamente mais tarde.");
                        $('#success > .alert-danger').append('</div>');
                        //clear all fields
                        $('#contactForm').trigger("reset");
                    },
                });

            }
            form.classList.add('was-validated');
        }, false);
    });
}, false);

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("btn-scroll").style.display = "block";
    } else {
        document.getElementById("btn-scroll").style.display = "none";
    }
}


$('#btn-scroll').click(function () {      // When arrow is clicked
    $('body,html').animate({
        scrollTop: 0                       // Scroll to top of body
    }, 500);
});