<template>
  <div class="speech-container">
    <!-- <p v-for="word in transcription" :key="word">{{ word }}</p>
    <p>{{ runtimeTranscription }}</p> -->
    
    <el-button type="primary" icon="el-icon-microphone" @click="startRecording" v-if="!isRecording" circle></el-button>
    <el-button type="info" icon="el-icon-microphone" @click="stopRecording" v-else circle></el-button>
  </div>
</template>

<script>
export default {
  name: 'speech',

  props: {
    lang: {
      type: String,
      default: 'en-US'
    }
  },

    data: () => ({
    recognition: null,
    isRecording: false,
    runtimeTranscription: '',
    currentRecognitionText: '',  // 用于记录当前语音识别的文本
    transcription: []
  }),

  methods: {
    checkApi() {
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition && process.env.NODE_ENV !== 'production') {
        throw new Error('Speech Recognition does not exist on this browser. Use Chrome or Firefox');
      }

      if (!SpeechRecognition) {
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = this.lang;
      this.recognition.interimResults = true;

      this.recognition.addEventListener('result', (event) => {
        const text = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        this.runtimeTranscription = text;
        this.currentRecognitionText = text;  // 更新当前语音识别的文本
        this.$emit('runtimeTranscription', {
          text: text
        });
      });

      this.recognition.addEventListener('end', () => {
        if (this.runtimeTranscription !== '') {
          this.transcription.push(this.runtimeTranscription);
          this.$emit('onTranscriptionEnd', {
            transcription: this.transcription,
            lastSentence: this.runtimeTranscription
          });
        }
        this.runtimeTranscription = '';
        this.isRecording = false;
      });
    },

    startRecording() {
        this.isRecording = true
        this.recognition.start();
    },

    stopRecording() {
        this.isRecording = false
        this.recognition.stop();
    }
  },

  mounted () {
    this.checkApi()
  }
}
</script>

<style lang="scss" scoped>
.speech-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
