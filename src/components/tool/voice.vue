<template>
  <div class="highlight-container">
    <div class="highlight-text">
      <span
        v-for="(char, index) in text"
        :key="index"
        :class="{ 'highlight': index <= currentIndex }"
      >{{ char }}</span>
    </div>
    <div class="voice-controls">
      <el-button
        type="primary"
        icon="el-icon-video-play"
        @click="playVoice"
        circle
        v-if="!isPlay"
      ></el-button>
      <el-button
        type="danger"
        icon="el-icon-circle-close"
        @click="stopVoice"
        circle
        v-else
      ></el-button>
    </div>
  </div>
</template>

<script>
const synth = window.speechSynthesis;
let msg = null;

export default {
  data() {
    return {
      isPlay: false,
      currentIndex: -1,
    };
  },
  props: {
    text: {
      type: String,
      default: "",
    },
  },
  methods: {
    playVoice() {
      this.isPlay = true;
      if (synth.speaking) {
        synth.cancel();
      }

      msg = new SpeechSynthesisUtterance();
      msg.text = this.text;
      msg.lang = "zh-CN";
      msg.volume = 1;
      msg.rate = 1;
      msg.pitch = 1;

      this.currentIndex = -1;

      synth.speak(msg);

      msg.onboundary = (event) => {
        this.currentIndex = event.charIndex;
      };

      msg.onend = () => {
        this.isPlay = false;
        msg = null;
        this.currentIndex = -1;
      };
    },
    stopVoice() {
      if (msg !== null) {
        this.isPlay = false;
        synth.cancel();
      }
    },
  },
  beforeDestroy() {
    // 关闭语音合成
    synth.cancel();
  },
};
</script>

<style>
.highlight-container {
  display: flex;
  align-items: flex-start;
}

.highlight-text {
  border: 1px solid #d9d9d9;
  max-width: 60%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f2f2f2;
}

.voice-controls {
  margin-left: 0px; 
}

.highlight {
  background-color: yellow;
}
</style>