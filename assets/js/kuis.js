let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");

let questionCount;
let scoreCount = 0;
let count = 21;
let countdown;
let answerSelected = false;


function containsBatak(text) {
    return /[\u1BC0-\u1BFF]/.test(text);
}


const quizArray = [
    { id: "0", question: "Aksara Lontara berakar pada aksara apa dari India Selatan?", options: ["Gujarati", "Tamil", "Brahmi", "Devanagari"], correct: "Brahmi" },
    { id: "1", question: "Di wilayah Bugis manakah aksara Lontara pertama kali berkembang sekitar tahun 1400 M?", options: ["Makassar", "Cenrana-Walannae", "Soppeng", "Gowa"], correct: "Cenrana-Walannae" },
    { id: "2", question: "Manakah di bawah ini yang merupakan penulisan aksara lontara yang benar untuk bunyi “ma”?", options: ["ᨐ", "ᨆ", "ᨁ", "ᨀ"], correct: "ᨆ" },
    { id: "3", question: "Siapa ahli Belanda yang memprakarsai cetak aksara Lontara pada abad ke-19?", options: ["R.A. Kern", "B.F. Matthes", "Christopher Miller", "Tetterode"], correct: "B.F. Matthes" },
    { id: "4", question: "Aksara Lontara kini masih digunakan untuk?", options: ["Dokumen resmi pemerintah","Media pembelajaran budaya dan sastra","Komunikasi sehari-hari di kota besar","Semua jawaban benar"], correct: "Media pembelajaran budaya dan sastra" },
    { id: "5", question: "Manakah di bawah ini yang merupakan penulisan aksara lontara yang benar untuk bunyi “nra”?", options: ["ᨀ", "ᨃ", "ᨖ", "ᨋ"], correct: "ᨋ" },
    { id: "6", question: "Aksara Lontara digunakan terutama oleh masyarakat di provinsi?", options: ["Sumatera Barat", "Sulawesi Tengah", "Jawa Timur", "Sulawesi Selatan"], correct: "Sulawesi Selatan" },
    { id: "7", question: "Manakah di bawah ini yang merupakan penulisan aksara lontara yang benar untuk bunyi “bi”?", options: ["ᨉᨗ", "ᨂᨚ", "ᨅᨗ", "ᨒᨘ"], correct: "ᨅᨗ" },
    { id: "8", question: "Sebelum kertas tersedia, aksara Lontara biasanya ditulis di...?", options: ["Batu prasasti","Daun lontar","Kulit kayu","Kertas Eropa"], correct: "Daun lontar" },
    { id: "9", question: "Semua huruf berikut termasuk konsonan dasar Lontara, kecuali..", options: ["ᨀ (ka)", "ᨆ (ma)", "ᨊ (na)", "ᨕ (a)"], correct: "ᨕ (a)" }
];


restart.addEventListener("click", () => {
    initial();
    displayContainer.classList.remove("hide");
    scoreContainer.classList.add("hide");
});


nextBtn.addEventListener("click", () => {
    if (!answerSelected) {
        showPopup();
        return;
    }

    questionCount += 1;

    if (questionCount == quizArray.length) {
        displayContainer.classList.add("hide");
        scoreContainer.classList.remove("hide");

        let totalSoal = quizArray.length;
        let benar = scoreCount;
        let salah = totalSoal - benar;


        let skor = Math.round((benar / totalSoal) * 100);


        document.getElementById("correct-count").textContent = benar;
        document.getElementById("wrong-count").textContent = salah;
        document.getElementById("final-score").textContent = skor;
        document.getElementById("percentage").textContent = skor + "%";

    } else {
        countOfQuestion.innerHTML = `${questionCount + 1} dari ${quizArray.length} pertanyaan`;
        quizDisplay(questionCount);
        count = 21;
        clearInterval(countdown);
        timerDisplay();
        answerSelected = false;
    }
});


const timerDisplay = () => {
    countdown = setInterval(() => {
        count--;
        timeLeft.innerHTML = `${count}s`;
        if (count == 0) {
            clearInterval(countdown);
            displayNext();
        }
    }, 1000);
};


const quizDisplay = (questionCount) => {
    let quizCards = document.querySelectorAll(".container-mid");
    quizCards.forEach((card) => card.classList.add("hide"));
    quizCards[questionCount].classList.remove("hide");
};


function quizCreator() {
    quizArray.sort(() => Math.random() - 0.5);
    for (let i of quizArray) {
        i.options.sort(() => Math.random() - 0.5);
        let div = document.createElement("div");
        div.classList.add("container-mid", "hide");
        countOfQuestion.innerHTML = `1 dari ${quizArray.length} pertanyaan`;

        let question_DIV = document.createElement("p");
        question_DIV.classList.add("question");
        question_DIV.innerHTML = i.question;
        question_DIV.style.fontFamily = containsBatak(i.question) ? "'Aksara Batak', serif" : "'Poppins', sans-serif";

        div.appendChild(question_DIV);

        for (let opt of i.options) {
            let btn = document.createElement("button");
            btn.classList.add("option-div");
            btn.style.fontFamily = containsBatak(opt) ? "'Aksara Batak', serif" : "'Poppins', sans-serif";
            btn.setAttribute("onclick", "checker(this)");
            btn.innerText = opt;
            div.appendChild(btn);
        }
        quizContainer.appendChild(div);
    }
}


function checker(userOption) {
    let userSolution = userOption.innerText;
    let question = document.getElementsByClassName("container-mid")[questionCount];
    let options = question.querySelectorAll(".option-div");

    if (userSolution === quizArray[questionCount].correct) {
        userOption.classList.add("correct");
        scoreCount++;
    } else {
        userOption.classList.add("incorrect");
        options.forEach((element) => {
            if (element.innerText == quizArray[questionCount].correct) {
                element.classList.add("correct");
            }
        });
    }

    clearInterval(countdown);
    options.forEach((element) => element.disabled = true);
    answerSelected = true;
}


function initial() {
    quizContainer.innerHTML = "";
    questionCount = 0;
    scoreCount = 0;
    count = 21;
    clearInterval(countdown);
    timerDisplay();
    quizCreator();
    quizDisplay(questionCount);
    answerSelected = false;
}


startButton.addEventListener("click", () => {
    startScreen.classList.add("hide");
    displayContainer.classList.remove("hide");
    initial();
});


function showPopup() {
    const popup = document.getElementById("popup-warning");
    popup.classList.remove("hide");
    setTimeout(() => {
        popup.classList.add("hide");
    }, 2500);
}


window.onload = () => {
    startScreen.classList.remove("hide");
    displayContainer.classList.add("hide");
};


document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "index.html";
});



