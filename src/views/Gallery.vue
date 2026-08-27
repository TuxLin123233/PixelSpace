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
    <!-- 点击后显示的详细信息窗口 -->
    <imageModal v-if="show_image" @close_image="handleCloseImage" :art="slect_art"></imageModal>
    <!-- 内容区 -->
    <div id="content">
        <div v-for="i in cardRow" class="card-row">
            <pixelCard v-for="art in getRow(i - 1)" :key="art.id" :art="art" @show_image="handleShowImage"/>
        </div>
    </div>
</template>

<script setup>
import pixelArts from "@/data/PixelArts.json"
import pixelCard from "@/components/pixelCard.vue";
import imageModal from "@/components/imageModal.vue";
import { computed, ref} from "vue";
import { getPixelImages } from "@/composables/getPixelImages";

const search = ref("")      //绑定搜索结果
const show_image = ref(false)   //记录是否展示大卡片弹窗
const slect_art = ref({})   //记录现在所选的某一个像素画对象
const handleShowImage = function(art){
    //展示大卡片
    show_image.value = true
    slect_art.value = art
}
const handleCloseImage = function(){
    //关闭大卡片
    show_image.value = false
    slect_art.value = {}
}
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
    //根据某一行来给出该行的所有元素
    const start = (rowIndex) * 4
    return pixelArts.slice(start, start + 4)    //切片
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

#search img:hover{
    cursor: pointer;
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