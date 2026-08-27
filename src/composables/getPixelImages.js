import pixelArts from "@/data/PixelArts.json"

export function getPixelImages(title){
    //根据名字找到特定的像素画
    const earth = pixelArts.find(item => item.title === title)
    return earth.image
}