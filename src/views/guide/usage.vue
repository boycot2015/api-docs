<template>
    <div class="usage">
    使用须知 <br>
    更新时间：2022年08月07日<br>
    <div class="app-page-anchor" id="app-page-anchor0">服务版本说明书</div><br>
    JavaScript API GL 是基于WebGL全新开发的地图API接口，为了方便开发者迁移升级，大部份接口向下兼容。JavaScript API GL的使用方式请参考开发指南，详细的接口类说明请参考类参考文档，快速了解JavaScript API GL可支持的功能请参考示例中心提供的示例demo。<br>
    异步加载<br>
    JavaScript API GL v1.0支持异步加载，您可以在引用脚本的时候添加callback参数，当脚本加载完成后callback函数会被立刻调用。请参考下面的使用示例：<br>

    <div class="app-page-anchor" id="app-page-anchor1">兼容性</div><br>
    JavaScript API GL v1.0 基于WebGL开发，对于用户的浏览器环境有兼容性要求。需要完整支持WebGL的现代浏览器来支持渲染。对于WebGL支持欠佳的浏览器会降级为Canvas绘制，若仍然存在兼容性问题，则会降级到瓦片图渲染，确保不同浏览器环境的用户都可以完成地图的基本渲染。<br>

    <div class="app-page-anchor" id="app-page-anchor2">获取技术支持途径</div><br>
    如果您在使用百度地图API中遇到问题，请尝试通过以下途径解决：<br>

    确认您使用了正确的地图API地址和API接口。<br>

    查看常见问题，自助排查。<br>

    通过反馈平台提工单进行反馈。
    <div id="mw-content-text" lang="zh-CN" dir="ltr" class="mw-content-ltr">
        <div class="h1-title">右键菜单</div><div id="update-time1">更新时间：2020年08月07日</div><div class="bluetitle"><div class="serve-explain-text"><div class="app-page-anchor" id="app-page-anchor3"><span>简介</span></div></div></div><div class="serve-explain-text">
    <p>Javascript API GL支持右键菜单，您可以在地图上添加自定义内容的右键菜单。
    </p>
    </div><div class="aloneDemo"><div dir="https://lbs.baidu.com/jsdemo/demo/webgl4_0.htm"></div><div class="top_right"><a rel="nofollow" target="_blank" class="external text" href="https://lbsyun.baidu.com/jsdemo.htm#kMapClickEvent">DEMO详情</a></div><iframe scrolling="no" frameborder="0" id="dev_wiki_iframe0" src="https://lbs.baidu.com/jsdemo/demo/webgl4_0.htm"></iframe></div><div class="bluetitle"><div class="serve-explain-text"><div class="app-page-anchor" id="app-page-anchor4"><span>添加右键菜单</span></div></div></div><div class="serve-explain-text">Javascript API GL提供了addContextMenu方法来向地图添加自定义右键菜单。</div><div class="devguide"><div class="devguideorder"><span>1</span>创建基本地图</div><div class="devguidecenter"><pre class="prettyprint codestyle prettyprinted" style=""><span class="kwd">var</span><span class="pln"> map </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">new</span><span class="pln"> </span><span class="typ">BMapGL</span><span class="pun">.</span><span class="typ">Map</span><span class="pun">(</span><span class="str">"allmap"</span><span class="pun">);</span><span class="pln">                </span><span class="com">// 创建地图实例</span><span class="pln">
    </span><span class="kwd">var</span><span class="pln"> point </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">new</span><span class="pln"> </span><span class="typ">BMapGL</span><span class="pun">.</span><span class="typ">Point</span><span class="pun">(</span><span class="lit">116.404</span><span class="pun">,</span><span class="pln"> </span><span class="lit">39.915</span><span class="pun">);</span><span class="pln">     </span><span class="com">// 设置中心点坐标</span><span class="pln">
    map</span><span class="pun">.</span><span class="pln">centerAndZoom</span><span class="pun">(</span><span class="pln">point</span><span class="pun">,</span><span class="pln"> </span><span class="lit">12</span><span class="pun">);</span><span class="pln">                      </span><span class="com">// 设置地图级别</span><span class="pln">
    map</span><span class="pun">.</span><span class="pln">enableScrollWheelZoom</span><span class="pun">();</span><span class="pln">                       </span><span class="com">// 开启鼠标滚轮缩放</span></pre>
    </div><div class="devguideorder"><span>2</span>定义菜单项<br></div><div class="devguidecenter">
    <p>Javascript API GL提供了MenuItem构造函数来定义菜单项实例，其接收三个参数，分别是菜单项显示的文本（string）、点击后的回调函数（Function）以及一个可选的MenultOptions（对象字面量）参数。
    </p><p>在MenultOptions中，您可以指定菜单项的宽度以及菜单项dom的id。
    </p>
    <pre class="prettyprint codestyle prettyprinted" style="overflow-y: scroll; height: 300px;"><span class="kwd">var</span><span class="pln"> txtMenuItem </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[</span><span class="pln">
            </span><span class="pun">{</span><span class="pln">
                text</span><span class="pun">:</span><span class="str">'放大'</span><span class="pun">,</span><span class="pln">                             </span><span class="com">// 定义菜单项的显示文本</span><span class="pln">
                callback</span><span class="pun">:</span><span class="pln"> </span><span class="kwd">function</span><span class="pln"> </span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">                 </span><span class="com">// 定义菜单项点击触发的回调函数</span><span class="pln">
                    map</span><span class="pun">.</span><span class="pln">zoomIn</span><span class="pun">();</span><span class="pln">
                </span><span class="pun">}</span><span class="pln">
            </span><span class="pun">},</span><span class="pln">
            </span><span class="pun">{</span><span class="pln">
                text</span><span class="pun">:</span><span class="str">'缩小'</span><span class="pun">,</span><span class="pln">
                callback</span><span class="pun">:</span><span class="pln"> </span><span class="kwd">function</span><span class="pln"> </span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
                    map</span><span class="pun">.</span><span class="pln">zoomOut</span><span class="pun">();</span><span class="pln">
                </span><span class="pun">}</span><span class="pln">
            </span><span class="pun">}</span><span class="pln">
        </span><span class="pun">];</span><span class="pln">
    </span><span class="kwd">for</span><span class="pun">(</span><span class="kwd">var</span><span class="pln"> i </span><span class="pun">=</span><span class="pln"> </span><span class="lit">0</span><span class="pun">;</span><span class="pln"> i </span><span class="pun">&lt;</span><span class="pln"> txtMenuItem</span><span class="pun">.</span><span class="pln">length</span><span class="pun">;</span><span class="pln"> i</span><span class="pun">++){</span><span class="pln">
        menu</span><span class="pun">.</span><span class="pln">addItem</span><span class="pun">(</span><span class="kwd">new</span><span class="pln"> </span><span class="typ">BMapGL</span><span class="pun">.</span><span class="typ">MenuItem</span><span class="pun">(</span><span class="pln">               </span><span class="com">// 定义菜单项实例</span><span class="pln">
            txtMenuItem</span><span class="pun">[</span><span class="pln">i</span><span class="pun">].</span><span class="pln">text</span><span class="pun">,</span><span class="pln">                        </span><span class="com">// 传入菜单项的显示文本</span><span class="pln">
            txtMenuItem</span><span class="pun">[</span><span class="pln">i</span><span class="pun">].</span><span class="pln">callback</span><span class="pun">,</span><span class="pln">                    </span><span class="com">// 传入菜单项的回调函数</span><span class="pln">
            </span><span class="pun">{</span><span class="pln">
                width</span><span class="pun">:</span><span class="pln"> </span><span class="lit">300</span><span class="pun">,</span><span class="pln">                             </span><span class="com">// 指定菜单项的宽度</span><span class="pln">
                id</span><span class="pun">:</span><span class="pln"> </span><span class="str">'menu'</span><span class="pln"> </span><span class="pun">+</span><span class="pln"> i                          </span><span class="com">// 指定菜单项dom的id</span><span class="pln">
            </span><span class="pun">}</span><span class="pln">
        </span><span class="pun">));</span><span class="pln">
    </span><span class="pun">}</span></pre>
    </div><div class="devguideorder"><span>3</span>给地图添加右键菜单<br></div><div class="devguidecenter">
    <p>使用addContextMenu方法给地图添加右键菜单。
    </p>
    <pre class="prettyprint codestyle prettyprinted" style=""><span class="pln">map</span><span class="pun">.</span><span class="pln">addContextMenu</span><span class="pun">(</span><span class="pln">menu</span><span class="pun">);</span><span class="pln">                           </span><span class="com">// 给地图添加右键菜单</span></pre>
    </div></div><div class="bluetitle"><div class="services-title-text"></div></div>
    </div>
    </div>
</template>
<script setup lang="ts">
import { useAnchorStore } from '@/stores/app'
const appPageAnchors = useAnchorStore()
onMounted(() => {
    appPageAnchors.setAnchor(document.querySelectorAll('.app-page-anchor'))
})
</script>