const token = localStorage.getItem("token");
const imgLoadPredix = 'https://examination-system-zangia-test.s3.us-east-1.amazonaws.com'

let lessonCards = document.querySelectorAll('.lesson-card')
let lessonsG = []

const getLessons = async () => {
    try {
        const res = await fetch(`http://localhost:3000/api/v1/lesson/`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        const lessons = await res.json();
        lessonsG = lessons
        return lessons
    } catch (err) {
        console.log(err);
        return []
    }
}
const addListenersToCards = () => {
    lessonCards = document.querySelectorAll('.lesson-card')
    // lessonCards.forEach(card => {
    //     card.addEventListener('click', prepareForm)
    // })
}

const mountLessons = async (_lessons) => {
    const lessons = _lessons || await getLessons();
    const container = document.getElementById('lesson-wrapper');

    container.innerHTML = lessons.map((lesson) => {
        return `<div class="card lesson-card" data-id="${lesson.id}">
                <image src="${imgLoadPredix}${lesson.imgUrl}" />
                <span>${lesson.name}</span>
                <a class="btn btn-secondary" href="takeExam.html?examId=${lesson.exams[0]?.id || null}">Шалгалт өгөх</a>
          </div>`
    }).join("")

    addListenersToCards();
}
document.addEventListener("DOMContentLoaded", () => mountLessons());
