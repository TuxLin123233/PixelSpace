<script setup>
import { computed, defineEmits} from 'vue';

const props = defineProps(['art'])      //接受父组件的信息
const emit = defineEmits(['show_image'])
const image_width = computed(() => {    //自适应图片大小
  if (props.art.size === 2){
    return 130
  }else if (props.art.size == 0){
    return 160
  }else{
    return 150
  }
})

function send_show_image(){
  //发送展示像素作品窗口的消息
  emit('show_image', props.art)
}
</script>

<template>
  <div class="pixel-card" @click="send_show_image">
    <!-- 图像展示区 -->
    <div class="display">  
      <img :src="art.image" :alt="art.title" :width="image_width">
    </div>
    <!-- 内容区 -->
    <div class="content">
      <div class="title">{{ art.title }}</div>
      <div class="category">类别：{{ art.category }}</div>
      <div class="description">描述：{{ art.description }}</div>
    </div>
    <!-- 日期 -->
    <div class="date">{{ art.date }}</div>
  </div>
</template>

<style scoped>
.pixel-card{
  width: 170px;
  height: 260px;
  box-shadow: 0px 0px 5px var(--boxshadow-color);
  border-radius: 10px;
  box-sizing: border-box;
  padding-bottom: 10px;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  border: 1px solid rgb(235, 235, 235);
}

.pixel-card:hover{
  transform: translateY(-10px);
  box-shadow: 0px 0px 10px var(--boxshadow-color);
  user-select: none;
  cursor: pointer;
}

.display{
  width: 150px;
  height: 150px;
  position: relative;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title{
  font-weight: bold;
}

.content{
  border-top: 1px solid rgb(218, 218, 218);
  margin-left: 10px;
  margin-right: 10px;
  padding-top: 10px;
}

.description{
  white-space: nowrap;    /* 不换行 */    
  overflow: hidden;       /* 隐藏溢出 */   
  text-overflow: ellipsis; /* 显示 ... */
}

.date{
  margin-right: 10px;
  text-align: right; 
  margin-top: 10px;
}

.title{
  font-size: 20px;
}
</style>