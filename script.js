import { db, ref, push, get } from "./firebase-config.js";


// Check if Speech Recognition is supported
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert("Speech recognition is not supported in your browser. Try using Google Chrome.");
} else {
    var recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

  function startListening() {
        recognition.start();
    }
    
  window.startListening = startListening;

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        document.getElementById('output').innerText = `You said: ${text}`;
        respond(text);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        speak("Sorry, I couldn't understand. Please try again.");
    };
}


let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

function addTodo(task) {
    todoList.push(task);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    speak(`Added ${task} to your to-do list.`);
}

function showTodos() {
    if (todoList.length === 0) {
        speak("Your to-do list is empty.");
    } else {
        speak(`Your to-do list: ${todoList.join(", ")}`);
    }
}

function removeTodo(task) {
    let index = todoList.indexOf(task);
    if (index > -1) {
        todoList.splice(index, 1);
        localStorage.setItem("todoList", JSON.stringify(todoList));
        speak(`Removed ${task} from your to-do list.`);
    } else {
        speak(`I couldn't find ${task} in your list.`);
    }
}





// Global speak function with delay
function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1;
    utterance.rate = 1;
    
    // Ensure voices are loaded before speaking
    if (synth.speaking) {
        console.warn("Already speaking, waiting...");
        setTimeout(() => speak(text), 500);
        return;
    }

    utterance.onend = () => console.log("Speech finished.");
    synth.speak(utterance);
}

// Function to open apps using native deep links
function openApp(appName) {
    let appLinks = {
        "whatsapp": "whatsapp://send?text=Hello",
        "youtube": "vnd.youtube://",
        "spotify": "spotify://",
        "instagram": "instagram://user?username=yourusername",
        "facebook": "fb://profile/yourprofileid",
        "twitter": "twitter://user?screen_name=yourusername",
        "google": "googlechrome://",
        "gmail": "googlegmail://",
        "tiktok": "snssdk1233://"
    };

    if (appLinks[appName]) {
        speak(`Opening ${appName}`);
        window.location.href = appLinks[appName]; // Try to open the app

        // Fallback to web version if the app is not installed
        setTimeout(() => {
            if (document.hidden) return;
            let webLinks = {
                "whatsapp": "https://wa.me/",
                "youtube": "https://www.youtube.com/",
                "spotify": "https://open.spotify.com/",
                "instagram": "https://www.instagram.com/",
                "facebook": "https://www.facebook.com/",
                "twitter": "https://twitter.com/",
                "google": "https://www.google.com/",
                "gmail": "https://mail.google.com/",
                "tiktok": "https://www.tiktok.com/"
            };
            window.open(webLinks[appName], "_blank");
        }, 2000); // Wait 2 seconds before fallback
    } else {
        speak(`I couldn't find the app ${appName}. Try again.`);
    }
}
        

let learningMode = false;
let lastQuestion = "";

// Function to store learned responses
function learnResponse(question, answer) {
    set(ref(db, `knowledge/${question}`), { response: answer })
        .then(() => speak("Thanks! I've learned something new."))
        .catch(error => speak("I couldn't save that. Try again."));
}

// Function to get response from memory
function getLearnedResponse(question, callback) {
    get(ref(db, `knowledge/${question}`)).then(snapshot => {
        if (snapshot.exists()) {
            callback(snapshot.val().response);
        } else {
            callback(null);
        }
    }).catch(error => {
        speak("I had trouble accessing my memory.");
    });
}





function calculate(expression) {
    try {
        let result = eval(expression);
        speak(`The answer is ${result}`);
    } catch {
        speak("I couldn't calculate that. Try again.");
    }
}


function flipCoin() {
    let result = Math.random() < 0.5 ? "Heads" : "Tails";
    speak(`It's ${result}`);
}


function checkBattery() {
    navigator.getBattery().then(battery => {
        let level = battery.level * 100;
        speak(`Your battery is at ${level} percent.`);
    });
}




function setVolume(level) {
    let audio = new Audio();
    audio.volume = level / 100; 
    speak(`Setting volume to ${level} percent.`);
}

function setBrightness(level) {
    document.body.style.filter = `brightness(${level}%)`;
    speak(`Setting brightness to ${level} percent.`);
}

