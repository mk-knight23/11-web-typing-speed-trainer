import './style.css';

const words: string[] = [
    "Hello",
    "Welcome",
    "to",
    "the",
    "typing",
    "speed",
    "test"
];

const msgEl = document.querySelector("#message") as HTMLElement;
const wordsEl = document.querySelector("#words") as HTMLTextAreaElement;
const startBtn = document.querySelector("#start") as HTMLButtonElement;

let startTime: number;
// let endTime: number; // Unused variable removed
let randomWord: string = "";

if (startBtn) {
    startBtn.addEventListener("click", startTest);
}

function startTest() {
    randomWord = words[Math.floor(Math.random() * words.length)];
    if (msgEl) msgEl.innerText = randomWord;
    if (wordsEl) {
        wordsEl.disabled = false;
        wordsEl.value = "";
        wordsEl.focus();
    }
    startTime = new Date().getTime();
    if (startBtn) startBtn.innerText = "Restart";
}

function endTest() {
    const endTime = new Date().getTime();
    const totalTime = (endTime - startTime) / 1000;
    const wordCount = wordsEl.value.split(" ").length;
    const speed = Math.round(wordCount / totalTime * 60);

    const msg = `You typed at ${speed} words per minute`;

    if (wordsEl) wordsEl.disabled = true;
    if (startBtn) startBtn.innerText = "Start Test"; // Reset text
    if (msgEl) msgEl.innerText = msg;
}

if (wordsEl) {
    wordsEl.addEventListener("input", () => {
        const typedWord = wordsEl.value;
        // Check if the typed word matches the random word (trimmed)
        if (typedWord.trim() === randomWord) {
            endTest();
        }
    });
}
