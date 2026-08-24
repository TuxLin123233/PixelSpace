<template>
    <div id="topic">
        <span>我的像素空间</span>
        <img :src="getPixelImages('地球')" alt="地球" width="100">
    </div>
    <!-- 搜索框 -->
    <div id="search">
        <input 
        type="text"
        v-model="search"
        placeholder="搜索..."
        >
        <img src="../assets/svgs/search.svg" alt="放大镜" width="30">
    </div>
    <!-- 内容区 -->
    <div id="content">
        <div v-for="i in cardRow" class="card-row">
            <pixelCard v-for="art in getRow(i - 1)" :key="art.id" :art="art"/>
        </div>
    </div>
</template>

<script setup>
import pixelArts from "@/data/PixelArts.json"
import pixelCard from "@/components/pixelCard.vue";
import { computed, ref } from "vue";

const search = ref("")      //绑定搜索结果

/**
 * 数据流：
    i=1 → getRow(0) → start=0 → 取 [0,1,2,3]
    i=2 → getRow(1) → start=4 → 取 [4,5,6,7]
    i=3 → getRow(2) → start=8 → 取 [8,9,...]
 */
const cardRow = computed(() => {        //获取当前有多少行
    return Math.ceil(pixelArts.length / 4)
})
const getRow = function(rowIndex){
    const start = (rowIndex) * 4
    return pixelArts.slice(start, start + 4)
}

function getPixelImages(title){
    //根据名字找到特定的像素画
    const earth = pixelArts.find(item => item.title === title)
    return earth.image
}
</script>

<style scoped>
#topic{
    font-size: 60px;
    display: flex;
    width: 390px;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin: auto;
}

#search{
    display: flex;
    width: 700px;
    position: relative;
    margin: auto;
    height: 60px;
    border: 2px solid rgb(216, 216, 216);
    justify-content: space-between;
    box-sizing: border-box;
    padding-right: 20px;
    padding-left: 30px;
    border-radius: 50px;
    transition: border 0.3s ease, box-shadow 0.3s ease;
    margin-bottom: 50px;
}
#search:focus-within{
    border-color: #42b883;
    box-shadow: 0 0 0 4px rgba(66, 184, 131, 0.2);
}

#search input{
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 30px;
}

.card-row{
    width: 1000px;
    display: flex;
    justify-content: space-around;
    position: relative;
    margin: auto;
    margin-bottom: 50px;
}
</style>