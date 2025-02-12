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
        




// Respond to user input
// Respond to user input
// Respond to user input
function respond(input) {
    const now = new Date();
    
    if (input.includes("hello")) {
        speak("Hello! How can I assist you?");
    } 
    else if (input.includes("how are you")) {
        speak("I'm Jarvis, always functioning at optimal performance. How about you?");
    }
    else if (input.includes("what's your name") || input.includes("who are you")) {
        speak("I am Jarvis, a virtual assistant designed and coded by Chiikaaara Creovations.");
    }
    
     else if (input.includes("open")) {
        let appName = input.replace("open", "").trim().toLowerCase();
        openApp(appName);
    }
    

  
    else if (input.includes("who created you") || input.includes("who is your owner")) {
        speak("I was created by Chiikaaara Creovations, . I'm here to assist you.");
    }
    else if (input.includes("what time is it") || input.includes("tell me the time")) {
        const time = now.toLocaleTimeString();
        speak(`The time is ${time}`);
    }
    else if (input.includes("what's the date") || input.includes("tell me the date")) {
        const date = now.toDateString();
        speak(`Today's date is ${date}`);
    }
    else if (input.includes("what is your purpose") || input.includes("what can you do")) {
        speak("I am Jarvis, your personal assistant. I can remember things for you, tell the time, tell jokes, provide facts, and answer general questions.");
    }
    else if (input.includes("tell me a joke")) {
        const jokes = [
            "Why did the computer catch a cold? Because it left its Windows open!",
            "Why was the math book sad? Because it had too many problems.",
            "Why do programmers prefer dark mode? Because light attracts bugs!"
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        speak(joke);
    }
    else if (input.includes("tell me a fact") || input.includes("give me a fact")) {
        const facts = [
            "Did you know? The first computer was as big as a room!",
            "The speed of a computer mouse is measured in ‘Mickeys’.",
            "The world’s first website is still online. It was created in 1991!"
        ];
        const fact = facts[Math.floor(Math.random() * facts.length)];
        speak(fact);
    }
    else if (input.includes("what is the capital of")) {
        let country = input.replace("what is the capital of", "").trim();
        let capitals = {
            "india": "New Delhi",
            "united states": "Washington, D.C.",
            "france": "Paris",
            "japan": "Tokyo",
            "germany": "Berlin"
        };
        if (capitals[country.toLowerCase()]) {
            speak(`The capital of ${country} is ${capitals[country.toLowerCase()]}.`);
        } else {
            speak("I'm not sure about that. But you can check it online.");
        }
    }
    else if (input.includes("who is the president of india")) {
        speak("As of my last update, the President of India is Droupadi Murmu. But you may want to check the latest news.");
    }
    else if (input.includes("who is the prime minister of india")) {
        speak("The Prime Minister of India is Narendra Modi.");
    }
    else if (input.includes("remember that")) {
        const data = input.replace("remember that", "").trim();
        push(ref(db, "notes"), { note: data });
        speak("Got it! I will remember that.");
    } 
    
    else if (input.includes("search for") || input.includes("look up")) {
    let query = input.replace("search for", "").replace("look up", "").trim();
    speak(`Searching for ${query} on Google.`);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
} 
else if (input.includes("wikipedia")) {
    let query = input.replace("wikipedia", "").trim();
    speak(`Searching Wikipedia for ${query}.`);
    window.open(`https://en.wikipedia.org/wiki/${query}`, "_blank");
}

else if (input.includes("play music") || input.includes("play a song")) {
    speak("Opening YouTube music.");
    window.open("https://music.youtube.com", "_blank");
} 
else if (input.includes("play") && input.includes("on youtube")) {
    let query = input.replace("play", "").replace("on youtube", "").trim();
    speak(`Playing ${query} on YouTube.`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
}

else if (input.includes("remind me to")) {
    let reminder = input.replace("remind me to", "").trim();
    push(ref(db, "reminders"), { note: reminder });
    speak(`Okay, I will remind you to ${reminder}.`);
} 
else if (input.includes("what are my reminders")) {
    get(ref(db, "reminders")).then((snapshot) => {
        if (snapshot.exists()) {
            let reminders = [];
            snapshot.forEach((child) => {
                reminders.push(child.val().note);
            });
            speak(`You have the following reminders: ${reminders.join(", ")}`);
        } else {
            speak("You have no reminders.");
        }
    }).catch(error => {
        speak("I had trouble fetching your reminders.");
    });
}
    
    
    
    else if (input.includes("what do you remember")) {
        get(ref(db, "notes")).then((snapshot) => {
            if (snapshot.exists()) {
                let notes = [];
                snapshot.forEach((child) => {
                    notes.push(child.val().note);
                });
                speak(`I remember: ${notes.join(", ")}`);
            } else {
                speak("I don't have any memories yet.");
            }
        }).catch(error => {
            console.error("Firebase Error:", error);
            speak("I had trouble accessing my memory.");
        });
    } 
    else {
        speak("I'm not sure how to respond to that. Try asking me about time, date, or a fun fact.");
    }
}

// Expose startListening globally so the button can use it
window.startListening = startListening;
// Expose functions globally