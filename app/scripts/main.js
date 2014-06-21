'use strict';

var answers = [];


/*
    Function to display the questions
 */
function askQuestion(quizData, template, currentQuestion) {

    /*
        Populate Handlebars template
     */
    var context  = quizData[currentQuestion];
    var html     = template(context);

    document.getElementById('quiz').innerHTML = html;
    // jQuery alternative:   $('#quiz').html(html);

    /*
        If answer has already been made, show it (for ex. in case of Prev/Next navigation)
     */
    if(answers[currentQuestion]) {
        var id = answers[currentQuestion];
        document.getElementById(id).setAttribute('checked', 'checked');
        // jQuery: $('#' + id).attr('checked', 'checked');
    }

    /*
        Record the choice selection as an answer
     */
    var nodes = document.querySelectorAll('input[name=choices]');

    function makeClickHandler(el) {
        return function() {
            answers[currentQuestion] = el;
        };
    }

    for(var i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener('click', makeClickHandler(nodes[i].id));
    }

    /* jQuery:
    $('input[name=choices]').click(function(e){
        answers[currentQuestion] = e.target.id;
    });
    */

}

function init() {

    var currentQuestion = 0;
    var quizData;

    /*
     Create Handlebars
     */

    var source = document.getElementById('quiz-template').innerHTML;
    // jQuery: var source = $('#quiz-template').html();
    var template = Handlebars.compile(source);


    /*
         Get the quiz data
     */
    function reqListener() {
        quizData = this.responseText;
        quizData = JSON.parse(quizData);
        askQuestion(quizData, template, currentQuestion);
    }

    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open('get', 'data/australian-citizenship.json', true);
    oReq.send();
    /* jQuery:
    $.getJSON('data/australian-citizenship.json', function (data) {
        quizData = data;
        askQuestion(quizData, template, currentQuestion);
    });
    */

    /*
     Register click event for previous and next buttons
     */
    document.addEventListener('click', function(e) {
    // jQuery: $('#prevButton, #nextButton').on('click', function (e) {

        /*
         Check if question has been answered
         */
        if (e.target.id === 'nextButton' && !answers[currentQuestion]) {
            var elRemove = document.getElementById('remove');
            if (elRemove !== null) {
                elRemove.parentNode.removeChild(elRemove);
            }

            var elError = document.createElement('p');
            elError.setAttribute('id', 'remove');
            elError.appendChild(document.createTextNode('Please, answer this question first!'));
            document.getElementById('quiz').appendChild(elError);
            // jQuery:
            // $('#error').remove();
            // $('#quiz').append('<p id="error">Please, answer this question first!</p>');
            return;
        }

        /*
         Handle Next/Previous buttons
         */
        if (e.target.id === 'nextButton' && quizData[currentQuestion + 1]) {
            currentQuestion++;
            askQuestion(quizData, template, currentQuestion);
        } else if (e.target.id === 'prevButton' && quizData[currentQuestion - 1]) {
            currentQuestion--;
            askQuestion(quizData, template, currentQuestion);
        }

        /*
         Enable/Disable buttons at the start/end
         */
        switch (currentQuestion) {
            //the first
            case 0:
                document.getElementById('prevButton').setAttribute('disabled', 'disabled');
                // jQuery: $('#prevButton').attr('disabled', 'disabled');
                break;

            //the last
            case quizData.length - 1:
                document.getElementById('nextButton').setAttribute('disabled', 'disabled');
                // jQuery: $('#nextButton').attr('disabled', 'disabled');
                break;

            //somewhere in between
            default:
                document.getElementById('prevButton').removeAttribute('disabled');
                document.getElementById('nextButton').removeAttribute('disabled');
                //$('#prevButton, #nextButton').removeAttr('disabled');

        }
    });

}

window.onload = function() {
    init();
};

//    jQuery: On document ready
//    $(function() {});