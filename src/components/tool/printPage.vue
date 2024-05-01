<template>
  <div id='printdata' style="display: none;">
      <div>
  <!--       logo-->
        <div style="display: flex;justify-content: center;align-items: center; border-bottom: 1px solid #013c81;">
          <img src="../../image/logo.png" style="flex:1; margin-bottom: 15px;max-width: 100%; height: auto;"  alt="智能与计算学部Logo" >
        </div>
  <!--       问题与回答-->
        <div>
          <div style="border-bottom: 1px solid #000;">
            <div style="margin-left: 30px;">
              <p><span style="margin-right: 20px;">名称：</span><span>中医药大模型知识图谱智能问答系统</span></p>
              <p><span style="margin-right: 20px;">时间：</span><span>{{getTime()}}</span></p>
            </div>
          </div>
          <div class="message-container1" v-for="(message, index) in messages" :key="index">
            <div v-if="index%2===0">
              <p><span style="margin-right: 20px;">问题：</span><span>{{ messages[index]?.content.trim() }}</span></p>
              <p style="font-size: 18px;"><b>Rp:</b></p>
              <p style="margin-left: 50px;">{{ messages[index+1]?.content.trim() }}</p>
              <p>========================处方完毕========================</p>
            </div>
              <!-- <div v-if="message.isUser">问题:{{ message.content }}</div> -->
              <!-- <div v-else>回答:{{ message.content }}<el-divider></el-divider></div> -->
          </div>
          <div class="copy-right1" id="footer" >
            *请注意，此中医药智能问答系统的信息是由AI生成的。这些信息仅供参考，不能作为医疗依据，我们强烈建议您在使用任何方剂之前咨询医疗专业人员的建议。
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
    props: {
        messages: {
            type: Array,
            default: []
        }
    },
    methods: {
      getTime() {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1; // 月份从0开始计数，需要加1
        let day = now.getDate();
        const hour = now.getHours();
        const minute = now.getMinutes();
        return `${year}年${month}月${day}日 ${hour}:${minute}`;
      },
    }
}
</script>

<style scoped lang="scss">

.message-container1 {
  display: flex;
  flex-direction: column;
  padding-right: 48px;
  border-radius: 10px;
  white-space: pre-wrap;
  margin-left: 30px;
}
.message-left1 {
  border: 1px solid #d9d9d9;
  align-self: flex-start;
  max-width: 60%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f2f2f2;
}
.copy-right1 {
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: black;
}

</style>