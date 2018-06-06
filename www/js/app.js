$(document).ready(function() {
    var request;

    $("#submitContact").click(function(e) {
        e.preventDefault();

        if (request) {
            request.abort();
        }

        var $form = $("#contactForm");

        var $email = $("#contactForm input[name=email]").val();
        var $nome = $("#contactForm input[name=name]").val();
        var $texto = $("#contactForm input[name=message]").val();

        if ($nome == "") {
            $('#modalContactErrorName').openModal();
            return;
        }

        if ($email == '') {
            $('#modalContactErrorEmail').openModal();
            return;   
        }

        if ($texto == '') {
            $('#modalContactErrorText').openModal();
            return;   
        }

        var $inputs = $form.find("input, select, button, textarea");

        var serializedData = $form.serialize();

        $inputs.prop("disabled", true);

        request = $.ajax({
            url: "contact.php",
            type: "post",
            data: serializedData
        });

        request.done(function (response, textStatus, jqXHR){
            $("#contactForm")[0].reset();
            $('#modalContactSuccess').openModal();
        });

        request.fail(function (jqXHR, textStatus, errorThrown){
            $("#contactForm")[0].reset();
            $('#modalContactError').openModal();
        });

        request.always(function () {
            $inputs.prop("disabled", false);
        });
    });

});
