<template>
    <!-- 遮罩层：覆盖整个屏幕 -->
    <div id="overlay" @click="closeModal">
        <!-- 弹窗内容：居中，点击不冒泡 -->
        <div id="main" @click.stop>
            <header>
                <span id="title">《{{ art.title }}》</span>
                <img src="../assets/svgs/close.svg" alt="close" width="35" @click="closeModal">
            </header>
            <div id="content">
                <div id="display">
                    <img :src="art.image" :alt="art.title" :width="picture_size">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['close_image'])
const props = defineProps(['art'])

//告诉父组件关闭窗口
const closeModal = () => {
    emit('close_image')
}

const picture_size = computed(() => {
    if (props.art.size == 2){
        return 130
    }else{
        return 200
    }
})
</script>

<style scoped>
/* 遮罩层 */
#overlay {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);   /* ← 加背景色！ */
    display: flex;                    /* ← 用 flex 居中 */
    justify-content: center;
    align-items: center;
    z-index: 999;
    cursor: pointer;
    animation: fadeIn 0.3s ease;
}

/* 弹窗内容（注意是 #main，不是 main） */
#main {
    width: 600px;
    height: 230px;
    box-shadow: 0px 0px 5px rgb(83, 83, 83);
    background-color: white;
    border-radius: 20px;
    padding: 20px;
    cursor: default;          /* 弹窗内容不要显示手型指针 */
    overflow-y: auto;
    animation: zoomIn 0.3s ease;
}

header{
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

#title{
    font-weight: bold;
    font-size: 32px;
}

img[alt="close"]{
    cursor: pointer;
}

/* 淡入动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* 放大动画 */
@keyframes zoomIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

#display{
    z-index: 1;     /* 内部元素不需要太高 */
    width: 150px;
    height: 150px;
    border-radius: 10px;
    position: relative;
    border: 2px solid var(--boxshadow-color);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>