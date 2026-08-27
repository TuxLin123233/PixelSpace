<script setup>
  import { ref } from 'vue';
  import Gallery from './views/Gallery.vue'
  import Create from './views/Create.vue';

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
      <!-- 主要功能 -->
      <div class="navi" id="navi-main">
        <span @click="currentPage='gallery'"><img src="@/assets/svgs/grid.svg" width="40">作品集</span>
        <span @click="currentPage='about'"><img src="@/assets/svgs/about.svg" width="40">关于</span>
        <span @click="currentPage='call'"><img src="@/assets/svgs/mail.svg" width="40">联系</span>
      </div>

      <!-- 用户功能 -->
      <div class="navi" id="navi-user">
        <span @click="currentPage='create'"><img src="@/assets/svgs/cube.svg" width="40">开始创作</span>
        <span @click="currentPage='mine'"><img src="@/assets/svgs/category.svg" width="40">我的作品</span>
        <span @click="currentPage='settings'"><img src="@/assets/svgs/setting.svg" width="40">设置</span>
      </div>
    </header>

    <!-- 内容 -->
    <Gallery v-if="currentPage=='gallery'"></Gallery>
    <Create v-if="currentPage=='create'"></Create>
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
  align-items: center;
  margin-bottom: 50px;
}

/* 顶栏右侧的用户功能 */
#navi-user{
  width: 350px;
  margin-left: auto;
  margin-right: 15px;
}

#navi-main{
  width: 320px;
}

#website-name{
  font-weight: bold;
  font-size: 32px;
  line-height: 40px;
  margin-left: 15px;
  cursor: pointer;
}

.navi{
  font-size: 25px;
  width: 300px;

  display: flex;
  justify-content: space-evenly;
  cursor: pointer;
  user-select: none;

  padding: 5px;
}

.navi span{
  padding: 5px 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.navi span img{
  width: 22px;
  height: 22px;
}

.navi span:hover{
  background: var(--button-hover-color);
}
</style>
