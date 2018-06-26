document.addEventListener('DOMContentLoaded', function() {
    $('.modal').modal();
  });

$(document).ready(function() {
    var request;
    var totalSimulacao = 0.0;
    var quantidadeSensores = 0;

    $('.draggable-icon').each(function() {
        $(this).draggable({
            appendTo: "body",
            cursor: "move",
            helper: 'clone',
            revert: "true"
        });
    });
    
    $(".stackDrop").droppable({
        tolerance: "intersect",
        accept: ".draggable-icon",
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        drop: function(event, ui) {
            if ($(ui.draggable).hasClass('new')) {
                $('.new').draggable({
                    revert: true
                });
            } else {
                $(".stackDrop").find("span").remove();
                $(".stackDrop").removeClass("no-item");

                var toAppend = $(ui.draggable).clone();
            
                $(toAppend).draggable({
                    helper: "original"
                }).addClass('new');

                var valorSensor = $(toAppend).attr("valor");

                totalSimulacao += parseFloat(valorSensor);
                $("#valorTotal").val("Valor Total da Simulação : R$" + totalSimulacao);
    
                $(toAppend).addClass("dragged-in");
                $(this).append(toAppend);

                quantidadeSensores += 1;
            }
        },
        out: function (event, ui) {
            var valorSensor = $(ui.draggable).attr("valor");

            if (totalSimulacao > 0) {
                totalSimulacao -= parseFloat(valorSensor);
            }
            if (quantidadeSensores > 0) {
                quantidadeSensores -= 1;

                $("#valorTotal").val("Valor Total da Simulação : R$" + totalSimulacao);

                if (quantidadeSensores == 0) {
                    $("#valorTotal").val("");

                    $(".stackDrop").addClass("no-item");
                    $(".stackDrop").append("<span style='text-align: center'>Arraste os sensores desejados aqui!</span>");
                }
                console.log("removing");
                $(ui.draggable).remove();
            }
        }
    });

    $("#lightButton").click(function(e) {
        if ($("#lightStatus").is(":checked")) {
            $("#top").css("background", "#161616");
            $("#top").css("color", "#fff");
            $("#team").css("background", "#161616");

            $("#team .card-avatar .card-content").css("background", "#161616");
            $("#team .card-avatar .card-content a").css("color", "#fff");

            $("#work").css("color", "#fff", "important");
            $("#work a").css("color", "#fff", "important");
            $("#work .text_b").css("color", "#fff", "important");
            $("#work").css("background", "#161616");

            $(".stackDrop a").css("color", "#000");
        } else {
            $("#top").css("background", "#fff");
            $("#top").css("color", "#000");
            $("#team").css("background", "rgb(247, 247, 247)");

            $("#team .card-avatar .card-content").css("background", "#fff");
            $("#team .card-avatar .card-content a").css("color", "#000");

            $("#work").css("color", "#004063");
            $("#work span").css("color", "#000", "important");
            $("#work .text_b").css("color", "#004063", "important");
            $("#work").css("background", "rgb(247, 247, 247)");

            $(".stackDrop a").css("color", "#000");
        }
    });

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
            $('#modalContactErrorName').modal('open');
            return;
        }

        if ($email == '') {
            $('#modalContactErrorEmail').modal('open');
            return;   
        }

        if ($texto == '') {
            $('#modalContactErrorText').modal('open');
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
            $('#modalContactSuccess').modal('open');
        });

        request.fail(function (jqXHR, textStatus, errorThrown){
            $("#contactForm")[0].reset();
            $('#modalContactError').modal('open');
        });

        request.always(function () {
            $inputs.prop("disabled", false);
        });
    });

});
