'use strict';

var answers = [];

/*
    Function to display the questions
 */
function askQuestion(quizData, currentQuestion) {

    $('#quiz').empty();

    $('#quiz').append('<h3>' + quizData[currentQuestion].question + '</h3>');
    for (var iChoice in quizData[currentQuestion].choices) {
        var iChoiceVal = quizData[currentQuestion].choices[iChoice];
        $('#quiz')
            .append(
                '<input type="radio" name="choices" id="choice' + iChoice + '" value="' + iChoice + '">' +
                '<label for=choice' + iChoice + '>' + iChoiceVal + '</label><br>'
        );
    }

    /*
        If choice has been already made, show it (for ex. in case of Prev/Next navigation)
     */
    if(answers[currentQuestion]) {
        var id = '#' + answers[currentQuestion];
        $(id).attr('checked', 'checked');
    }

    /*
        Handle choice selection
     */
    $('input[name=choices]').click(function(e){
        answers[currentQuestion] = e.target.id;
    });

}


/*
    On document ready
 */
$(function(){

    var currentQuestion = 0;
    var quizData;


    /*
        Get the quiz data
     */
    $.getJSON('data/australian-citizenship.json', function(data) {
        quizData = data;
        askQuestion(quizData, currentQuestion);
    });


    /*
        Register click event for previous and next buttons
     */
    $('#prevButton, #nextButton').on('click', function(e) {

        /*
            Check if question has been answered
         */
        if(e.target.id === 'nextButton' && !answers[currentQuestion]) {
            $('#error').remove();
            $('#quiz').append('<p id="error">Please, answer this question first!</p>');
            return;
        }

        /*
            Handle Next/Previous buttons
         */
        if(e.target.id === 'nextButton' && quizData[currentQuestion + 1]) {
            currentQuestion++;
            askQuestion(quizData, currentQuestion);
        } else if(e.target.id === 'prevButton' && quizData[currentQuestion - 1]) {
            currentQuestion--;
            askQuestion(quizData, currentQuestion);
        }

        /*
            Enable/Disable buttons at the start/end
         */
        switch(currentQuestion) {
            //the first
            case 0:
                $('#prevButton').attr('disabled', 'disabled');
                break;

            //the last
            case quizData.length - 1:
                $('#nextButton').attr('disabled', 'disabled');
                break;

            //somewhere in between
            default:
                $('#prevButton, #nextButton').removeAttr('disabled');

        }
    });

});
