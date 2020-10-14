<template>
  <div class="article">
      <div class="container">
    <!-- 标题 -->
    <h1 class="title">
      {{ aeticleData.article_title }}
    </h1>
    <div class="label">
      <span
        class="success"
        v-for="(item, index) in aeticleData.article_keywords"
        :key="index"
        :style="{
            backgroundColor: 'rgba(' + item.color + ',0.1)',
            color: 'rgb(' + item.color + ')',
          }"
        >{{ item.name }}</span
      >
    </div>
    <!-- <img :src="aeticleData.article_img" alt=""  mode='widthFix' class="contentImg"/> -->
    <p class="content"  v-html="aeticleData.article_content" >
    </p>
  </div>
  </div>
</template>
<script>
export default {
  name:'article',
  data() {
    return {
      //判断哪里来数据
      whereData: {},
      // 文章数据
      aeticleData: {},
    };
  },
  created(options) {
    this.$store.commit('changeFbTitle',{name:"好孕中心",tState:'0'})
    this.$store.commit("changeFbFoot", 0);
    this.whereData = {};
    // 名医页面
    var article_id = this.$route.params.article_id;
    // 助孕中心页面
    var category_id = this.$route.query.category_id;
    console.log(category_id )
    if (article_id) {
      this.whereData.article_id = article_id;
    } else if (category_id) {
      this.whereData.category_id = category_id;
    }

    this.$request.getArticleDetail(
     {article_id:this.whereData}
    ).then((data) => {
      this.aeticleData = data.data;
      let html = ''
      // 处理返回来内容img图片
        html = data.data.article_content.replace(/<img/g, '<img style="width:100%", mode:"widthFix",') 
       html = html.replace(
          /<p/g,
          '<p style="font-family: PingFangSC-Regular, PingFang SC"',
        );
      this.aeticleData.article_content = html
    });
  },
};
</script>
<style lang="less">
.article{
  padding-bottom: 100px;
  .container {
  padding: 34px 30px;
  display: block;
  .title {
    font-size: 36px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #252a34;
    line-height: 50px;
  }
  .label {
    margin: 30px 0;
    width: 100%;
    span {
      height: 42px;
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      line-height: 34px;
      margin-right: 30px;
      padding: 4px 8px;
    }
    .relation {
      background-color: #ebf3fe;
      color: #2a90ff;
    }
  }
  .contentImg {
    width: 100%;
    display: block;
    margin-bottom: 30px;
  }
  .content {
    font-size: 28px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #464e5e;
    line-height: 56px;
    display: block;
    width: 100%;
    overflow: hidden;
  }
}
}

</style>


