const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video = document.querySelector("video");
const downloadElement = document.getElementById("download");
const downloadBtn = document.getElementById("downloadBtn");

let recorder, stream;

async function startRecording() {
    stream = await navigator.mediaDevices.getDisplayMedia({
        video: {mediaSource: "screen"}
    });
    recorder = new MediaRecorder(stream);

    const chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = e => {
        const completeBlob = new Blob(chunks, {type: chunks[0].type});
        const videoURL = URL.createObjectURL(completeBlob);
        video.src = videoURL;

        downloadBtn.href = videoURL;
        downloadElement.style.display = "block";
    };

    recorder.start();
}

start.addEventListener("click", () => {
    start.setAttribute("disabled", true);
    stop.removeAttribute("disabled");
    downloadElement.style.display = "none";

    startRecording();
});

stop.addEventListener("click", () => {
    stop.setAttribute("disabled", true);
    start.removeAttribute("disabled");

    recorder.stop();
    stream.getVideoTracks()[0].stop();
});
