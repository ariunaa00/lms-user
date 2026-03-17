const token = localStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
const examId = params.get("examId");

const editModal = document.getElementById('exam-modal')
const examModalOkBtn = document.getElementById('exam-modal-ok-btn')
const quizNextBtn = document.getElementById('quiz-next-btn')

const statBackBtn = document.getElementById('back-btn')
const fileLoadPredix = 'https://examination-system-zangia-test.s3.us-east-1.amazonaws.com'


let totalTime = 0;

const setCurrentExam = (object) => {
    localStorage.setItem('exam', JSON.stringify(object))
}
const getCurrentExam = () => {
    return JSON.parse(localStorage.getItem('exam'))
}
const openEditModal = () => {
    editModal.classList.remove("hide");
}

const closeEditModal = (e, clickedOutside) => {
    if (clickedOutside) {
        if (e.target.classList.contains("modal-overlay"))
            editModal.classList.add("hide");
    } else editModal.classList.add("hide");
}

const setTimer = () => {
    let time = 10 * 60; // 10 minutes in seconds

    const timerElement = document.getElementById("quiz-timer");

    const countdown = setInterval(() => {

        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        timerElement.textContent =
            `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        time--;
        totalTime++;

        if (time < 10) {
            timerElement.style.color = 'red'
        }

        if (time < 0) {
            clearInterval(countdown);
            timerElement.textContent = "Хугацаа дууслаа";
            finishExam();
        }

    }, 1000);
}

const cleanCurrentQuestion = () => {

    const answersContainer = document.getElementById('quiz-answers-sec')
    answersContainer.innerHTML = '';
    const quizImagePreview = document.getElementById('imagePreview')
    const audioPreview = document.getElementById('audioPreview')
    const videoPreview = document.getElementById('videoPreview')

    quizImagePreview.style.display = 'none'
    audioPreview.style.display = 'none'
    videoPreview.style.display = 'none'

    quizImagePreview.src = ''
    audioPreview.src = ''
    videoPreview.src = ''
}


const setCurrentQuestion = (selectedAnswer) => {

    cleanCurrentQuestion();

    let selectedId = selectedAnswer ? parseInt(selectedAnswer.dataset.id) : -1;
    const currentExam = getCurrentExam();
    const currentQuestion = currentExam.currentQuestion;

    const quizCard = document.getElementById('quiz-card');
    const quizNextBtn = document.getElementById('quiz-next-btn')

    const quizQuestion = document.getElementById('quiz-question')
    const quizImagePreview = document.getElementById('imagePreview')
    const audioPreview = document.getElementById('audioPreview')
    const videoPreview = document.getElementById('videoPreview')

    const quizQuestionCurrent = document.getElementById('quiz-question-current')
    const answersContainer = document.getElementById('quiz-answers-sec')

    if (currentQuestion.imgUrl) {
        quizImagePreview.src = `${fileLoadPredix}/${currentQuestion.imgUrl}`
        quizImagePreview.style.display = 'block'
    }

    if (currentQuestion.audioUrl) {
        audioPreview.src = `${fileLoadPredix}/${currentQuestion.audioUrl}`
        audioPreview.style.display = 'block'
        audioPreview.play();
    }

    if (currentQuestion.videoUrl) {
        videoPreview.src = `${fileLoadPredix}/${currentQuestion.videoUrl}`
        videoPreview.style.display = 'block'
        videoPreview.play();
    }

    quizQuestion.innerText = currentQuestion.questionText;
    quizQuestionCurrent.innerText = `Асуулт ${currentExam.currentQuestionIndex + 1}/10`


    let _selectedAnswer = null
    currentQuestion.examAnswers.forEach(answer => {

        if (selectedId === answer.id) {
            _selectedAnswer = answer
        }

        const answerDiv = document.createElement('div')
        answerDiv.className = `quiz-answer ${selectedId === answer.id ? 'quiz-selected-answer' : ''} `
        answerDiv.dataset.id = answer.id

        const checkBox = document.createElement('div')
        checkBox.className = 'quiz-checkBox'

        const answerText = document.createElement('span')
        answerText.className = 'quiz-answer-text'
        answerText.innerText = answer.answerText;

        answerDiv.append(checkBox)
        answerDiv.append(answerText)
        answerDiv.addEventListener('click', (e) => setCurrentQuestion(e.currentTarget))

        answersContainer.append(answerDiv)
    });


    if (_selectedAnswer) {
        if (currentExam.currentQuestionIndex === (currentExam.examQuestions.length - 1)) {
            let tempNextBtn = quizNextBtn.cloneNode(true)
            quizNextBtn.remove();
            tempNextBtn.innerText = 'Дуусгах'
            tempNextBtn.removeEventListener
            tempNextBtn.addEventListener('click', finishExam)
            tempNextBtn.disabled = false
            quizCard.append(tempNextBtn)
        } else {
            let tempNextBtn = quizNextBtn
            quizNextBtn.remove();
            tempNextBtn.disabled = false
            quizCard.append(tempNextBtn)
        }


        const _currentExam = {
            exam: currentExam.exam,
            examQuestions: currentExam.examQuestions,
            answered: [...currentExam.answered, { questionId: currentExam.currentQuestion.id, answerId: _selectedAnswer.id }],
            currentQuestion: currentExam.currentQuestion,
            currentQuestionIndex: currentExam.currentQuestionIndex
        }
        setCurrentExam(_currentExam)
    } else {
        let tempNextBtn = quizNextBtn
        quizNextBtn.remove();
        tempNextBtn.disabled = true
        quizCard.append(tempNextBtn)
    }
}

const startExam = async () => {
    const res = await fetch(`http://44.222.255.219:3000/api/v1/exam/${examId}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    let exam = await res.json();
    exam = shuffleExam(exam)

    const _currentExam = {
        exam,
        examQuestions: exam.examQuestions,
        answered: [],
        currentQuestion: exam.examQuestions[0],
        currentQuestionIndex: 0
    }
    setCurrentExam(_currentExam)
    setCurrentQuestion()
    setTimer();
}

const next = () => {
    const currentExam = getCurrentExam();
    const _currentExam = {
        exam: currentExam.exam,
        examQuestions: currentExam.examQuestions,
        answered: currentExam.answered,
        currentQuestion: currentExam.examQuestions[currentExam.currentQuestionIndex + 1],
        currentQuestionIndex: currentExam.currentQuestionIndex + 1
    }

    setCurrentExam(_currentExam)
    setCurrentQuestion();
}

const clearStatCard = () => {
 const answerPoint = document.getElementById('answer-point-text');
    const answerCorrectNum = document.getElementById('answered-correct-num');
    const answerWrongNum = document.getElementById('answer-wrong-num');
    const answeredTime = document.getElementById('answered-time');
    const answeredNum = document.getElementById('answered-num');

    answerPoint.innerText       = ''
    answerCorrectNum.innerText  = ''
    answerWrongNum.innerText    = ''
    answeredTime.innerText      = ''
    answeredNum.innerText       = ''
}

const finishExam = async () => {
    const quizcard = document.getElementById('quiz-card')
    quizcard.style.display = 'none'

    const quizTimer = document.getElementById('quiz-timer')
    quizTimer.style.display = 'none'

    const quizReviewCard = document.getElementById('quiz-review-card')
    quizReviewCard.style.display = 'block'

    // make a stat
    const minutes = Math.floor(totalTime / 60);

    const currentExam = getCurrentExam();
    const exam = currentExam.exam

    const answered = currentExam.answered;
    const examQuestions = currentExam.examQuestions;

    const correctAnswers = []
    const wrongAnswers = []
    const totalAnswered = answered.length;

    answered.map(({ questionId, answerId }) => {
        const question = examQuestions.find((question) => question.id === questionId);
        const correctAnswer = question.examAnswers.find((answer) => answer.isCorrect)
        const selectedAnswer = question.examAnswers.find((answer) => answer.id === answerId)

        if (correctAnswer === selectedAnswer) {
            correctAnswers.push(correctAnswer)
        } else {
            wrongAnswers.push(selectedAnswer)
        }
    })
    
    const answerPoint = document.getElementById('answer-point-text');
    const answerCorrectNum = document.getElementById('answered-correct-num');
    const answerWrongNum = document.getElementById('answered-wrong-num');
    const answeredTime = document.getElementById('answered-time');
    const answeredNum = document.getElementById('answered-num');

    answerPoint.innerText = correctAnswers.length * 10;
    answerCorrectNum.innerText = `${correctAnswers.length}/${totalAnswered}`;
    answerWrongNum.innerText = `${wrongAnswers.length}/${totalAnswered}`;
    answeredTime.innerText = `${minutes} мин`
    answeredNum.innerText = `${totalAnswered}/${exam.examQuestions.length}`


    try {
        const res = await fetch(`http://44.222.255.219:3000/api/v1/exam/${exam.id}/result`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                correctAnswers,
                wrongAnswers,
                totalAnswered,
                totalTime: minutes,
            })
        })

        const data = await res.json();
        console.log(data);
    }
    catch (err) {
        console.log(err);
        return []
    }
}


const shuffleArray = (arr) => {
    const shuffled = [...arr];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

const shuffleExam = (exam) => {
    const shuffledQuestions = shuffleArray(exam.examQuestions).map(q => {
        return {
            ...q,
            examAnswers: shuffleArray(q.examAnswers)
        };
    });

    return {
        ...exam,
        examQuestions: shuffledQuestions
    };
}

// document.addEventListener("DOMContentLoaded", () => openEditModal());

examModalOkBtn.addEventListener('click', () => {
    closeEditModal();
    startExam();
})

quizNextBtn.addEventListener('click', next);

statBackBtn.addEventListener('click', () => {
    window.location.replace(`index.html`);
    clearStatCard();
})