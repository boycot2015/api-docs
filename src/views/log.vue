<template>
  <div class="about">
    JavaScript API GL 更新日志 <br>
    <div class="app-page-anchor" id="app-page-anchor0">2023.02.24</div><br>
    新增功能:<br>
    Map新增enableRotateGestures()、disableRotateGestures()方法。
    稳定性优化:<br>
    修复定位控件在http模式下失效问题
    定位控件增加事件监听
    优化更改中心点地图无倾斜角问题
    修复禁止双指缩放的方法未生效问题<br>
    <div class="app-page-anchor" id="app-page-anchor1">2023.02.20</div>
    新增功能:<br>
    新增自定义覆盖物，详见自定义覆盖物。
    新增自定义覆盖物图层，详见自定义覆盖物图层。<br>
    <div class="app-page-anchor" id="app-page-anchor2">2023.02.06</div>
    新增功能:<br>
    地面覆盖物BMapGL.GroundOverlay支持设置透明度&四至范围
    稳定性优化:
    手机端H5页面点覆盖物启用拖动模式下，修复手势不能拖动问题
    修复内存泄漏<br>
    <div class="app-page-anchor" id="app-page-anchor3">2023.01.05</div>
    新增功能:<br>
    新增线图层，在支持实线、虚线的基础上支持描边线、纹理贴图线、间隔图标填充，可组合实现多种可视化效果。
    新增面图层，在支持面颜色填充、描边基础上，支持纹理填充。
    支持用户主动触发地图点击动画效果。首先，注册onhotclick事件，示例：let hotevent = new BMapGL.Event('onhotclick')；然后，设置pixel属性值为鼠标点击像素位置，可以使用地图事件e，取其中的像素坐标，示例：hotevent.pixel = new BMapGL.Pixel(e.pixel.x, e.pixel.y)或者hotevent.pixel = map.pointToPixel(e.latlng)；最后，触发Map事件，示例:map.dispatchEvent(hotevent)<br>
    稳定性优化:<br>
    BMapGL.Polyline支持通过设置linkRight:true和clip:false,解决跨±180度经线绘制问题。<br>
    <div class="app-page-anchor" id="app-page-anchor4"> 2022.12.19</div>
    新增功能:<br>
    覆盖物支持添加ContextMenu对象。
    MVTLayer支持用户设置请求瓦片的header头文件。
    MVTLayer在不指定图层名时,默认:线数据渲染在面上面,可以通过defaultOrder:false设置,将面渲染在线上。<br>
    <div class="app-page-anchor" id="app-page-anchor5"> 2022.12.08</div>
    新增功能:<br>
    MVTLayer支持缩放过程中平滑过渡。
    MVTLayer支持添加额外自定义文字。<br>
    稳定性优化:<br>
    centerAndZoom支持以省份全称定位。
    修复自定义文字缺陷。
    修复线编辑状态下设置坐标串，未重置编辑节点。
    修复因底图样式找不到造成的数据不解析问题。<br>
    <div class="app-page-anchor" id="app-page-anchor6"> 2022.11.25</div>
    新增功能:<br>
    mvt支持加解密请求
  </div>
</template>
<script setup lang="ts">
import { useAnchorStore } from '@/stores/app'
const appPageAnchors = useAnchorStore()
onMounted(() => {
    appPageAnchors.setAnchor(document.querySelectorAll('.app-page-anchor'))
})
</script>
<style>
/* @media (min-width: 1024px) {
  .about {
    display: flex;
  }
} */
</style>
