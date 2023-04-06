<script setup lang="ts">
import { useAnchorStore } from '@/stores/app'
import { onMounted } from 'vue'
const appPageAnchors = useAnchorStore()
onMounted(() => {
    appPageAnchors.setAnchor(document.querySelectorAll('.app-page-anchor'))
})
</script>
<template>
  <div class="home">
    <div id="title">JavaScript API GL</div> <br>
    更新时间：2022年07月20日 <br>
    <div class="app-page-anchor" id="app-page-anchor0">产品简介</div><br>
    百度地图JavaScript API GL 是一套由JavaScript语言编写的应用程序接口，使用了WebGL对地图、覆盖物等进行渲染，支持3D视角展示地图。帮助开发者在网站中构建功能丰富、交互性强的地图应用，支持PC端和移动端基于浏览器的地图应用开发。JavaScript API GL提供了丰富的功能接口，包括地图展示、定位、覆盖物、检索、路线规划等，适配多样化的业务场景。<br>

    百度地图JavaScript API支持HTTP和HTTPS，免费对外开放。在使用前，您需先申请密钥（ak）才可使用。在您使用百度地图JavaScript API之前，请先阅读百度地图开放平台《服务条款》。任何非营利性应用请直接使用，商业应用请参考使用须知。<br>

    JavaScript API GL的使用方式请参考开发指南，详细的接口类说明请参考类参考文档，快速了解JavaScript API GL可支持的功能请参考示例中心提供的示例demo。如果您在使用过程遇到技术问题，可查看常见问题或通过工单联系我们。<br>

    <div  class="app-page-anchor" id="app-page-anchor1">核心功能指引</div><br>
    入门指南<br>
    账号和获取秘钥<br>
    使用须知<br>
    Hello World
    坐标转换说明
    React-BMapGL指南<br>
    创建地图<br>
    展示地图
    变更地图类型
    添加控件
    个性化地图<br>
    覆盖物<br>
    绘制点、线、面
    带高度的点
    镂空面绘制
    3D棱柱绘制
    地面叠加层
    文本标注
    信息窗口<br>
    交通流量图层<br>
    事件处理<br>
    地图事件
    右键菜单<br>
    动态效果<br>
    自定义视角动画
    轨迹动画<br>
    LBS服务<br>
    正/逆地址解析
    出行路线规划
    定位<br>
    图层服务<br>
    三方标准图层
    简易行政区划图层
    区域掩膜
    像素个性化
    室内图<br>
    全景图<br>
    <div  class="app-page-anchor" id="app-page-anchor2">核心功能体验</div><br>
    地图3D展示
    地球模式
  </div>
</template>
