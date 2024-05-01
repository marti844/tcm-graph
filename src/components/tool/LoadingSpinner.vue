<template>
    <div class="loading-dots">
      <div class="dot top-dot"></div>
      <div class="dot middle-dot"></div>
      <div class="dot bottom-dot"></div>
    </div>
  </template>
  
  <style scoped>
  .loading-dots {
    display: inline-block;
    position: relative;
    left: 50px;
    width: 36px;
    height: 10px;
  }
  
  .dot {
    width: 10px;
    height: 10px;
    background-color: #0078d4;
    border-radius: 50%;
    position: absolute;
    animation: appearDisappear 1s infinite; /* 使用自定义动画 */
    opacity: 0; /* 初始时小球不可见 */
  }
  
  .top-dot {
    top: 0;
    left: 0;
    animation-delay: 0.2s; /* 调整上方小球的动画延迟 */
  }
  
  .middle-dot {
    top: 50%;
    left: 14px;
    transform: translate(-20%, -50%);
    animation-delay: 0.4s; /* 调整中间小球的动画延迟 */
  }
  
  .bottom-dot {
    bottom: 0;
    left: 24px;
    animation-delay: 0.6s; /* 调整下方小球的动画延迟 */
  }
  
  @keyframes appearDisappear {
    0%, 100% {
      opacity: 0; /* 开始和结束时小球不可见 */
    }
    50% {
      opacity: 1; /* 中间时刻小球可见 */
    }
  }
  </style>
  