<script setup>
  import { ref } from 'vue';
  import Gallery from './views/Gallery.vue'
  
  //存储页面导航
  const currentPage = ref("gallery")
</script>

<template>
  <div id="app">
    <!-- 顶栏 -->
    <header>
      <!-- 网站名 -->
      <span id="website-name" @click="currentPage='gallery'">PixelSpace</span>

      <!-- 导航 -->
      <div id="navi">
        <span @click="currentPage='gallery'">作品集</span>
        <span @click="currentPage='about'">关于</span>
        <span @click="currentPage='call'">联系</span>
      </div>
    </header>

    <!-- 内容 -->
    <Gallery v-if="currentPage=='gallery'"></Gallery>
  </div>
</template>

<style>
@font-face {
  font-family: "terrarum";
  src: url("./assets/fonts/TerrarumSansBitmap.woff2");
  font-weight: normal;
  font-style: normal;
}

*{
  font-family: "terrarum";
}

header{
  display: flex;
  margin-bottom: 50px;
}

#website-name{
  font-weight: bold;
  font-size: 32px;
  line-height: 40px;
  margin-left: 15px;
}

#navi{
  font-size: 30px;
  width: 300px;

  display: flex;
  justify-content: space-evenly;
  cursor: pointer;

  padding: 5px;
}
</style>