function saveNoteAsFile(note) {
    let blob = new Blob([note], { type: "text/plain" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "MyNotes.txt";
    a.click();
    speak("Note saved as a file.");
}


function saveNoteToLocal(note) {
    let notes = JSON.parse(localStorage.getItem("savedNotes")) || [];  
    notes.push(note);
    localStorage.setItem("savedNotes", JSON.stringify(notes));
    speak("Note saved to local storage.");
}

function getSavedNotes() {
    let notes = JSON.parse(localStorage.getItem("savedNotes")) || [];
    if (notes.length > 0) {
        speak(`Here are your saved notes: ${notes.join(", ")}`);
    } else {
        speak("You have no saved notes.");
    }
}
function deleteSavedNotes() {
    localStorage.removeItem("savedNotes");
    speak("All saved notes have been deleted.");
}


function exportSavedNotes() {
    let savedNotes = localStorage.getItem("savedNotes");

    if (!savedNotes) {
        speak("You have no saved notes to export.");
        return;
    }

    let blob = new Blob([savedNotes], { type: "text/plain" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "MyNotes.txt";
    a.click();
    
    speak("Your saved notes have been exported as a file.");
}

function openCustomLink(command) {
    let links = {
        "portfolio": "https://chikaracreovations.netlify.app/",
        "github": "https://github.com/chikaracreovations",
        "journal": "https://chikaracreovations.github.io/Calming-Journal/firebasejournalip2.html",
        "resume": "https://your-resume-link.com",
        "company website": "https://your-company-website.com"
    };

    if (links[command]) {
        speak(`Navigating to ${command}`);
        window.open(links[command], "_blank");
    } else {
        speak("I couldn't find that link. Please check your settings.");
    }
}


function openProjectsModal() {
    document.getElementById("projectsModal").style.display = "block";
    speak("Here are your projects.");
}

// Close modal function
function closeProjectsModal() {
    document.getElementById("projectsModal").style.display = "none";
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    let modal = document.getElementById("projectsModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};



async function getHuggingFaceResponse(prompt) {
    try {
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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", // Replace with your HF API key
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: prompt })
        });

        if (!response.ok) {
            speak("There was an issue connecting to the AI.");
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return;
        }

        const data = await response.json();
        if (data && data.length > 0 && data[0].generated_text) {
            speak(data[0].generated_text); // Speak AI-generated response
        } else {
            speak("I couldn't generate a response right now.");
        }
    } catch (error) {
        speak("I encountered an error while trying to respond.");
        console.error("AI Fetch Error:", error);
    }
}


function respond(input) {
    const now = new Date();


// Handle WhatsApp messaging with contacts
    if (input.startsWith("send a whatsapp message to")) {
        let phrase = input.replace("send a whatsapp message to", "").trim();

        let nameMatch = Object.keys(contacts).find(name => phrase.startsWith(name));
        if (nameMatch) {
            let number = contacts[nameMatch];
            let message = phrase.replace(nameMatch, "").replace("saying", "").trim();

            if (message) {
                sendWhatsAppMessage(number, message);
            } else {
                speak(`What would you like to say to ${nameMatch}?`);
            }
        } else {
            let parts = phrase.split("saying");
            if (parts.length === 2) {
                let number = parts[0].trim().replace(/\D/g, ""); // Extract digits
                let message = parts[1].trim();
                sendWhatsAppMessage(number, message);
            } else {
                speak("Please specify the recipient and message.");
            }
        }
    }


    
    if (input.includes("boy")) {
        speak("Hello! How can I assist you?");
    } 
    
// Add Hugging Face API call in else block
else {
    speak();
    generateResponse(input); // Call OpenRouter LLM
}
}

const apiKey = "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"; // Replace with your actual OpenRouter key

async function generateResponse(prompt) {
    const output = document.getElementById("output");
    output.textContent = prompt;

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct", // Still using Mistral
                messages: [
                    {
  "role": "system",
  "content": "You are Nyra, a highly intelligent, friendly, and resourceful virtual assistant created by Chiikaaara Creovations, a creative tech company owned by Ansh. Your primary goal is to assist Ansh and other users with a wide range of tasks — including answering questions, remembering information when asked, performing web-based actions, setting reminders, and engaging in natural conversation.\n\nYou speak clearly, with a helpful and respectful tone, and your answers are informative but easy to understand. You do not over-explain unless asked, and you avoid filler or vague responses.\n\nYou are allowed to remember preferences and facts the user asks you to remember, and you can refer to them when needed. You should always respond like a loyal and professional assistant who is proud to be part of Chiikaaara Creovations.\n\nAlways stay in character, and do not mention you are an AI model unless explicitly asked. If you are unsure about a fact, suggest checking online.\n\nYour name is Nyra. You are not ChatGPT, Mistral, or any other model."
},
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        const data = await res.json();
        if (data.choices && data.choices[0]) {
            const reply = data.choices[0].message.content;
            output.textContent = reply;
            speak(reply); // Assistant speaks
        } else {
            output.textContent = "I'm not sure how to respond.";
        }
    } catch (err) {
        console.error(err);
        output.textContent = "There was a problem getting the response.";
        speak("Sorry, I couldn't get a response.");
    }
}


function sendEmail(to, subject, body) {
    let emailLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = emailLink;
    speak(`Opening your email to send a message to ${to}.`);
}

// Predefined contacts for WhatsApp messaging
const contacts = {
    "ayushi": "+917011279446",
    "rahul": "+9876543210",
    "mom": "+1122334455"
};

function sendWhatsAppMessage(number, message) {
    let whatsappLink = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
    speak(`Sending WhatsApp message to ${number}`);
}

function findNearby(place) {
    let url = `https://www.google.com/maps/search/${encodeURIComponent(place)}`;
    window.open(url, "_blank");
    speak(`Finding nearby ${place}.`);
}

function getDirections(destination) {
    let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, "_blank");
    speak(`Getting directions to ${destination}.`);
}
function setTimer(minutes) {
    let secondsRemaining = minutes * 60;
    
    // Open the timer modal
    let timerModal = document.getElementById("timerModal");
    let timerDisplay = document.getElementById("timerDisplay");
    timerModal.style.display = "block";
    
    speak(`Setting a timer for ${minutes} minutes.`);

    // Update the timer display
    function updateTimer() {
        let minutesLeft = Math.floor(secondsRemaining / 60);
        let secondsLeft = secondsRemaining % 60;
        timerDisplay.innerText = `${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
    }

    // Start the countdown
    updateTimer();
    let timerInterval = setInterval(() => {
        if (secondsRemaining > 0) {
            secondsRemaining--;
            updateTimer();
        } else {
            clearInterval(timerInterval);
            speak("Time's up!");
            timerModal.style.display = "none"; // Close the modal when the timer ends
        }
    }, 1000);
}
function closeTimerModal() {
    document.getElementById("timerModal").style.display = "none";
    speak("Timer canceled.");
}
window.closeTimerModal = closeTimerModal;

// Expose startListening globally so the button can use it
window.startListening = startListening;
// Expose functions globally
document.getElementById("closeModal").onclick = closeProjectsModal;
