<template>
  <div>
    <div class="container" id="unprint">
      <el-header class="app-header">
        <div>
          <i class="el-icon-suitcase-1"></i>
          &nbsp; {{$t("title")}}
          <myDialog
              :center="true"
              :visible.sync="dialogVisible"
              @submit="dialogVisible = false"
          />
        </div>
        {{ storage }}
        <!-- <el-button type="primary" size="small" @click="print1" :loading="loading2" style="margin-left: 10px;">打印</el-button> -->
        <div class="menu">
          <el-button type="text" @click="setLanguage()">{{ language === "zh" ? "English" : "中文" }}</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="dialogVisible = true">{{$t("intro")}}</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="print1">{{$t("print")}}</el-button>
          <el-divider direction="vertical"></el-divider>
        </div>
      </el-header>
      <el-main style="padding: 0 10px 10px 10px; flex: 1">
        <el-col :span="11" class="chat-box">
          <el-row v-chat-scroll = "{always: true, smooth: true}" class="message-box">
            <el-col>
              <div
                  class="message-container"
                  v-for="(message, index) in messages"
                  :key="index"
              >
                <div class="message-right" v-if="message.isUser">
                  {{ message.content }}
                </div>
                <div class="message-left-container" v-else>
                  <div class="message-left" v-if="message.isUser">{{ message.content }}</div>
                  <voice class="voice" :text="message.content" />
                  <div class="button-container">
                    <el-button
                        type="primary"
                        size="normal"
                        @click="renderHistoryGraph(message.graph)"
                        style="margin-left: 10px"
                        circle
                    >
                      <img src="@/image/kg.svg" alt="kg" style="height: 15px" />
                    </el-button>
                  </div>
                </div>
                <div>
                  <div v-for="(doc, index) in message.docs" :key="index" style="display: inline-block; margin: 0 5px;">
                    <el-tooltip placement="top">
                      <div slot="content" style="max-width: 500px; white-space: pre-line;">{{doc}}</div>
                      <el-button>{{ $t("ref") }} [{{ index+1 }}]</el-button>
                    </el-tooltip>
                  </div>
                </div>
              </div>

            </el-col>
          </el-row>
          <el-row class="sample">
            <el-button
                v-for="(data, index) in sampleData"
                :key="index"
                size="small"
                @click="userMessage = data"
            >{{ data }}</el-button
            >
            <loading-spinner v-if="loading1" />
          </el-row>

          <el-row class="send-box">
            <el-popover
                placement="top-start"
                width="180"
                trigger="hover"
                :content="$t('voiceInput')"
            >
              <speech
                  slot="reference"
                  lang="zh-CN"
                  @onTranscriptionEnd="onEnd"
                  @runtimeTranscription="streamSpeech"
                  :currentRecognitionText.sync="currentRecognitionText"
                  style="margin-right: 10px"
              />
            </el-popover>
            <el-col style="flex: 1">
              <el-input
                  type="textarea"
                  v-model="userMessage"
                  :placeholder="$t('inputPlaceholder')"
                  :autosize="{ minRows: 2, maxRows: 5 }"
              ></el-input>
            </el-col>
            <el-col class="send-button" style="width: 150px">
              <el-button
                  type="primary"
                  size="normal"
                  @click="sendMessage"
                  :loading="loading2"
                  style="margin-right: 10px"
              >{{$t("send")}}</el-button
              >
              <el-popover
                  placement="top-start"
                  width="180"
                  trigger="hover"
                  :content="$t('clearMessage')"
              >
                <el-button
                    slot="reference"
                    type="primary"
                    icon="el-icon-delete"
                    @click="clearChatHistory"
                    circle
                ></el-button>
              </el-popover>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12" class="graph-box" v-loading="loading2">
          <graph :kg="kg" @kg2llm="doAction"></graph>
        </el-col>
      </el-main>
      <el-footer class="copy-right"> Copyright ©2023 TJUDB Group </el-footer>
    </div>
    <printPage :messages="messages"></printPage>
  </div>
</template>

