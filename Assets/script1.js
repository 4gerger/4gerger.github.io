// /**
//  * On Game Page
//  */
// // Prepare Global Variables

var questions = [
    {
        questions: "Commonly used data types do not include..",
        answer: [
            { text: "(a) string", correct: false },
            { text: "(b) boolean", correct: false },
            { text: "(c) number", correct: false },
            { text: "(d) alerts", correct: true },
            { text: "(e) object", correct: false },
            { text: "(f) arrays", correct: false },
        ]
    },
    {
        questions: "Javascript file has an extension of..",
        answer: [
            { text: "(a) .Java", correct: false },
            { text: "(b) .javascript", correct: false },
            { text: "(c) .css", correct: false },
            { text: "(d) .js", correct: true },
        ]
    },
    {
        questions: "The external Javascript file MUST contain <script> tag. True or False",
        answer: [
            { text: "(a) True", correct: false },
            { text: "(b) False", correct: true },
        ]
    },
    {
        questions: "JavaScript is designed for the following purpose..",
        answer: [
            { text: "(a) to style HTML pages", correct: false },
            { text: "(b) to execute Query related DB on Server", correct: false },
            { text: "(c) to perform server side scripting operation", correct: false },
            { text: "(d) to add interactivity to HTML pages", correct: true },
        ]
    },
    {
        questions: "The operator '===' is not the same as '=='. True or False ",
        answer: [
            { text: "(a) True", correct: true },
            { text: "(b) False", correct: false },
        ]
    },
]

var timerEl = document.querySelector(".timer");
var startSectionEl = document.querySelector(".startSection");
var viewHighScoreEl = document.querySelector(".viewHighscores")
var startButtonEl = document.querySelector(".start-btn");
var questionContainerEl = document.querySelector("#question-container");
var questionEl = document.querySelector("#question");
var answerContainerEl = document.querySelector("#answer-container");
var answersEl = document.querySelector("#answer-btns");
var alertEl = document.querySelector("#alert");
var completionEl = document.querySelector("#finished");
var resultEl = document.querySelector("#final-score");

var highScores = JSON.parse(localStorage.getItem("highScores"));

var currentQuestionIndex = 0;

var score = 0;
var finalScore;
var secondsLeft = 75;

var shuffledQuestion = function (questions) {
    var newPos;
    var temp;

    for (var i = Object.keys(questions).length - 1; i > 0; i--) {
        newPos = Math.floor(Math.random() * (i + 1));
        temp = questions[i];
        questions[i] = questions[newPos];
        questions[newPos] = temp;
    }
    return questions;
};

var randomQuestions = shuffledQuestion(questions);

function startGame() {

    var timerInterval = setInterval(function () {
        secondsLeft--;
        timerEl.textContent = "Time: " + secondsLeft + "s left";

        if (secondsLeft <= 0 || currentQuestionIndex === Object.keys(randomQuestions).length) {
            clearInterval(timerInterval);
            finalScore();
            saveCurrentScore()
        }
    }, 1000);
}


function hideStartSection() {
    startSectionEl.classList.add("hide");
}

function removeQuestion() {
    var questionDiv = document.querySelector(".question");
    questionDiv.parentNode.removeChild(questionDiv);

    var answerbtn = document.querySelectorAll(".answer-btn");
    answerbtn.forEach(function (answerbtn) {
        answerbtn.parentNode.removeChild(answerbtn);
    });
}

function removeAlert() {
    var alertDiv = document.querySelectorAll(".alert-msg");
    alertDiv.forEach(function (alertDiv) {
        alertDiv.parentNode.removeChild(alertDiv);
    });
}

function displayQuestion() {

    if (currentQuestionIndex !== Object.keys(randomQuestions).length) {

        var randomQuestion = questions[currentQuestionIndex].questions;
        var questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.textContent = "Question " + [currentQuestionIndex + 1] + ": " + randomQuestion;
        questionContainerEl.appendChild(questionDiv);

        for (var i = 0; i < Object.keys(questions[currentQuestionIndex].answer).length; i++) {

            var answerbtn = document.createElement("button");
            answerbtn.classList.add("answer-btn");
            answerbtn.setAttribute("data-name", questions[currentQuestionIndex].answer[i].correct);
            answerbtn.textContent = questions[currentQuestionIndex].answer[i].text;
            answerContainerEl.appendChild(answerbtn);

        }
    }
}

function setNextQuestion() {
    var answerBtn = document.querySelectorAll(".answer-btn");

    answerBtn.forEach(answer => {
        answer.addEventListener("click", function (e) {
            if (e.target.getAttribute("data-name") == "true") {
                alertCorrect();
                score++;
                removeQuestion();
                removeAlert();
                currentQuestionIndex++
                displayQuestion();
                setNextQuestion();
            }
            else {
                alertIncorrect();
                secondsLeft -= 15;
            }
        });

    });
}

function alertIncorrect() {
    var alertMsg = document.createElement("div");
    alertMsg.classList.add("alert-msg");
    alertMsg.textContent = "Wrong!";
    alertEl.appendChild(alertMsg);
}

function alertCorrect() {
    var alertMsg = document.createElement("div");
    alertMsg.classList.add("alert-msg");
    alertMsg.textContent = "Correct!";
    alertEl.appendChild(alertMsg);
}

