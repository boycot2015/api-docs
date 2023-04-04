<template>
    <div class="usage">
    使用须知 <br>
    更新时间：2022年08月07日<br>
    服务版本说明书<br>
    JavaScript API GL 是基于WebGL全新开发的地图API接口，为了方便开发者迁移升级，大部份接口向下兼容。JavaScript API GL的使用方式请参考开发指南，详细的接口类说明请参考类参考文档，快速了解JavaScript API GL可支持的功能请参考示例中心提供的示例demo。<br>
    异步加载<br>
    JavaScript API GL v1.0支持异步加载，您可以在引用脚本的时候添加callback参数，当脚本加载完成后callback函数会被立刻调用。请参考下面的使用示例：<br>

    兼容性<br>
    JavaScript API GL v1.0 基于WebGL开发，对于用户的浏览器环境有兼容性要求。需要完整支持WebGL的现代浏览器来支持渲染。对于WebGL支持欠佳的浏览器会降级为Canvas绘制，若仍然存在兼容性问题，则会降级到瓦片图渲染，确保不同浏览器环境的用户都可以完成地图的基本渲染。<br>

    获取技术支持途径<br>
    如果您在使用百度地图API中遇到问题，请尝试通过以下途径解决：<br>

    确认您使用了正确的地图API地址和API接口。<br>

    查看常见问题，自助排查。<br>

    通过反馈平台提工单进行反馈。
    </div>
</template>