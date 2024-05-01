<template>
    <div>
        <el-dialog
            :title="$t('intro')"
            :visible="visible"
            width="30%"
            :modal="false"
            top="0"
            class="dialog"
            :before-close="dialogVisible"
        >
            <span class="content" v-html="$t('text')"></span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible">{{ $t('cancel') }}</el-button>
                <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        // 标题
        title: {
            type: String,
            default: '简介'
        },
        // 弹框控制
        visible: {
            type: Boolean,
            default: false
        },
        // 文本
        text: {
            type: String,
            default: '中医药大模型知识图谱智能问答系统利用大语言模型和知识图谱等人工智能新技术，实现中医药专业知识的智能问答，能够根据用户描述的症状进行中医药方剂智能推荐，形成中医药专业知识智能专家系统。'
        },
        // 接收的数据
        data: {
            type: Object,
            default: () => {}
        },
        // 是否居中
        center: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        dialogVisible() {
            this.$emit('update:visible', false);
        },
        submit() {
            this.$emit('submit', `${this.title}再次确认按钮`);
        }
    }
};
</script>

<style lang="scss">
.dialog{
    .content {
        display: block;
        // text-align: center;
    }
}
</style>