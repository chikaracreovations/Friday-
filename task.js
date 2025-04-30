// task.js
function handleTask(input) {
    input = input.toLowerCase();

    if (input.includes("open youtube")) {
        openYouTube();
    } else if (input.includes("send email")) {
        sendEmail();
    }
    
    else if (input.includes("open")) {
        let appName = input.replace("open", "").trim().toLowerCase();
        openApp(appName);
    }
    
    // Add to voice command
else if (input.includes("check battery") || input.includes("battery status")) {
    checkBattery();
}

else if (input.includes("search for") || input.includes("look up")) {
    let query = input.replace("search for", "").replace("look up", "").trim();
    speak(`Searching for ${query} on Google.`);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
} 

else if (input.includes("play") && input.includes("on youtube")) {
    let query = input.replace("play", "").replace("on youtube", "").trim();
    speak(`Playing ${query} on YouTube.`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
}


else if (input.includes("what time is it")) {
  const time = getTime();
  speak(time);
  return;
}

    else {
        speak("Task not recognized.");
    }
}

//______________________________________________________________________________________

function openYouTube() {
    speak("Opening YouTube.");
    window.open("https://youtube.com", "_blank");
}

function sendEmail() {
    speak("Sending an email...");
    // Add email logic here
}

function openApp(appName) {
    let appLinks = {
        "whatsapp": "whatsapp://send?text=Hello",
        
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
        
    function checkBattery() {
    navigator.getBattery().then(battery => {
        let level = battery.level * 100;
        speak(`Your battery is at ${level} percent.`);
    });
}


function getTime() {
  const now = new Date();
  return `It's currently ${now.toLocaleTimeString()}`;
}