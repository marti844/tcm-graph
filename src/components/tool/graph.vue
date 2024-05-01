<template>
  <div style="height:100%" ref="myPage" @click="isShowNodeMenuPanel = false">
		<div id="toolbar"></div>
		<div id="graph-container">
      <img id="graph-image" v-show="showImage" :style="{position:`absolute`,top:`${graphImage.top}px`,left:`${graphImage.left}px`,}" 
        :src="require('@/image/drug/'+graphImage.name+'.jpg')">
			<!-- <div slot="node" slot-scope="{node}">
				<div
						style="height:80px;display:flex;justify-content:center;align-items:center;border-radius: 50%;cursor: pointer;"
						@contextmenu.prevent.stop="showNodeMenus(node, $event)"
				>
				<span>{{node.text}}</span>
				</div>
			</div> -->
		</div>
		<!-- <div v-show="isShowNodeMenuPanel" :style="{left: nodeMenuPanelPosition.x + 'px', top: nodeMenuPanelPosition.y + 'px' }" style="z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
			<div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;">对这个节点进行询问：</div>
			<div class="c-node-menu-item" @click.stop="doAction('是什么')">是什么</div>
			<div class="c-node-menu-item" @click.stop="doAction('功效')">功效</div>
			<div class="c-node-menu-item" @click.stop="doAction('成分')">成分</div>
			<div class="c-node-menu-item" @click.stop="doAction('用法')">用法</div>
		</div> -->
	</div>
</template>

<script>
import G6 from '@antv/g6';
var nodeConfig={};
const subjectColors = [
  '#66b1ff', //default
  "#1b9e77", // 药物:深绿色
  "#2a9d8f", // 材料: 浅绿色
  "#e76f51", // 疾病: 红色
  "#264653", // 效果: 深蓝色
  "#264653", // 治疗方法: 深蓝色
];
const backColor = '#FFFFFF';
const theme = 'default';
const disableColor = '#777';
const colorSets = G6.Util.getColorSetsBySubjectColors(
  subjectColors, backColor, theme, disableColor,
);

