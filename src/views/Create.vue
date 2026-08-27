<template>
    <div id="main">
        <canvas id="cv"></canvas>
    </div>
</template>
<script setup>

</script>

<style scoped>
#main{
    width: 700px;
    height: 700px;
    position: relative;
    margin: auto;
    border-radius: 20px;
    box-shadow: 0px 0px 5px var(--boxshadow-color);
}

#main canvas{
    display: block;
    position: relative;
    margin: auto;
    margin-top: 30px;
}
</style>