<template>
    <div class="error-page">
        <div class="icon"><el-icon><Warning /></el-icon></div>
        <div class="text">404 | Page Not Found </div>
    </div>
</template>
<style lang="scss" scoped>
.error-page {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    .icon {
        .el-icon {
            font-size: 60px;
        }
    }
    .text {
        color: #333;
    }
}
</style>