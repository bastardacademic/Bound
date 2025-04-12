<script lang="ts">
  let mediaRecorder;
  let audioBlob: Blob | null = null;
  let recording = false;
  let audioUrl = "";
  let chunks = [];

  function startRecording() {
    chunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      recording = true;

      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        audioBlob = new Blob(chunks, { type: "audio/webm" });
        audioUrl = URL.createObjectURL(audioBlob);
      };
    });
  }

  function stopRecording() {
    if (mediaRecorder) {
      mediaRecorder.stop();
      recording = false;
    }
  }

  export function getAudioBlob() {
    return audioBlob;
  }
</script>

{#if !recording}
  <button on:click={startRecording}>??? Start Recording</button>
{:else}
  <button on:click={stopRecording}>? Stop Recording</button>
{/if}

{#if audioUrl}
  <p><strong>Preview:</strong></p>
  <audio controls src={audioUrl}></audio>
{/if}

<style>
  button {
    margin: 0.5rem 0;
    padding: 0.5rem 1rem;
  }
</style>
