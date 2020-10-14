<template>
  <div class="infoCard">
    <div class="container">
      <div class="orderBox">
        <img src="@/assets/images/infoCard/ic_apply_ok.png" alt="" />
        <h2>申请成功</h2>
        <p>客服小蜜将在24小时内联系您噢</p>
        <p>请保持电话畅通</p>
        <span @click="next" v-if="userStatus != 3">继续填写</span>
        <span class="lookOrder" @click="lookOrder">查看申请详情</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "infoCard",
  data() {
    return {
      user_info_id: "",
      userStatus: "",
      userPhone: "",
      userName: ""
    };
  },
  created() {
    this.$store.commit('changeFbTitle',{name:"",tState:'0'})
    this.$store.commit("changeFbFoot", 0);
    this.user_info_id = this.$route.params.user_info_id;
    this.userStatus = this.$route.params.userStatus;
    this.userPhone = this.$route.params.userPhone;
    this.userName = this.$route.params.userName;
  },
  methods: {
    // 查看申请
    lookOrder() {
      this.$router.replace({
        path: "/orderList",
        name: "orderList"
      });
    },
    // 继续填写
    next() {
      let url = "";
      let name = '';
      let params = {};
      if (this.userStatus == 2) {
        // appl2进来的
        url = '/apply3';
        name='apply3';
        params =  {
          user_info_id:this.user_info_id
        }
      } else if (this.userStatus == 0) {
        // appl0
         url = '/apply1';
         name  =  'apply1';
         params  = {
           user_info_id :this.user_info_id,
           phone:this.phone,
           name:this.userName
         }
      } else {
        url =  '/apply2';
        name = 'apply2';
        params  = {
          user_info_id:this.user_info_id
        }
      }
      this.$router.replace({
        path:url,
        name,
        params
      })
    },
  }
};
</script>
<style lang="less">
.infoCard{
  margin-top: 86px;
  .container {
  div {
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
