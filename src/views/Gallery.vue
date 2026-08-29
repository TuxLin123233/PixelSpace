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
        <img src="../assets/svgs/search.svg" alt="放大镜" width="30" @click="">
    </div>
    <!-- 点击后显示的详细信息窗口 -->
    <imageModal v-if="show_image" @close_image="handleCloseImage" :art="slect_art"></imageModal>
    <!-- 内容区 -->
    <div id="content">
        <div v-for="i in cardRow" class="card-row">
            <pixelCard v-for="art in getRow(i - 1)" :key="art.id" :art="art" @show_image="handleShowImage"/>
        </div>
    </div>
    <!-- 页面导航区 -->
    <div id="page-navi" :style="pageNaviStyle">
        <span v-if="page != 1" @click="goTo(page - 1)"><img src="../assets/svgs/left.svg" alt="left" width="25"></span>
        <span v-for="i in visiblePages" @click="goTo(i)">{{ i }}</span>
        <span v-if="page != totalPages" @click="goTo(page + 1)"><img src="../assets/svgs/right.svg" alt="right" width="25"></span>
    </div>
</template>

<script setup>
import pixelArts from "@/data/PixelArts.json"
import pixelCard from "@/components/pixelCard.vue";
import imageModal from "@/components/imageModal.vue";
import { computed, ref} from "vue";
import { getPixelImages } from "@/composables/getPixelImages";
import { useRoute, useRouter } from "vue-router";

const route = useRoute()    //用于获取当前URL信息
const page = ref(parseInt(route.query.page) || 1)   //定义当前页面数
const perPageCount = 8     //定义每页最多显示12个卡片
/* 注意！跳转页面，不能修改page，因为URL不会变，而是要使用router来跳转 */
const router = useRouter()  //用于跳转、切换URL信息
const start = computed(() => (page.value - 1) * perPageCount)               //起始卡片索引
const end = computed(() => (page.value - 1) * perPageCount + perPageCount)  //结束卡片索引
//我们总共有多少个页面, “有余数就进 1”
const totalPages = computed(() => Math.ceil(pixelArts.length / perPageCount))         

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

const pageNaviStyle = computed(() => {
    //自适应页面导航栏的样式：宽度
    if (page.value == 1 || page.value == totalPages.value){       //首尾时
        return {"width": "240px"}
    }else{
        return {"width": "300px"}
    }
})

//获取搜索结果
const filtered = computed(() => {
    if (!search.value.trim()){      //如果没有搜索的默认情况
        return pixelArts.slice(start.value, end.value)
    }else{
        return pixelArts.filter(item => 
            item.title.includes(search.value)
        ).slice(start.value, end.value)
    }   
})

/**
 * 数据流：
    i=1 → getRow(0) → start=0 → 取 [0,1,2,3]
    i=2 → getRow(1) → start=4 → 取 [4,5,6,7]
    i=3 → getRow(2) → start=8 → 取 [8,9,...]
 */
const cardRow = computed(() => {        //获取当前有多少行
    return Math.ceil(filtered.value.length / 4)
})
const getRow = function(rowIndex){
    //根据某一行来给出该行的所有元素
    const start = (rowIndex) * 4
    return filtered.value.slice(start, start + 4)    //切片
}

const visiblePages = computed(() => {   //定义页面导航区显示的数字列表
    const current = page.value          //当前URL是哪个页面索引
    const pages = []

    let start = Math.max(1, current - 2)                // 1 <= current
    let end = Math.min(totalPages.value, current + 2)   // current <= totalPages

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

function goTo(index){
    page.value = index  // ✅ 先改 page
    router.push({ path: '/gallery', query: { page: index } })
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
}

.card-row:first-child{
    margin-bottom: 50px;
}

.card-row:last-child{
    margin-bottom: 45px;
}

#page-navi{
    position: relative;
    margin: auto;
    display: flex;
    justify-content: space-around;
}

#page-navi span{
    width: 30px;
    height: 30px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    box-shadow: 0px 2px 2px var(--boxshadow-color);
    border: 1px solid rgb(240, 240, 240);
    cursor: pointer;
    font-weight: bold;
    transition: box-shadow ease 0.3s;
    transition: background-color ease 0.3s;
    background-color: white;
    user-select: none;
}

#page-navi span:hover{
    box-shadow: 0px 2px 1px var(--boxshadow-color);
    background-color: rgb(250, 250, 250);
}
</style>