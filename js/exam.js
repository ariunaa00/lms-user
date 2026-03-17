
const token = localStorage.getItem("token");

let examsG = []

const getExams = async () => {
    try {
        const res = await fetch(`http://44.222.255.219:3000/api/v1/lesson/exams`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // <-- Bearer token here
            }
        })

        const exams = await res.json();
        examsG = exams
        return exams
    } catch (err) {
        console.log(err);
        return []
    }
}

const mountExams = async () => {
    const params = new URLSearchParams(window.location.search);

    const exams = await getExams();
    const container = document.getElementById('exams-table-body');

    container.innerHTML = exams.map((exam) => {
        return `
            <tr>
                <td><a href="examResult.html?examId=${exam.id}">${exam.name}</a></td>
                <td>${exam.lesson.name}</td>
                <td>${exam.questionNum}</td>
                <td>${exam.duration}</td>
                <td>${exam.durationUnit}</td>
                <td>0</td>
            </tr>
        `
    }).join("")
}


document.addEventListener("DOMContentLoaded", mountExams);