<script>
import axios from "axios";
import speech from "./tool/speech.vue";
import voice from "./tool/voice.vue";
import myDialog from "./tool/my-dialog.vue";
import graph from "./tool/graph.vue";
import { graphColor, graphBorderColor } from "./tool/graph-color.js";
import { mockData } from "./tool/mockData.js";
import PrintPage from "./tool/printPage.vue";
import LoadingSpinner from './tool/LoadingSpinner.vue';
import { get, set } from 'idb-keyval';

export default {
  name: "graphDemo",
  components: { speech, voice, myDialog, PrintPage, graph, LoadingSpinner },
  data() {
    return {
      messages: [],
      userMessage: "",
      dialogVisible: false,
      isShowNodeMenuPanel: false,
      nodeMenuPanelPosition: { x: 0, y: 0 },
      selectedNode: null,
      graph: null,
      currentCharIndex: -1,
      currentRecognitionText: '',  // 用于接收当前语音识别的文本
      //MOCK DATA
      num: 0,
      loading1: false,
      loading2: false,
      transcript: "",
      sampleData: [
        "我发烧了，请给我推荐几个方剂。",
        "有哪些方剂包含了人参，请列举几个。",
        "柴葛解肌汤是一种什么方剂？",
      ],
      kg: {},
      language: "zh",
      storage: null
    };
  },
  watch: {
    messages: {
      deep:true,
      handler(newValue){
        set('chatHistory', newValue??[])
      }
    }
  },
  mounted() {
    get('chatHistory').then((val) => {
      if (val && val.length) {
        this.messages = val;
        for (let i = val.length - 1; i >= 0; i--) {
          if (val[i].graph != undefined) {
            this.renderHistoryGraph(val[i].graph);
            break;
          }
        }
      } else {
        console.log("无有效聊天历史数据");
      }
    });
  },
  methods: {
    async sendMessage_mock() {
      try {
        if (!this.userMessage) {
          return;
        }
        this.messages.push({ content: this.userMessage, isUser: true });
        this.loading1 = true;
        this.loading2 = true;
        console.log("this.userMessage", this.userMessage);
        const response1 = {
          status: 1,
          message: "successful",
          answer:
              "根据已知信息，可以推荐以下方剂：\n\n【方名】桂枝汤\n\n【组成】桂枝10克，白芍10克，甘草5克，生姜3片，大枣3枚\n\n【用法】上药用沸水冲泡，加盖焖10分钟，代茶频饮，每日1剂，连服3天。\n\n【功效】解表散寒，温中止痛。\n\n【主治】外感风寒，恶风畏寒，头痛肢冷，胸胁胀闷，咳嗽，腹泻，胃寒呕吐等症。\n\n本方常用于治疗风寒感冒，但需要注意的是，如果有内伤生冷证或里寒较甚等情况，应在医生指导下使用。",
        };
        let answer = response1.answer;
        console.log("response1", response1);
        console.log(answer)
        //console.log("answer", answer);
        this.messages.push({ content: answer, isUser: false });
        this.loading1 = false;
        const response2 = {
          response:
              "(方剂)桂枝汤-组成-(方剂)桂枝\n(方剂)桂枝汤-组成-(方剂)白芍\n(方剂)桂枝汤-组成-(方剂)甘草\n(方剂)桂枝汤-组成-(方剂)生姜\n(方剂)桂枝汤-组成-(方剂)大枣\n(方剂)桂枝汤-功效-(方剂功效)解表散寒\n(方剂)桂枝汤-功效-(方剂功效)温中止痛\n(方剂)桂枝汤-主治-(方剂主治)外感风寒\n(方剂)桂枝汤-主治-(方剂主治)恶风畏寒\n(方剂)桂枝汤-主治-(方剂主治)头痛肢冷\n(方剂)桂枝汤-主治-(方剂主治)胸胁胀闷\n(方剂)桂枝汤-主治-(方剂主治)咳嗽\n(方剂)桂枝汤-主治-(方剂主治)腹泻\n(方剂)桂枝汤-主治-(方剂主治)胃寒呕吐",
          status: 200,
          time: "2023-05-09 18:45:42",
        };
        console.log("response2", response2);
        let data = response2.response;
        this.loading2 = false;
        // this.messages.push({ content: data, isUser: false });
        data = data.split("\n");
        data = Array.from(new Set(data));
        data = data.map((item) => {
          item = item.split("-");
          return this.extractTypeFromTriple({
            head: item[0],
            relation: item[1],
            tail: item[2],
          });
        });
        const nodes = [];
        const nodesName = [];
        data.forEach((element) => {
          console.log(element);
          if (!nodesName.includes(element.head)) {
            nodesName.push(element.head);
            nodes.push({
              id: element.head,
              text: element.head,
              type: element.headType,
              color: graphColor[element.headType],
              borderColor: graphBorderColor[element.headType],
            });
          }
          if (!nodesName.includes(element.tail)) {
            nodesName.push(element.tail);
            nodes.push({
              id: element.tail,
              text: element.tail,
              type: element.tailType,
              color: graphColor[element.tailType],
              borderColor: graphBorderColor[element.tailType],
            });
          }
        });
        const relations = [];
        data.forEach((element) => {
          relations.push({
            from: element.head,
            to: element.tail,
            text: element.relation,
          });
        });
        this.kg = { nodes, relations };
        this.userMessage = "";
      } catch (error) {
        console.log(error);
      } finally {
        this.loading1 = false;
        this.loading2 = false;
      }
    },
    async sendMessage() {
      if (!this.userMessage) {
        return;
      }
      this.messages.push({ content: this.userMessage, isUser: true });
      this.loading1 = true;
      this.loading2 = true;
      console.log("this.userMessage", this.userMessage);

      if (this.userMessage in mockData) {
        setTimeout(() => {
          console.log(this);
          console.log(this.userMessage);
          this.messages.push({
            content: mockData[this.userMessage].answer,
            isUser: false,
          });
          this.loading1 = false;
          setTimeout(() => {
            const nodes = mockData[this.userMessage].graphData.nodes;
            const relations = mockData[this.userMessage].graphData.lines;
            this.$set(this.messages[this.messages.length - 1], 'graph', {
              nodes: nodes,
              relations: relations,
            });
            this.kg = { nodes, relations };
            this.loading2 = false;
            this.userMessage = "";
          }, Math.floor(0));
          // Math.random() * 3000 + 3000)
        }, Math.floor(0));
      } else {
        try {
          //this.messages.push({ content: '', isUser: false });
          const response1 = await axios.post(
              "https://tcm.subit.org.cn/kgqa/chat/chat",
              {
                query: this.userMessage,
                sessionId: "1125"
              },
              {
                headers: {
                  'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjpudWxsLCJwaG9uZSI6IjE4NjI5ODIwMjg3IiwiZXhwIjoxNzE1MTAzNDI0LCJ1c2VySWQiOjk2LCJpYXQiOjE3MTQ0OTg2MjR9.ww2cL11_wuLCuhpz1PBIWoA2B9Hlu05QvxcG2MqSO7KoCe27fbRv9ZWPqMohU9Ciskpf4clJqbxj9ACIfhnVyQ',
                },

              }
          );

          //this.$set(this.messages[this.messages.length - 1], 'content', response1.data.data.content);
          //this.$set(this.messages[this.messages.length - 1], 'docs', eventData[eventData.length-1].docs);
          let answer = response1.data.data.content;
          console.log(1);
          console.log(answer);
          const docs = response1.data.docs
          console.log("response1", response1);
          console.log("answer", answer);
          this.messages.push({ content: answer, isUser: false, docs });
          this.loading1 = false;
          const response2 = await axios.post(
              "https://tcm.subit.org.cn/chatbot/chatbot_ner",
              { prompt: answer },
          );
          console.log("response2", response2);
          let text = response2.data.response
          //console.log(data);
          this.loading2 = false;
          // this.messages.push({ content: data, isUser: false });
          let start = text.indexOf('{');
          let end = text.lastIndexOf('}') + 1;

          // 提取大括号之间的内容
          let data = text.substring(start, end);
          data = JSON.parse(data);
          //data = data.split("\n");
          //data = Array.from(new Set(data));
          console.log(data);
          const relations = [];
          data.lines.forEach((element) => {
            // 分割from和to字段
            const fromList = element.from.split(",").map(str => str.trim());
            const toList = element.to.split(",").map(str => str.trim());

            // 遍历每一个from和to组合并创建relation
            fromList.forEach((from) => {
              toList.forEach((to) => {
                relations.push({
                  from: from,
                  to: to,
                  text: element.text,
                });
              });
            });
          });

          const nodes = [];
          const nodesName = [];
          data.nodes.forEach((element) => {
            if (!nodesName.includes(element.text)) {
              nodesName.push(element.text);
              nodes.push({
                id: element.id,
                text: element.text,
                type: element.type,
                color: graphColor[element.type],
                borderColor: graphBorderColor[element.type],
              });
            }
          });

          console.log(nodes, relations);
          this.kg = { nodes, relations };
          this.$set(this.messages[this.messages.length - 1], 'graph', {
            nodes: nodes,
            relations: relations,
          });
          this.userMessage = "";
        } catch (error) {
          console.log(error);
        } finally {
          this.loading1 = false;
          this.loading2 = false;
        }
      }
    },
    renderHistoryGraph(graph) {
      this.kg = graph;
    },
    onNodeClick(nodeObject, $event) {
      console.log("onNodeClick:", nodeObject);
    },
    onLineClick(lineObject, $event) {
      console.log("onLineClick:", lineObject);
    },
    //  showNodeMenus(nodeObject, $event) {
    //   this.selectedNode = nodeObject.text;
    //   this.currentNode = nodeObject;
    //   const _base_position = this.$refs.myPage.getBoundingClientRect();
    //   this.isShowNodeMenuPanel = true;
    //   this.nodeMenuPanelPosition.x = $event.clientX ;
    //   this.nodeMenuPanelPosition.y = $event.clientY - _base_position.y;
    // },
    doAction(selectedNode, actionName) {
      console.log(actionName);
      // this.$notify({
      //   title: '提示',
      //   message: '对节点【' + this.currentNode.text + '】进行了：' + actionName,
      //   type: 'success'
      // });
      if(actionName == "编辑")
      {
        const userInput = prompt("请输入内容:");
        if (userInput !== null) {
          // 用户点击确定时
          alert("用户输入的内容为：" + userInput);
        } else {
          // 用户点击取消时
          alert("用户取消了输入");
        }
        for(let key in mockData) {
          if(mockData[key].graphData && mockData[key].graphData.nodes) {
            mockData[key].graphData.nodes.forEach((node, index) => {
              if(node.id === selectedNode || node.text === selectedNode) {
                // 为了维持Vue的响应性，这里使用Vue.set来更新
                alert(userInput);
                // alert(node.type);
                this.$set(mockData[key].graphData.nodes, index, { ...node, text: userInput });
              }
            });
          }
        }
        // console.log(mockData);
      }
      else if (actionName == "是什么") {
        this.userMessage = selectedNode + actionName;
        this.sendMessage();
        this.isShowNodeMenuPanel = false;
      }

    },
    onEnd({ lastSentence, transcription }) {
      // `lastSentence` is the last sentence before the pause
      // `transcription` is the full array of sentences
      console.log("onEnd", lastSentence, transcription);
      this.userMessage = lastSentence;
    },
    streamSpeech({ text }) {
      this.userMessage = text;
      this.currentCharIndex = text.length - 1;
    },
    async print1() {
      var userAgent = navigator.userAgent.toLowerCase(); //取得浏览器的userAgent字符串
      if (userAgent.indexOf("trident") > -1) {
        alert("请使用google或者360浏览器打印");
        return false;
      } else if (userAgent.indexOf("msie") > -1) {
        var onlyChoseAlert = simpleAlert({
          content: "请使用Google或者360浏览器打印",
          buttons: {
            确定: function () {
              onlyChoseAlert.close();
            },
          },
        });
        alert("请使用google或者360浏览器打印");
        return false;
      } else {
        //其它浏览器使用lodop
        //执行隐藏打印区域不需要打印的内容
        document.getElementById("unprint").style.display = "none";
        document.getElementById("printdata").style.display = "block";
        // document.getElementsByClassName("c-mini-toolbar")[1].style.display="none"
        window.print();
        //打印结束后，放开隐藏内容
        document.getElementById("unprint").style.display = "block";
        document.getElementById("printdata").style.display = "none";
      }
    },
    extractTypeFromTriple(triple) {
      const regex = /\((.*?)\)/g; // 匹配括号内的内容
      const head = triple.head.replace(regex, ""); // 去掉括号及括号内的内容
      const tail = triple.tail.replace(regex, ""); // 去掉括号及括号内的内容
      regex.lastIndex = 0; // 将lastIndex属性设置为0
      const headType = regex.exec(triple.head); // 匹配括号内的内容
      regex.lastIndex = 0; // 将lastIndex属性设置为0
      const tailType = regex.exec(triple.tail); // 匹配括号内的内容
      return {
        head: head,
        relation: triple.relation,
        tail: tail,
        headType: headType ? headType[1] : null, // 取括号内的内容
        tailType: tailType ? tailType[1] : null, // 取括号内的内容
      };
    },
    clearChatHistory() {
      this.messages = [];
      this.kg = {}
    },
    setLanguage () {
      this.language = this.language === 'zh' ? 'en' : 'zh'
      // 切换语言
      this.$i18n.locale = this.language
    }
  },
};
</script>

