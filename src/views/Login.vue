<template>
  <div id="panic">
    <span id="title">{{ title }}</span>
    <span id="subtitle">加入像素空间，一起用像素块编织世界🖌️</span>

    <input
    type="text"
    name="username"
    placeholder="🧑‍🎨 创作者昵称"
    >
    
    <input
    type="password"
    name="password"
    placeholder="🔑 密码"
    >
    <span id="transform" @click="state=!state">{{ transform_text }}</span>
    <button type="submit">开始创作</button>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'

let state = ref(true)
const transform_text = computed(() => {
  if (state.value){
    return "已有帐号？点击进行注册"
  }else{
    return "😀 欢迎回来"
  }
})
const title = computed(() => {
  if (state.value){
    return "🎨 注册成为创作者"
  }else{
    return "欢迎回来"
  }
});

</script>
<style scoped>
#panic{
  width: 600px;
  height: 480px; 
  position: relative;
  margin: auto;
  margin-top: 130px;
  border-radius: 5px;
  border: 2px solid #e0d8d0;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
}

#title{
  display: block;
  font-size: 34px;
  position: relative;
  text-align: center;
  font-weight: bold;
  margin-top: 60px;
}

#subtitle{
  display: block;
  font-size: 20px;
  position: relative;
  margin-top: 10px;
  margin-bottom: 50px;
  text-align: center;
  color: rgb(70, 70, 70);
}

input{
  display: block;
  outline: none;
  width: 350px;
  height: 50px;
  display: block;
  position: relative;
  margin: auto;
  margin-top: 20px;
  font-size: 20px;
  border-radius: 5px;
  padding-left: 10px;
  border: 2px solid #e0d8d0;
  background-color: #f8f8f8;
}

button[type="submit"]{
  display: block;
  position: relative;
  margin: auto;
  width: 130px;
  height: 50px;
  margin-top: 30px;
  font-size: 20px;
  color: gray;
  border: 2px solid #e0d8d0;
  border-radius: 50px;
}

#transform{
  display: block;
  text-align: center;
  margin-top: 20px;
  cursor: pointer;
  user-select: none;
}
</style>