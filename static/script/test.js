firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    location.replace(loginurl);
  } else {
    document.getElementById("user").innerHTML = "Hello, " + user.name;
  }
});

function logout() {
  firebase.auth().signOut();
}

document.addEventListener("DOMContentLoaded", () => {
  const divText = document.getElementById("speechToText");
  const copyButton = document.getElementById("copyButton");
  const clearButton = document.getElementById("clearButton");
  const micButton = document.getElementById("micButton");
  const wave = micButton.querySelector(".wave");
  const wavebar1 = micButton.querySelector(".wave-bars");
  const wavebar2 = micButton.querySelector("#right");

  let isRecording = false;
  let recognition = null;
  let interimTranscript = ""; 

  wavebar1.style.display = "none";
  wavebar2.style.display = "none";
  wave.style.animationPlayState = "paused";

  copyButton.addEventListener("click", function () {
    const textToCopy = divText.textContent.trim();
  
    if (textToCopy === "") {
      alert("Nothing to copy");
      return;
    }

    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = textToCopy;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();

    try {
      document.execCommand("copy");
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text");
    } finally {
      document.body.removeChild(tempTextarea);
    }
  });

  clearButton.addEventListener("click", function () {
    divText.textContent = "";
    recordedText = "";
  });

  micButton.addEventListener("click", () => {
    isRecording = !isRecording;

    if (isRecording) {
      micButton.classList.add("active");
      wave.style.animationPlayState = "running";
      wavebar1.style.display = "flex";
      wavebar2.style.display = "flex";
      startTime = new Date().getTime();
      recognition = new webkitSpeechRecognition();
      recognition.lang = "ta-IN";
      recognition.interimResults = true; // Enable interim results
      
      recognition.onresult = function (event) {
        interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            recordedText += event.results[i][0].transcript + " ";
          } else {
            interimTranscript += event.results[i][0].transcript + " ";
          }
        }
        divText.textContent = interimTranscript;
      };
      recognition.start();
    } else {
      micButton.classList.remove("active");
      wave.style.animationPlayState = "paused";
      wavebar1.style.display = "none";
      wavebar2.style.display = "none";
      
      if (recognition) {
        recognition.stop();
      }

      divText.textContent = recordedText; // Display recorded text
    }
  });
});
