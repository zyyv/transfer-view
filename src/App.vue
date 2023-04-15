<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
    name: 'App',
    components: {
        HelloWorld
    },
    data() {
        return {
            input: '',
            uploadUrl: "/hello",
        }
    },
    methods: {
        handleClick() {
            console.log(this.input)
        },
        testAxios() {
            this.$get('/hello').then(res => {
                console.log(res)
            })
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        }
    }
}
</script>

<template>
    <div id="app" class="indexBack">
        <div class="left_top">
            
        </div>
        <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
<!--        :file-list="fileList"-->
        <button @click="testAxios"></button>
    </div>
</template>

<style>
body {
    /* 加载背景图 */
    background-image: url("./assets/index.png");
    /* 背景图垂直、水平均居中 */
    background-position: center center;
    /* 背景图不平铺 */
    background-repeat: no-repeat;
    /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
    background-attachment: fixed;
    /* 让背景图基于容器大小伸缩 */
    background-size: 100%, 100%, cover;
    /* 设置背景颜色，背景图加载过程中会显示背景色 */
    background-color: #464646;
}

.left_top{
    margin-top: 20%;
    margin-left: 20%;
}
.indexBack {
    width: 100%;
    height: 100%;
}

/*@media (min-width: 1024px) {*/
/*    header {*/
/*        display: flex;*/
/*        place-items: center;*/
/*        padding-right: calc(var(--section-gap) / 2);*/
/*    }*/

/*    .logo {*/
/*        margin: 0 2rem 0 0;*/
/*    }*/

/*    header .wrapper {*/
/*        display: flex;*/
/*        place-items: flex-start;*/
/*        flex-wrap: wrap;*/
/*    }*/
/*}*/
</style>
