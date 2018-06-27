document.addEventListener('DOMContentLoaded', function() {
    $('.modal').modal();
    
    $('.button-collapse-owl').sideNav({
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });
});

$(document).ready(function() {
    var request;
    var totalSimulacao = 249;
    var quantidadeSensores = 0;

    var valorEsp = 24;

    $('.draggable-icon').each(function() {
        $(this).draggable({
            appendTo: "body",
            cursor: "move",
            helper: 'clone',
            revert: "true"
        });
    });
    
    $(".stackDrop").droppable({
        tolerance: "pointer", 
        accept: ".draggable-icon",
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        drop: function(event, ui) {
            if ($(ui.draggable).hasClass('new')) {
                $('.new').draggable({
                    revert: true
                });
            } else {
                $("#dragImg").remove();
                $(".stackDrop").removeClass("no-item");

                var toAppend = $(ui.draggable).clone();
            
                $(toAppend).draggable({
                    helper: "original"
                }).addClass('new');

                var valorSensor = parseFloat($(toAppend).attr("valor")) + valorEsp;

                totalSimulacao += parseFloat(valorSensor);
                $("#valorTotal").text("TOTAL SIMULAÇÃO : R$" + totalSimulacao.toFixed(2));
    
                $(toAppend).addClass("dragged-in");
                $(this).append(toAppend);

                quantidadeSensores += 1;
            }
        },
        out: function (event, ui) {
            if (!$(ui.draggable).hasClass('new')) {
                return;
            }
            var valorSensor = $(ui.draggable).attr("valor");

            if (totalSimulacao > 0) {
                totalSimulacao -= (parseFloat(valorSensor) + valorEsp);
            }
            if (quantidadeSensores > 0) {
                quantidadeSensores -= 1;

                $("#valorTotal").text("TOTAL SIMULAÇÃO : R$" + totalSimulacao.toFixed(2));

                if (quantidadeSensores == 0) {
                    $("#valorTotal").text("");

                    $(".stackDrop").addClass("no-item");

                    if ($("#lightStatus").is(":checked")) {
                        $(".stackDrop").append("<img id='dragImg' src='img/drag.png' style='width: 350px; height: 400px; opacity: 0.8; margin-top: 10%;'/>");
                    } else {
                        $(".stackDrop").append("<img id='dragImg' src='img/drag_w.png' style='width: 350px; height: 400px; opacity: 0.8; margin-top: 10%;'/>");    
                    }
                }
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

            $("#cardDraggable").css("background", "#161616");
            $(".stackDrop").css("background", "#161616");
            $("#ui-droppable-active").css("background", "#161616");
            $("#draggable-icon > div > a").css("color", "#fff");
            $("#valorTotal").css("color", "#fff");

            $("#dragImg").remove();
            $(".stackDrop").append("<img id='dragImg' src='img/drag_w.png' style='width: 350px; height: 400px; opacity: 0.8; margin-top: 10%;'/>");
        } else {
            $("#top").css("background", "#fff");
            $("#top").css("color", "#000");
            $("#team").css("background", "rgb(247, 247, 247)");

            $("#team .card-avatar .card-content").css("background", "#fff");
            $("#team .card-avatar .card-content a").css("color", "#000");

            $("#work").css("color", "#004063");
            $("#work a").css("color", "#000", "important");
            $("#work .text_b").css("color", "#004063", "important");
            $("#work").css("background", "rgb(247, 247, 247)");

            $("#cardDraggable").css("background", "#fff");
            $(".stackDrop").css("background", "#fff");
            $("#ui-droppable-active").css("background", "#fff");
            $("#draggable-icon > div > a").css("color", "#000");
            $("#valorTotal").css("color", "#000");

            $("#dragImg").remove();
            $(".stackDrop").append("<img id='dragImg' src='img/drag.png' style='width: 350px; height: 400px; opacity: 0.8; margin-top: 10%;'/>");
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
