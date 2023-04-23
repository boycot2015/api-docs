<script setup lang="ts">
import { useAnchorStore } from '@/stores/app'
import Header from '@/layout/header.vue'
import config from '@/config'
import logo from '@/assets/image/logo.png'
const appPageAnchors = useAnchorStore()
const getCavans = () => {
    let canvas:any = document.getElementById("canvas"),
        ctx = canvas.getContext('2d'),
        width = canvas.width = canvas.offsetWidth,
        height = canvas.height = canvas.offsetHeight;
    //声明参数
    let A = 60,
        W = 1 / 200,
        Q = 0,
        H = height / 2;
    let A2 = 60,
        W2 = 1 / 200,
        Q2 = 0,
        H2 = height / 2;
    let speed = -0.005;
    let speed2 = -0.001;
    
    //创建线性渐变
    let lingrad = ctx.createLinearGradient(0, 0, width, 0);
    //规定渐变对象中的颜色和停止位置
    lingrad.addColorStop(0, 'rgba(114,114,114,0.8)');
    lingrad.addColorStop(1, 'rgba(0,0,0,1)');
    
    let lingrad2 = ctx.createLinearGradient(0, 0, width, 0);
    lingrad2.addColorStop(0, 'rgba(0,0,0,1)');
    lingrad2.addColorStop(1, 'rgba(114,114,114,0.8)');
    
    //绘图方法
    (function draw() {
        /**
         * 将Q随时间不断增加或减小，即可得到不同时间的不同图像
         * 使用window.requestAnimationFrame实现帧动画
         */
        window.requestAnimationFrame(draw);
        ctx.clearRect(0, 0, width, height); // 清空画布
        
        ctx.beginPath(); //开始路径
        ctx.strokeStyle = "#000"; //设置线条颜色
        ctx.fillStyle = lingrad;  //填充渐变色
        ctx.lineWidth = 1; //设置线条宽度
        ctx.moveTo(0, height); //起始点位置    moveTo(x,y)可把窗口的左上角移动到一个指定的坐标
        Q += speed;
        for(let x = 0; x <= width; x++) { //绘制x对应y的
            let y = A * Math.sin(W * x + Q) + H;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();
        ctx.closePath() //闭合路径
        /**
         * globalCompositeOperation 属性设置或返回如何将一个源（新的）图像绘制到目标（已有）的图像上。
                源图像 = 您打算放置到画布上的绘图。
                目标图像 = 您已经放置在画布上的绘图。
            destination-over:在源图像上方显示目标图像
            */
        ctx.globalCompositeOperation = "destination-over"
        
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.fillStyle = lingrad2;
        Q2 += speed2;
        for(let x = 0; x < width; x++) {
            let y = A2 * Math.sin(x * W2 + Q2) + H2;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill()
        ctx.closePath();

    })()
}
const process = ref([{
    title: '商家自主接入流程',
    list: [{
        name: '商家登陆',
        desc: '使用商家账号登陆商户后台'
    },{
        name: '自主申请',
        desc: '申请密钥及账号并录入对接申请信息'
    },{
        name: '接口配置/测试',
        desc: '对接测试环境进行测试'
    },{
        name: '部署上线',
        desc: ''
    }]
}, {
    title: '第三方接入流程',
    style: {
        backgroundColor: '#fff'
    },
    list: [{
        name: '注册成为<br>开放平台用户',
        desc: ''
    },{
        name: '创建应用',
        desc: ''
    },{
        name: '接口配置/调试',
        desc: ''
    },{
        name: '部署上线',
        desc: ''
    }]
}])
onMounted(() => {
    appPageAnchors.setAnchor(document.querySelectorAll('.app-page-anchor'))
    getCavans()
})
</script>
<template>
  <div class="home">
    <el-header><Header>
        <template #logo>
            <RouterLink class="logo" to="/">
                <img :src="logo" />
                {{config.websiteName}}
            </RouterLink>
        </template>
    </Header></el-header>
    <canvas id="canvas"></canvas>
    <div class="container">
        <div class="process" :style="item.style" :key="item.title" v-for="(item) in process">
            <h3>{{item.title}}</h3><span class="process_border"></span>
            <ul class="x-center">
                <li :key="list.name" v-for="(list, index) in item.list">
                    <div class="process_logo"><span class="process_num process_unpass">{{index + 1}}</span>
                        <div class="dian" v-if="index < item.list.length - 1">.................<span class="icon-kf_xiangyou01 precess_jiantou"></span></div>
                    </div>
                    <h5 v-html="list.name"></h5>
                    <p>{{list.desc}}</p>
                </li>
            </ul>
        </div>
        <!--foot_nav部分-->
        <div class="foot_nav">
            <footer>
                <div class="footer">
                    <div class="inner">
                    <span class="text_left">
                        <a href="http://www.yunzhonghe.com" target="_blank">云中鹤官网&nbsp;&nbsp;</a>
                    </span>
                    <span class="text_right">Copyright©2001-2023&nbsp;&nbsp;云中鹤版权所有&nbsp;&nbsp;<a href="http://www.miitbeian.gov.cn">粤ICP备16107141号</a>
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.home {
    text-align: center;
    width: 100%;
    canvas {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        background-color: var(--vt-c-black-light);
        height: 300px;
    }
    .container {
        padding-top: 220px;
    }
    .logo {
        display: flex;
        flex-basis: 200px;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        img {
            height: 24px;
            margin-right: 16px;
        }
    }
    .foot_nav {
        padding: 16px 0;
        color: #ffffff;
        background-color: var(--vt-c-black-mute);
    }
}
.process {
    width: 100%;
    background: #F4F7F9;
    padding: 80px 0;
    margin-bottom: 30px;
    text-align: center;
}
.process h3 {
  font-size: 24px;
  line-height: 32px;
  font-weight: normal;
}
.process .process_border {
  display: inline-block;
  width: 60px;
  border-top: 2px solid var(--el-color-primary);
  margin-top: 12px;
}
.x-center {
    margin: 0 auto;
}
.process > ul {
  width: 1200px;
  margin-top: 50px;
  font-size: 0;
}
.process > ul li {
  text-align: center;
  display: inline-block;
  vertical-align: top;
  margin-right: 75px;
  width: 168px;
  font-size: 14px;
}
.process > ul li .process_logo {
  width: 60px;
  height: 60px;
  display: inline-block;
  position: relative;
}
.process > ul li .process_logo span {
  position: relative;
  font-size: 60px;
  color: #525A65;
}
.process > ul li .process_logo .huan {
  border: 3px solid #525A65;
}
.process > ul li .process_logo .yuan {
  background: #525A65;
}
.process > ul li .process_logo .process_num {
  display: inline-block;
  height: 60px;
  width: 60px;
  box-sizing: border-box;
  border-radius: 50%;
  font-size: 30px;
  line-height: 54px;
  border: 3px solid #525A65;
}
.process > ul li .process_logo .process_pass {
  color: #ffffff;
  background: #525A65;
}
.process > ul li .process_logo .process_unpass {
  color: #525A65;
}
.process > ul li .process_logo .dian {
  position: absolute;
  left: 120%;
  top: 5px;
  font-size: 25px;
  letter-spacing: 3px;
  color: #525A65;
}
.process > ul li .process_logo .dian .precess_jiantou {
  font-size: 26px;
  position: absolute;
  top: 12px;
}
.process > ul li .process_logo .dian .precess_jiantou:before {
  position: absolute;
  left: -10px;
}
.process > ul li h5 {
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 18px;
  line-height: 26px;
  font-weight: normal;
  color: #333333;
}
.process > ul li p {
  padding-bottom: 22px;
  font-size: 14px;
  color: #666666;
  line-height: 20px;
}
.process > ul li .process_item .process_a2 {
  margin: 12px 0;
}
.process > ul li a {
  display: inline-block;
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  color: #333333;
}
.process > ul li a span {
  vertical-align: middle;
}
.process > ul li a span:nth-child(2) {
  font-size: 20px !important;
}
.process > ul li a:hover {
  color: var(--el-color-primary);
}
</style>