export default {
  data(){
    return{
      showImage:false,
      graphImage: {
        element: null,
        name: '半夏',
				keys: '',
        top: 0,
        left: 0,
      },
    }
  },
	mounted() {
		this.initGraph();
	},
  watch: {
    kg: {
      handler: function (val, oldVal) {
        console.log(val.nodes);
        this.renderGraph(val.nodes, val.relations)
      },
      deep: true
    }
  },
  props: {
    kg: {
      type: Object,
      default: () => {}
    }
  },
	methods: {
		initGraph() {
      const graphItem = document.getElementById('graph-container');
      this.graphImage.element = document.getElementById('graph-image');
			this.graphImage.keys = require.context('@/image/drug/', false, /\.jpg$/).keys()
      const constrainBox = { 
        x: 0, 
        y: 0, 
        width: graphItem.clientWidth, 
        height: graphItem.clientHeight
      };

      const toolbar = new G6.ToolBar({
        container: 'toolbar',
        //position: { x: constrainBox.width+24, y: 65 },
        getContent: () => {
          return `
          <ul class="g6-component-toolbar">
            <li code="redo" style="cursor: not-allowed">
              <svg t="1684079184039" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2149" width="20" height="24"><path d="M514 912c-219.9 0-398.8-178.9-398.8-398.9 0-219.9 178.9-398.8 398.8-398.8s398.8 178.9 398.8 398.8c0 220-178.9 398.9-398.8 398.9z m0-701.5c-166.9 0-302.7 135.8-302.7 302.7S347.1 815.9 514 815.9s302.7-135.8 302.7-302.7S680.9 210.5 514 210.5z" fill="#BDD2EF" p-id="2150"></path><path d="M402.5 677.3c0-15 5.7-30.1 17.2-41.5l122.6-122.6-122.6-122.6c-22.9-22.9-22.9-60.2 0-83.1 22.9-22.9 60.2-22.9 83.1 0l164.1 164.1c22.9 22.9 22.9 60.2 0 83.1L502.8 718.8c-22.9 22.9-60.2 22.9-83.1 0-11.5-11.4-17.2-26.5-17.2-41.5z" fill="#2867CE" p-id="2151"></path></svg>
            </li>
            <li code="undo">
              <svg t="1684079161201" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2009" width="20" height="24"><path d="M912.8 513.2C912.8 733.1 733.9 912 514 912S115.2 733.1 115.2 513.2 294.1 114.3 514 114.3s398.8 179 398.8 398.9z m-701.5 0c0 166.9 135.8 302.7 302.7 302.7s302.7-135.8 302.7-302.7S680.9 210.5 514 210.5 211.3 346.3 211.3 513.2z" fill="#BDD2EF" p-id="2010"></path><path d="M626.8 345.9c0 15-5.7 30.1-17.2 41.5L487.1 510l122.6 122.6c22.9 22.9 22.9 60.2 0 83.1-22.9 22.9-60.2 22.9-83.1 0L362.4 551.6c-22.9-22.9-22.9-60.2 0-83.1l164.1-164.1c22.9-22.9 60.2-22.9 83.1 0 11.5 11.5 17.2 26.5 17.2 41.5z" fill="#2867CE" p-id="2011"></path></svg>
            </li>
            <li code="zoomOut">
              <svg t="1684079020703" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1446" width="20" height="24"><path d="M490.8 345.9H447v-43.8c0-32.5-26.3-58.8-58.8-58.8s-58.8 26.3-58.8 58.8v43.8h-43.8c-32.5 0-58.8 26.3-58.8 58.8s26.3 58.8 58.8 58.8h43.8v43.8c0 32.5 26.3 58.8 58.8 58.8s58.8-26.3 58.8-58.8v-43.8h43.8c32.5 0 58.8-26.3 58.8-58.8 0-32.4-26.3-58.8-58.8-58.8z" fill="#2867CE" p-id="1447"></path><path d="M722.8 774.7c9.4 9.4 21.7 14.1 34 14.1s24.6-4.7 34-14.1c18.8-18.8 18.8-49.2 0-68L642.9 558.9c27.3-45 43.1-97.8 43.1-154.2 0-164.2-133.6-297.8-297.8-297.8S90.4 240.5 90.4 404.7 224 702.5 388.2 702.5c73.1 0 140.1-26.5 192-70.4l142.6 142.6zM388.2 606.4c-111.2 0-201.7-90.5-201.7-201.7C186.5 293.5 277 203 388.2 203c111.2 0 201.7 90.5 201.7 201.7 0 111.2-90.5 201.7-201.7 201.7zM791.5 133.6H689.8v96.2h101.6c27.6 0 50 22.4 50 50V356h96.2v-76.3c0-80.5-65.5-146.1-146.1-146.1z" fill="#BDD2EF" p-id="1448"></path><path d="M841.5 773.3c0 27.6-22.4 50-50 50H689.8v96.2h101.6c80.6 0 146.2-65.6 146.2-146.2V697h-96.2v76.3zM197.2 773.3V697H101v76.3c0 80.6 65.6 146.2 146.2 146.2h101.6v-96.2H247.2c-27.6 0-50-22.4-50-50z" fill="#BDD2EF" p-id="1449"></path></svg>
            </li>
            
            <li code="zoomIn">
              <svg t="1684079053511" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1587" width="20" height="24"><path d="M490.8 463.5c32.5 0 58.8-26.3 58.8-58.8s-26.3-58.8-58.8-58.8H285.6c-32.5 0-58.8 26.3-58.8 58.8s26.3 58.8 58.8 58.8h205.2z" fill="#2867CE" p-id="1588"></path><path d="M756.8 788.8c12.3 0 24.6-4.7 34-14.1 18.8-18.8 18.8-49.2 0-68L642.9 558.9c27.3-45 43.1-97.8 43.1-154.2 0-164.2-133.6-297.8-297.8-297.8S90.4 240.5 90.4 404.7 224 702.5 388.2 702.5c73.1 0 140.1-26.5 192-70.4l142.6 142.6c9.4 9.4 21.7 14.1 34 14.1zM388.2 606.4c-111.2 0-201.7-90.5-201.7-201.7C186.5 293.5 277 203 388.2 203c111.2 0 201.7 90.5 201.7 201.7 0 111.2-90.5 201.7-201.7 201.7zM791.5 133.6H689.8v96.2h101.6c27.6 0 50 22.4 50 50V356h96.2v-76.3c0-80.5-65.5-146.1-146.1-146.1z" fill="#BDD2EF" p-id="1589"></path><path d="M841.5 773.3c0 27.6-22.4 50-50 50H689.8v96.2h101.6c80.6 0 146.2-65.6 146.2-146.2V697h-96.2v76.3zM197.2 773.3V697H101v76.3c0 80.6 65.6 146.2 146.2 146.2h101.6v-96.2H247.2c-27.6 0-50-22.4-50-50z" fill="#BDD2EF" p-id="1590"></path></svg>
            </li>
            <li code="realZoom">
              <svg t="1684079096275" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1728" width="20" height="24"><path d="M716.5 853.4H316.1c-77.6 0-140.7-63.1-140.7-140.7V312.3c0-77.6 63.1-140.7 140.7-140.7h400.4c77.6 0 140.7 63.1 140.7 140.7v400.4c0.1 77.6-63.1 140.7-140.7 140.7zM316.1 267.7c-24.6 0-44.6 20-44.6 44.6v400.4c0 24.6 20 44.6 44.6 44.6h400.4c24.6 0 44.6-20 44.6-44.6V312.3c0-24.6-20-44.6-44.6-44.6H316.1z" fill="#BDD2EF" p-id="1729"></path><path d="M422.1 547.7h-232c-32.5 0-58.8 26.3-58.8 58.8 0 32.4 26.3 58.8 58.8 58.8h90.2L150.6 795c-22.9 22.9-22.9 60.2 0 83.1 22.9 22.9 60.2 22.9 83.1 0l129.7-129.7v90.2c0 16.2 6.6 30.9 17.2 41.5s25.3 17.2 41.5 17.2c32.5 0 58.8-26.3 58.8-58.8v-232c0-32.5-26.3-58.8-58.8-58.8zM605.9 478.7H838c32.5 0 58.8-26.3 58.8-58.8 0-32.4-26.3-58.8-58.8-58.8h-90.2l129.7-129.7c22.9-22.9 22.9-60.2 0-83.1-22.9-22.9-60.2-22.9-83.1 0L664.6 278v-90.2c0-16.2-6.6-30.9-17.2-41.5-10.6-10.6-25.3-17.2-41.5-17.2-32.5 0-58.8 26.3-58.8 58.8V420c0 32.4 26.3 58.7 58.8 58.7z" fill="#2867CE" p-id="1730"></path></svg>
            </li>
            <li code="autoZoom">
              <svg t="1684079236159" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1446" width="20" height="24"><path d="M716.5 853.4H316.1c-77.6 0-140.7-63.1-140.7-140.7V312.3c0-77.6 63.1-140.7 140.7-140.7h400.4c77.6 0 140.7 63.1 140.7 140.7v400.4c0.1 77.6-63.1 140.7-140.7 140.7zM316.1 267.7c-24.6 0-44.6 20-44.6 44.6v400.4c0 24.6 20 44.6 44.6 44.6h400.4c24.6 0 44.6-20 44.6-44.6V312.3c0-24.6-20-44.6-44.6-44.6H316.1z" fill="#BDD2EF" p-id="1447"></path><path d="M192.1 895.3h232.1c32.5 0 58.8-26.3 58.8-58.8 0-32.4-26.3-58.8-58.8-58.8H334L463.7 648c22.9-22.9 22.9-60.2 0-83.1-22.9-22.9-60.2-22.9-83.1 0L250.9 694.7v-90.2c0-16.2-6.6-30.9-17.2-41.5-10.6-10.6-25.3-17.2-41.5-17.2-32.5 0-58.8 26.3-58.8 58.8v232.1c-0.1 32.3 26.3 58.6 58.7 58.6zM835.9 131.1H603.8c-32.5 0-58.8 26.3-58.8 58.8 0 32.4 26.3 58.8 58.8 58.8H694L564.3 378.3c-22.9 22.9-22.9 60.2 0 83.1 22.9 22.9 60.2 22.9 83.1 0l129.7-129.7v90.2c0 16.2 6.6 30.9 17.2 41.5 10.6 10.6 25.3 17.2 41.5 17.2 32.5 0 58.8-26.3 58.8-58.8V189.9c0.1-32.5-26.3-58.8-58.7-58.8z" fill="#2867CE" p-id="1448"></path></svg>
            </li>
            <li code="rePaint">
              <svg t="1684078987056" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1446" width="20" height="24"><path d="M274.3 758.2l179.4 138.6c37.6 29 92.1 2.3 92.1-45.2v-38.4c161.1-1.1 291.6-136.3 291.6-303.7 0-36.5-6.1-68.9-16.2-101.3-40.5 117.5-147.8 202.5-275.4 202.5v-36.4c0-47.5-54.5-74.2-92.1-45.2L274.3 667.8c-29.6 22.8-29.6 67.5 0 90.4z" fill="#2867CE" p-id="1447"></path><path d="M753.7 268.2L574.3 129.6c-37.6-29-92.1-2.3-92.1 45.2v38.4c-161.1 1.1-291.6 136.3-291.6 303.7 0 36.5 6.1 68.9 16.2 101.3 40.5-117.5 147.8-202.5 275.4-202.5v36.4c0 47.5 54.5 74.2 92.1 45.2l179.4-138.7c29.6-22.8 29.6-67.5 0-90.4z" fill="#2867CE" p-id="1448"></path><path d="M483.3 462.8V164c-0.6 3.5-1 7-1 10.8v38.4c-161.1 1.1-291.6 136.3-291.6 303.7 0 36.5 6.1 68.9 16.2 101.3 40.5-117.5 147.8-202.5 275.4-202.5v36.4c0 3.7 0.3 7.3 1 10.7zM545.8 610.8v-36.4c0-3.7-0.4-7.3-1-10.8v298.9c0.6-3.5 1-7 1-10.8v-38.4c161.1-1.1 291.6-136.3 291.6-303.7 0-36.5-6.1-68.9-16.2-101.3-40.5 117.4-147.9 202.5-275.4 202.5z" fill="#BDD2EF" p-id="1449"></path></svg>
            </li>
          </ul>
          `;
        },
        handleClick: (code, graph) => {
          if (code === 'autoZoom') {
            graph.fitView(20);
          } else if (code === 'zoomOut') {
            graph.zoom(1.1,{ x: constrainBox.width/2, y: constrainBox.height/2 });  
          } else if (code === 'zoomIn') {
            graph.zoom(0.9,{ x: constrainBox.width/2, y: constrainBox.height/2 }); 
          } else if (code === 'realZoom') {
            graph.zoomTo(1.0,{ x: constrainBox.width/2, y: constrainBox.height/2 }); 
          } else if (code === 'rePaint') {
            graph.zoomTo(1.0,{ x: constrainBox.width/2, y: constrainBox.height/2 }); 
            graph.render();
          } else if (code === 'undo') {
            toolbar.undo();
          } else if (code === 'redo') {
            toolbar.redo();
          }
        },
      });

      const tooltip = new G6.Tooltip({
        offsetX: 0,
        offsetY: 0,
        fixToNode: [1, 0.5],
        itemTypes: ['node'],
        getContent(e) {
          const curNode = e.item.getModel();
          const outDiv = document.createElement('div');
          outDiv.style.width = '200px';
          outDiv.innerHTML = `
                    <div style="text-align:center;opacity:0.8;width:100%">
                        <h4 >${curNode.text}</h4>
                        
                    </div>`
          return outDiv
        }
      });

      const contextMenu = new G6.Menu({
        className:'G6Meum',
        shouldBegin(evt) {
          if (evt.target && evt.target.isCanvas && evt.target.isCanvas()) return true;
          if (evt.item) return true;
          return false;
        },
        getContent(evt) {
          console.log('evt.item.getModel()', evt.item.getModel())
          if (evt.item.getModel().class == '方剂') {
            return `
              <div v-show="isShowNodeMenuPanel" style="width:150px;border-radius:10px;z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
                <div style="line-height: 25px;margin-bottom:10px;padding-left: 10px;color: #888888;font-size: 12px;">对这个节点进行询问：</div>
                  <p id='是什么' class="c-node-menu-item">是什么</p>
                  <p id='功效' class="c-node-menu-item">功效</p>
                  <p id='成分' class="c-node-menu-item">成分</p>
                  <p id='用法' class="c-node-menu-item">用法</p>
                  <p id='编辑' class="c-node-menu-item">编辑</p>
              </div>`;
          } else {
            return `
              <div v-show="isShowNodeMenuPanel" style="width:150px;border-radius:10px;z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
                <div style="line-height: 25px;margin-bottom:10px;padding-left: 10px;color: #888888;font-size: 12px;">对这个节点进行询问：</div>
                  <p id='是什么' class="c-node-menu-item">是什么</p>
                  <p id='编辑' class="c-node-menu-item">编辑</p>
              </div>`;
          }
          
        },
        handleMenuClick: (dom, item) => {
          const model = item && item.getModel();
          this.selectedNode = model.text;
          const liIdStrs = dom.id;
          this.$emit('kg2llm', model.text, liIdStrs)
          
        },
        itemTypes: ['node'],
      });

      this.graph = new G6.Graph({
        animate: true,
        container: 'graph-container',
        width: constrainBox.width,
        height: constrainBox.height,
        enabledStack: true,
        //linkCenter: true,
        //fitView: true,
        plugins: [toolbar,contextMenu],
        groupByTypes: false,
        layout: {
          type: 'force', //1. gForce 2.radial 3.concentric
          preventOverlap: true,
          alpha: 0.8,
          linkDistance: 200,
          unitRadius: 100,
          //修改力的大小
          nodeStrength: -100,
          nodeSpacing: 3,
          forceSimulation: null,
        },
        modes: {
          default: ['click-select', 'drag-node', {
            type: 'zoom-canvas',
            enableOptimize: true,
          }, {
              type: 'drag-canvas',
              enableOptimize: true,
            }, 'activate-relations']
        },

        defaultNode: {
          size: [0, 0],
        },
        defaultEdge: {
          style: {
            stroke: '#333',
            lineAppendWidth: 1,
            opacity: 0.8,
          },
          labelCfg: {
            refY:10,
            autoRotate: true,
            style: {
              fill:'#333',
              opacity: 1 
            }
          }
        },
        edgeStateStyles: {
          active: {
            shadowColor: '#F00000',
            shadowBlur: 10,
            stroke: '#F00000',
            lineWidth: 3,
            'text-shape': {
              fontSize:16,
              fontWeight:700,
              fill: '#333',
              opacity: 0.8
            },
          },
          highlight: {
            shadowColor: '#F00000',
            shadowBlur: 10,
            stroke: '#F00000',
            lineWidth: 3,
            'text-shape': {
              fontSize:16,
              fontWeight:700,
              fill: '#333',
              opacity: 0.8
            },
          },
          dark: {
            opacity: 0.5,
            'text-shape': {
              fill: '#333',
              opacity: 0.2
            },
          }
        },
      });

      nodeConfig = {
        "其他":{
          type: 'circle',
          style: {
            fill: subjectColors[0],
            stroke: '#00000000',
            shadowColor: colorSets[0].highlightStroke,
            shadowBlur: 10,
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            opacity: 1,
          },
          stateStyles: {
            active: {
              fill: subjectColors[0],
              stroke: colorSets[0].highlightStroke,
              shadowColor: colorSets[0].activeStroke,
              lineWidth: 5,
            },
            selected: {
              fill: colorSets[0].selectedFill +'90',
              stroke: colorSets[0].selectedStroke,
              shadowColor: colorSets[0].selectedStroke,
              lineWidth: 5,
              'text-shape': {
                fill: colorSets[0].selectedStroke,
                fontSize: 20,
              },
            },
            highlight: {
              fill: subjectColors[0]+'80',
              stroke: colorSets[0].highlightStroke,
              shadowColor: colorSets[0].highlightStroke,
              lineWidth: 5,
            },
            dark: {
              opacity: 0.1,
              'text-shape': {
                opacity: 0
              },
            },
          },
        },
        "药物": {
          type: 'circle',
          style: {
            fill: subjectColors[1],
            stroke: '#00000000',
            shadowColor: colorSets[1].highlightStroke,
            shadowBlur: 10,
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            opacity: 1,
          },
          stateStyles: {
            active: {
              fill: subjectColors[1],
              stroke: colorSets[1].highlightStroke,
              shadowColor: colorSets[1].activeStroke,
              lineWidth: 5,
            },
            selected: {
              fill: colorSets[1].selectedFill +'90',
              stroke: colorSets[1].selectedStroke,
              shadowColor: colorSets[1].selectedStroke,
              lineWidth: 5,
              'text-shape': {
                fill: colorSets[1].selectedStroke,
                fontSize: 20,
              },
            },
            highlight: {
              fill: subjectColors[1]+'80',
              stroke: colorSets[1].highlightStroke,
              shadowColor: colorSets[1].highlightStroke,
              lineWidth: 5,
            },
            dark: {
              opacity: 0.1,
              'text-shape': {
                opacity: 0
              },
            },
          },
        },
        "材料": {
          type: 'circle',
          style: {
            fill: subjectColors[2],
            stroke: '#00000000',
            shadowColor: colorSets[2].highlightStroke,
            shadowBlur: 10,
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            opacity: 1,
          },
          stateStyles: {
            active: {
              fill: subjectColors[2],
              stroke: colorSets[2].highlightStroke,
              shadowColor: colorSets[2].activeStroke,
              lineWidth: 5,
            },
            selected: {
              fill: colorSets[2].selectedFill+'90',
              stroke: colorSets[2].selectedStroke,
              shadowColor: colorSets[2].selectedStroke,
              lineWidth: 5,
              'text-shape': {
                fill: colorSets[2].selectedStroke,
                fontSize: 20,
              },
            },
            highlight: {
              fill: subjectColors[2]+'80',
              stroke: colorSets[2].highlightStroke,
              shadowColor: colorSets[2].highlightStroke,
              lineWidth: 5,
            },
            dark: {
              opacity: 0.1,
              'text-shape': {
                opacity: 0
              },
            },
          },
        },
        "疾病": {
          type: 'circle',
          style: {
            fill: subjectColors[3],
            stroke: '#00000000',
            shadowColor: colorSets[3].highlightStroke,
            shadowBlur: 10,
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            opacity: 1,
          },
          stateStyles: {
            active: {
              fill: subjectColors[3],
              stroke: colorSets[3].highlightStroke,
              shadowColor: colorSets[3].activeStroke,
              lineWidth: 5,
            },
            selected: {
              fill: colorSets[3].selectedFill+'90',
              stroke: colorSets[3].selectedStroke,
              shadowColor: colorSets[3].selectedStroke,
              lineWidth: 5,
              'text-shape': {
                fill: colorSets[3].selectedStroke,
                fontSize: 20,
              },
            },
            highlight: {
              fill: subjectColors[3]+'80',
              stroke: colorSets[3].highlightStroke,
              shadowColor: colorSets[3].highlightStroke,
              lineWidth: 5,
            },
            dark: {
              opacity: 0.1,
              'text-shape': {
                opacity: 0
              },
            },
          },
        },
        "效果": {
          type: 'circle',
          style: {
            fill: subjectColors[4],
            stroke: '#00000000',
            shadowColor: colorSets[4].highlightStroke,
            shadowBlur: 10,
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            opacity: 1,
          },
          stateStyles: {
            active: {
              fill: subjectColors[4],
              stroke: colorSets[4].highlightStroke,
              shadowColor: colorSets[4].activeStroke,
              lineWidth: 5,
            },
            selected: {
              fill: colorSets[4].selectedFill+'90',
              stroke: colorSets[4].selectedStroke,
              shadowColor: colorSets[4].selectedStroke,
              lineWidth: 5,
              'text-shape': {
                fill: colorSets[4].selectedStroke,
                fontSize: 20,
              },
            },
            highlight: {
              fill: subjectColors[4]+'80',
              stroke: colorSets[4].highlightStroke,
              shadowColor: colorSets[4].highlightStroke,
              lineWidth: 5,
            },
            dark: {
              opacity: 0.1,
              'text-shape': {
                opacity: 0
              },
            },
          },

        },
        "治疗方法": {
          type: 'circle',
          style: {
            fill: subjectColors[5],
            stroke: '#00000000',
            shadowColor: colorSets[5].highlightStroke,
            shadowBlur: 10,
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            opacity: 1,
          },
          stateStyles: {
            active: {
              fill: subjectColors[5],
              stroke: colorSets[5].highlightStroke,
              shadowColor: colorSets[5].activeStroke,
              lineWidth: 5,
            },
            selected: {
              fill: colorSets[5].selectedFill+'90',
              stroke: colorSets[5].selectedStroke,
              shadowColor: colorSets[5].selectedStroke,
              lineWidth: 5,
              'text-shape': {
                fill: colorSets[5].selectedStroke,
                fontSize: 20,
              },
            },
            highlight: {
              fill: subjectColors[5]+'80',
              stroke: colorSets[5].highlightStroke,
              shadowColor: colorSets[5].highlightStroke,
              lineWidth: 5,
            },
            dark: {
              opacity: 0.1,
              'text-shape': {
                opacity: 0
              },
            },
          },
        }
      }

      this.bindListener(this.graph);
    },
    //G6相关功能
    bindListener(graph){
      function clearAllStats() {
        graph.setAutoPaint(false);
        graph.getNodes().forEach(function (node) {
          graph.setItemState(node, 'active', false);
          graph.setItemState(node, 'dark', false);
        });
        graph.getEdges().forEach(function (edge) {
          graph.setItemState(edge, 'active', false);
          graph.setItemState(edge, 'dark', false);
        });
        graph.paint();
        graph.setAutoPaint(true);
      }

      function refreshDragedNodePosition(e) {
        const model = e.item.get('model');
        model.fx = e.x;
        model.fy = e.y;
      }

      graph.on('node:dragstart', function (evt) {
        graph.layout();
        refreshDragedNodePosition(evt);
      });

      graph.on('node:drag', function (evt) {
        const forceLayout = graph.get('layoutController').layoutMethods[0];
        forceLayout.execute();
        refreshDragedNodePosition(evt);
      });

      graph.on('node:dragend', function (evt) {
        evt.item.get('model').fx = null;
        evt.item.get('model').fy = null;
      });

      // 鼠标移入节点
      graph.on('node:mouseenter', (evt) => {
        var item = evt.item;
        const model = item.getModel();
				var label = model.label;
        model.oriLabel = label;
        graph.updateItem(item, {
          label: model.text,
          labelCfg: {
            style: {
              fill: 'white',
              fontSize: 20,
            }
          }
        });
        graph.setAutoPaint(false);
        graph.getNodes().forEach(function (node) {
          graph.setItemState(node, 'active', false);
          graph.setItemState(node, 'dark', true);
        });
        graph.setItemState(item, 'dark', false);
        graph.setItemState(item, 'active', true);

        item.toFront();
        graph.getEdges().forEach(function (edge) {
          if (edge.getSource() === item) {
            graph.setItemState(edge.getTarget(), 'dark', false);
            graph.setItemState(edge.getTarget(), 'active', true);
            graph.setItemState(edge, 'active', true);
          } else if (edge.getTarget() === item) {
            graph.setItemState(edge.getSource(), 'dark', false);
            graph.setItemState(edge.getSource(), 'active', true);
            graph.setItemState(edge, 'active', true);
          } else {
            graph.setItemState(edge, 'active', false);
            graph.setItemState(edge, 'dark', true);
          }
        });
        graph.paint();
        graph.setAutoPaint(true);

        // 如果是处方，显示图片
				var existPic = false;
				var picName = './' + label + '.jpg';
				this.graphImage.keys.some((item) => {
					if (item === picName) existPic = true;
				});

        if (model.class==="中药材" && existPic){
					this.graphImage.name = label;
					this.showImage = true;
        }
      });

      graph.on('node:mousemove',(evt)=>{
        if (this.showImage){
          // 更改图片位置，使之跟随鼠标
					this.graphImage.top = evt.clientY - this.graphImage.element.naturalHeight - 20;
					this.graphImage.left = evt.clientX - this.graphImage.element.naturalWidth/2;
        }
      })

      // 鼠标移出节点
      graph.on('node:mouseleave', (evt) => {
        const node = evt.item;
        const model = node.getModel();
        graph.updateItem(node, {
          label: model.oriLabel,
          labelCfg: {
            style: {
              fill: 'white',
              fontSize: 14,
            }
          }
        });
        // 图片不再显示
        this.showImage = false;
        clearAllStats();
      });

      // 点击节点
      graph.on('node:click', (evt) => {
        const nodeItem = evt.item;
        this.graph.focusItem(nodeItem, true);

        graph.setAutoPaint(false);
        graph.getNodes().forEach(function (node) {
          graph.setItemState(node, 'selected', false);
          graph.setItemState(node, 'highlight', false);
        });
        graph.getEdges().forEach(function (edge) {
          graph.clearItemStates(edge);
        });
        graph.setItemState(nodeItem, 'selected', true);
        nodeItem.toFront();
        graph.paint();
        graph.setAutoPaint(true);
      });
    
      // 点击边
      graph.on('edge:click', (evt) => {
        graph.getNodes().forEach(function (node) {
          graph.clearItemStates(node);
        });
        graph.getEdges().forEach(function (edge) {
          graph.clearItemStates(edge);
        });
      });
    
      // 点击空白画布
      graph.on('canvas:click', (evt) => {
        graph.getNodes().forEach(function (node) {
          graph.clearItemStates(node);
        });
        graph.getEdges().forEach(function (edge) {
          graph.clearItemStates(edge);
        });
      });
    },

    //控制节点标签长度，超范围自动省略为点
    formatText(text, length = 5, elipsis = '...'){
      if (!text) return '';
      if (text.length > length) {
        return `${text.substr(0, length)}${elipsis}`;
      }
      return text;
    },

    renderGraph(nodes,edges) {
      this.graph.clear();
      const newNodes = [];
      const newEdges = [];

      nodes?.forEach((node)=>{
        //计算当前节点邻居个数(暴力法，可能性能不优化)
        let neiborhood = 1;
        edges.forEach(relation=>{
          if ((relation.from == node.id || relation.to == node.id))
              neiborhood += 1;
        }) 
        var elseType= (node.type == "药物" || node.type == "材料" || node.type == "疾病" || node.type == "效果" || node.type == "治疗方法")?node.type:"其他"
        let curNode={
          id: "node-" + node.id,
          //size: neiborhood != 1 ? Math.log2(neiborhood) * 20 + 30 : 0.1,
          size:60,
          value: node.text,
          //上面的label是自动根据大小省略的，下面的是死的
          label: this.formatText(node.text, 5, '...'),
          //label:neiborhood < 2 ? "" : node.text,
          labelCfg: {
            style: {
              fill: 'white',
              fontSize: 14,
              //fontWeight:400,
              shadowColor: '#2e2e2e',
              shadowBlur: 3,
              shadowOffsetX: -1,
              shadowOffsetY: -1,
            }
          },
          text: node.text,
          class: node.type,         
          ...nodeConfig[elseType]
        };
        // console.log(node,curNode)
        newNodes.push(curNode);
      })
      
      //统一添加两个新属性用于记录变化的标签
      newNodes.forEach((node)=>{
        node.oriSize = node.size;
        node.oriLabel = node.label;
      });

      edges?.forEach((relation) =>{
        newEdges.push({
          source: "node-" + relation.from,
          target: "node-" + relation.to,
          label: relation.text
        });
      })
      this.graph.data({
        nodes: newNodes,
        edges: newEdges
      })
      this.graph.render();

    },
  },
}
</script>

<style scoped lang="scss">
#graph-container {
  height: 100%;
  border: 1px solid #ccc;
}
#toolbar {
  position: relative;
}
::v-deep .g6-component-toolbar {
  border: 0px solid #e2e2e2;
  border-radius: 10px;
  font-size: 12px;
  color: #545454;
  background-color: rgba(255, 255, 255, 0);
  padding: 10px 8px;
  //box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  //width: auto;
  cursor: pointer;
  position: absolute;
  margin: 10px;
}
::v-deep .g6-component-toolbar:hover {
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
}
</style>