<style lang="scss" scoped>
body {
  margin: 0;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.app-header {
  padding: 0 75px 0 20px;
  border-bottom: 1px solid rgb(239, 239, 239);
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  /* justify-content: center; */
  align-items: center;
  height: 40px !important;
  font-size: 16px;
}
.graph-box {
  box-sizing: border-box;
  padding: 10px;
  margin-left: 10px;
  height: 90vh;
  background-color: #f7f7f7;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
}
.message-box {
  // height: 200px;
  flex: 1;
  border-radius: 10px;
  font-size: 16px;
  overflow-y: scroll;
  background-color: #f7f7f7;
  border: 1px solid #d9d9d9;
}
::v-deep .rel-map {
  background-color: #f7f7f7;
}
.chat-box {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 90vh;
  .sample {
    margin: 7px 0;
  }
}
.send-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 10px;
  background-color: #f7f7f7;
  border: 1px solid #d9d9d9;
}

.message-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 10px;
  white-space: pre-wrap;
  .message-left-container {
    display: flex;
    align-items: center;
  }
}

.message-right {
  border: 1px solid #d9d9d9;
  align-self: flex-end;
  max-width: 60%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: #e8f6fc;
}

.message-left {
  display: inline-block;
  border: 1px solid #d9d9d9;
  align-self: flex-start;
  max-width: 60%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f2f2f2;
}

.send-button {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.send-button button {
  border-radius: 5px;
}

.copy-right {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px !important;
  background-color: #444444;
  font-size: 12px;

  color: #fff;
}

.button-container {
  display: flex;
  align-items: flex-end; /* 可选：使按钮垂直居中 */
}


::v-deep .c-node-menu-item {
  vertical-align: middle;
  line-height: 30px;
  margin: 0;
  padding-left: 10px;
  cursor: pointer;
  color: #444444;
  font-size: 14px;
  border-top: #efefef solid 1px;
}

::v-deep .c-node-menu-item:hover {
  background-color: rgba(66, 187, 66, 0.2);
}
.voice {
  margin-left: 0px;
  display: inline-block;
  text-align: left;
}
::v-deep .el-textarea__inner {
  border-radius: 15px; /* 调整圆角大小 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
@media print {
  /* 自定义页眉 */
  @page {
    margin-top: 40px; /* 设置页眉区域的上边距 */
  }
  #header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    text-align: center;
  }

  /* 自定义页脚 */
  #footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    text-align: center;
  }
}
</style>
