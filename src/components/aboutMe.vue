<template>
  <div class="aboutMe">
    <div class="container">
      <div v-html="aboutData.article_content"></div>
      <div class="ab-footer">
        <p>深圳市名医科技有限公司版权所有</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      aboutData: {}
    };
  },
  created(options) {
    this.$store.commit("changeFbTitle", { name: "关于我们", tState: "0" });
    this.$request.getArticleDetail({ category_id: 2 }).then(data => {
      this.aboutData = data.data;
      var html = data.data.article_content.replace(
        /<img/g,
        '<img style="width:100%", mode:"widthFix",'
      );
      this.aboutData.article_content = html;
    });
  }
};
</script>
<style lang="less">
.aboutMe {
  margin-top: 86px;
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0;
    position: relative;
  }
  .ab-footer {
    position: absolute;
    bottom: 220px;
    width: 390px;
    height: 36px;
    p {
      font-size: 26px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #bac5d2;
      line-height: 36px;
    }
  }
}
</style>
