const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video = document.querySelector("video");
const downloadElement = document.getElementById("download");
const downloadBtn = document.getElementById("downloadBtn");

let recorder, stream;

async function startRecording() {
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });

        if (!stream.getAudioTracks().length) {
            document.getElementById("audioWarning").style.display = "block";
        } else {
            document.getElementById("audioWarning").style.display = "none";
        }

        recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = e => {
            const completeBlob = new Blob(chunks, { type: chunks[0].type });
            const videoURL = URL.createObjectURL(completeBlob);
            video.src = videoURL;

            const now = new Date();
            const pad = n => n.toString().padStart(2, '0');

            const day = pad(now.getDate());
            const month = pad(now.getMonth() + 1);
            const year = now.getFullYear();
            const hours = pad(now.getHours());
            const minutes = pad(now.getMinutes());
            const seconds = pad(now.getSeconds());

            const timestamp = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
            const filename = `recording-${timestamp}.mp4`;

            downloadBtn.href = videoURL;
            downloadBtn.download = filename;
            downloadElement.style.display = "block";
        };

        recorder.start();
    } catch (err) {
        console.error("Lỗi khi ghi màn hình:", err);
        document.getElementById("audioWarning").style.display = "none"; // hide warning if has error
    }
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
    stream.getTracks().forEach(track => track.stop());

    document.getElementById("audioWarning").style.display = "none";
});