function saveCurrentScore() {
    var message = document.createElement("div");
    message.classList.add("message");
    message.textContent = "You are all done!";
    completionEl.appendChild(message);

    var result = document.createElement("div");
    result.classList.add("result");
    result.textContent = "Your final score is " + finalScore;
    resultEl.appendChild(result);

    var enterInitialEl = document.createElement("div");
    enterInitialEl.classList.add("enterInitialEl");
    enterInitialEl.textContent = "Enter your initials: ";
    resultEl.appendChild(enterInitialEl);

    var initialInputEl = document.createElement("INPUT");
    initialInputEl.classList.add("initialInputEl");
    initialInputEl.setAttribute("type", "text");
    resultEl.appendChild(initialInputEl);

    var submitEl = document.createElement("INPUT");
    submitEl.classList.add("submitEl");
    submitEl.setAttribute("type", "submit");
    submitEl.classList.add("submit");
    resultEl.appendChild(submitEl);


    submitEl.addEventListener("click", function() {
        
        var initials = initialInputEl.value;

        var potentialHighScore = {
            score: finalScore,
            name: initials
        };

        // highScores = localStorage.getItem("highScores");

        // highScores.push(potentialHighScore);

        localStorage.setItem("highScores", JSON.stringify(potentialHighScore));


        viewHighScoreEl.classList.add("hide");
        timerEl.classList.add("hide");
        initialInputEl.classList.add("hide");

        var message = document.querySelector(".message");
        message.parentNode.removeChild(message);

        var result = document.querySelector(".result");
        result.parentNode.removeChild(result);

        var enterInitialEl = document.querySelector(".enterInitialEl");
        enterInitialEl.parentNode.removeChild(enterInitialEl);
   
        var submitEl = document.querySelector(".submitEl");
        submitEl.parentNode.removeChild(submitEl);

    }); 

}

function highScorePage() {
    
//     viewHighScoreEl.classList.add("hide");
//     timerEl.classList.add("hide");
//     message.parentNode.removeChild(message);
//     result.parentNode.removeChild(result);
//     enterInitialEl.parentNode.removeChild(enterInitialEl);
//     initialInputEl.parentNode.removeChild(initialInputEl);
//     submitEl.parentNode.removeChild(submitEl);

}

function finalScore() {
    finalScore = score + secondsLeft * 5
    if (finalScore < 0) {
        finalScore = 0;
    }
}

// Run startTimer function AND clear everything (except highscore button and timer) AND start questions when Start quiz button is pressed
// startTimer();

startButtonEl.addEventListener("click", function () {
    hideStartSection();
    displayQuestion();
    startGame();
    setNextQuestion();

});

// }
//         // remainingSeconds --
//         // If time finished
//             // stopTimer
//             saveCurrentScore(initial)
//         // Else
//             renderTimer()
// ​
//     // Display the first question. 
//         // Get the first question. (currentQuestion = questions[currentQuestionIndex])
//         render(currentQuestion)
//         // Set onClick for each choice button
//             // When any choice is clicked
//             // Get userChoice from button (which did user choose?)
//             // Compare userChoice with answer

//             // If correct
//                 // Increment Score (score++)
//             // Else
//                 remainingSeconds--

//             // Alert user

//             // If there IS a nextQuestionIndex. (nextQuestionIndex = currentQuestionIndex + 1)
//             // If nextQuestionIndex == (question.length -1).
//                 // Get the next question (nextQuestion = questions[nextQuestionIndex])
//                 render(nextQuestion)
//             // Else, means last question ALREADY finished
//                 // stopTimer
//                 // If remainingSeconds
//                     // Add remainingSeconds to score
//                 saveCurrentScore(initial)
// ​
// function render(question) {
//     // titleEl = doc.getTitle
//     // choiceListEl = doc.getChoices
// ​
//     // question.getTitle
//     // question.getChoices
//     // question.getAnswer
// ​
//     // titleEl.text = questionTitle
//     // choiceListEl = questionChoices (involces appending <li> <li> <li> <li>)
// }
// ​
// function renderTimer() {
//     // timeEl = doc.getTimeEl
// ​
//     // timeEl.setText = remainingSeconds
// }
// ​
// function saveCurrentScore() {
//     // var initial = Ask for initials
//     // create a score object
//     var currentScore = {
//         "name": initial,
//         "score": score
//     }
//     // append currentScore to LocalStorage
//     // goToHighScorePage
// }
// ​
// ​
// ​
// ​
// ​
// ​
// ​
// ​
// ​
// ​
// ​
// ​
// ​
// ​
// ​
// /**
//  *  On HighScore Page
//  */
// ​
// function getHighScores() {
//     // getHighScores from LocalStorage
//     // Sort
// }
// ​
// getHighScores()
// renderList()
// ​
// // Display highScores
//     // renderList()
// ​
// // clearButton.onClick
//     // clear LocalStorage
//     // alert user
// ​
//     // If we are staying on the page
//         getHighScores() // return []
//         renderList() // renders empty list
//     // Else we are going back to gamePage
//         // goBack to GamePage
// ​
// // renderList()
//     // getListEl
//     // for each highScore (from LocalStorage)
//         // create <li>
//         // li.text = highScore
//         // listEl.appendChild(li)
// Collapse