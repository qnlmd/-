<template>
  <div class="next">
    <div class="container">
      <div class="orderBox">
        <img src="@/assets/images/infoCard/ic_apply_ok.png" alt="" />
        <h2>提交成功</h2>
        <p>继续完善需相关体检报告</p>
        <p>如资料不全，请咨询客服</p>
        <span @click="next">继续完善</span>
        <span class="lookOrder" @click="backIndex">返回首页</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user_info_id: ""
    };
  },
  created() {
    this.$store.commit("changeFbTitle", { name: "提交成功", tState: "0" });
    this.$store.commit("changeFbFoot", 0);
    this.user_info_id = this.$route.params.user_info_id;
  },
  methods: {
    // 继续填写
    next() {
      this.$router.replace({
        path: "/apply3",
        name: "apply3",
        params: {
          user_info_id: this.user_info_id
        }
      });
    },
    // 返回首页
    backIndex() {
      this.$router.replace({
        path: "/"
      });
    }
  }
};
</script>
<style lang="less">
.next {
  height: 100%;
   margin-top: 86px;
  .container {
     height: 100%;
    div {
       padding-top: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        display: block;
        width: 108px;
        height: 108px;
      }
      h2 {
        font-size: 36px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #252a34;
        line-height: 50px;
        margin-top: 60px;
        margin-bottom: 20px;
      }
      p {
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #a1a7ab;
        line-height: 40px;
        margin-bottom: 15px;
      }
      span {
        width: 400px;
        height: 80px;
        background: #2a90ff;
        border-radius: 44px;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 358px;
      }
      .lookOrder {
        margin-top: 40px;
        background: #ffffff;
        color: #2a90ff;
        border: 2px solid #2a90ff;
      }
    }
  }
}
</style>
