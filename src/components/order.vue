<template>
  <div class="order">
    <div
      :class="{
        status0: status == 0,
        status1: status == 1,
        status2: status == 2
      }"
    >
      <h3>{{ startH[orderData.status] }}</h3>
      <p>{{ startP[orderData.status] }}</p>
      <div class="titleBox">
        <div class="hospitalInfo">
          <h4>{{ orderData.service_name }}</h4>
          <p>¥{{ orderData.service_price }}</p>
        </div>
        <span>{{ orderData.service_description }}</span>
      </div>
    </div>
    <div class="container">
      <div class="orderInfo">
        <ul>
          <li>
            <p>申请号：</p>
            <span>{{ orderData.order_no }}</span>
          </li>
          <li>
            <p>状&nbsp&nbsp&nbsp态：</p>
            <span
              :class="{
                span0: orderData.status == 0,
                span1: orderData.status == 1,
                span2: orderData.status == 2
              }"
              >{{ startH[orderData.status] }}</span
            >
          </li>
          <li>
            <p>时&nbsp&nbsp&nbsp间：</p>
            <span>{{ orderData.create_time }}</span>
          </li>
          <li>
            <p>医&nbsp&nbsp&nbsp院：</p>
            <span>{{ orderData.hospital_name }}</span>
          </li>
        </ul>
        <img
          src="@/assets/images/home/ic_list_locate.png"
          alt=""
          @click="comehere"
        />
      </div>
      <div class="orderUser">
        <div class="userTitle">
          <div>
            <p class="userName">{{ orderData.user_info.name }}</p>
            <p class="userTel">{{ orderData.user_info.phone }}</p>
          </div>
          <span v-if="orderData.user_info.status == 3" @click="lookCard(0)"
            >查看信息卡</span
          >
          <span v-else-if="orderData.user_info.status != 3" @click="lookCard(1)"
            >完善信息卡</span
          >
        </div>
        <!-- 资料是否上传 -->
        <!-- 1 -->
        <div
          class="userContent"
          v-if="
            orderData.user_info.status == 1 || orderData.user_info.status == 0
          "
        >
          <div>
            <img
              src="@/assets/images/me/ic_my_authentication_null.png"
              alt=""
            />
            <p>身份认证</p>
            <span>未上传</span>
          </div>

          <div>
            <img src="@/assets/images/me/ic_my_report_null.png" alt="" />
            <p>体检报告</p>
            <span>未上传</span>
          </div>
        </div>
        <!-- 2 -->
        <div class="userContent" v-if="orderData.user_info.status == 2">
          <div>
            <img
              src="@/assets/images/me/ic_my_authentication_upload.png"
              alt=""
            />
            <p>身份认证</p>
            <span>已上传</span>
          </div>

          <div>
            <img src="@/assets/images/me/ic_my_report_null.png" alt="" />
            <p>体检报告</p>
            <span>未上传</span>
          </div>
        </div>
        <!-- 3 -->
        <div class="userContent" v-if="orderData.user_info.status == 3">
          <div>
            <img
              src="@/assets/images/me/ic_my_authentication_upload.png"
              alt=""
            />
            <p>身份认证</p>
            <span>已上传</span>
          </div>

          <div>
            <img src="@/assets/images/me/ic_my_report_upload.png" alt="" />
            <p>体检报告</p>
            <span>{{ orderData.user_info.update_time }}上传</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "order",
  data() {
    return {
      // 申请详情数据
      orderData: {},
      // 解决mpv无法用过滤器问题，
      startH: ["待完善", "申请中", "已完成"],
      startP: [
        "请及时完善您的信息噢",
        "工作人员将在3个工作日内联系您",
        "你的申请已完成"
      ],
      //记录头部的渐变
      status: ""
    };
  },
  created() {
    this.$store.commit('changeFbTitle',{name:"订单详情",tState:'0'})
    this.$store.commit("changeFbFoot", 1);
    const order_id = this.$route.params.orderId;
    this.getOrderDetail(order_id);
    this.status = "";
  },
  methods: {
    // 获取申请详情
    getOrderDetail(order_id) {
      console.log(order_id);
      this.$request.getOrderDetail({ order_id }).then(data => {
        this.orderData = data.data;
        console.log(this.orderData);
        this.status = data.data.status;
        // 处理时间
        this.orderData.create_time = this.orderData.create_time.replace(
          /-/g,
          "."
        );
        this.orderData.create_time = this.orderData.create_time.substring(
          0,
          10
        );
        if (this.orderData.user_info.status == 3) {
          this.orderData.user_info.update_time = this.orderData.user_info.update_time.replace(
            /-/g,
            "."
          );
          this.orderData.user_info.update_time = this.orderData.user_info.update_time.substring(
            0,
            10
          );
        }
      });
    },
    // 到这去
    comehere() {
      wx.openLocation({
        latitude: this.orderData.latitude,
        longitude: this.orderData.longitude,
        scale: 28,
        name: this.orderData.service_name
      });
    },
    //查看信息卡
    lookCard(e) {
      let url = "";
      let name = '';
      let params = {};
      if (e == 0) {
        // 查看信息卡
        url = "/lookCard";
        params.user_info_id = this.orderData.user_info_id;
        name = 'lookCard'
      } else {
        if (this.orderData.user_info.status == 2) {
          url = "/apply3";
          name = 'apply3'
          params.user_info_id = this.orderData.user_info_id;
        } else if (this.orderData.user_info.id_number == null) {
          url = "/apply1";
          name = 'apply1'
          params.user_info_id = this.orderData.user_info_id;
          params.name = this.orderData.user_info.name;
          params.phone = this.orderData.user_info.phone;
        } else {
          url = "/apply2";
          name = 'apply2'
          params.user_info_id = this.orderData.user_info_id;
        }
      }
      console.log(params)
      this.$router.replace({
        path: url,
        name,
        params
      });
    }
  }
};
</script>
<style lang="less">
.order {
  width: 100%;
  height: 100%;
  .status0,
  .status1,
  .status2 {
    width: 750px;
    height: 390px;
    display: flex;
    flex-direction: column;
    align-items: center;
    & > h3 {
      font-size: 48px;
      font-weight: 400;
      color: #ffffff;
      line-height: 66px;
      margin: 60px 0 10px 0;
      font-family: PingFangSC-Regular, PingFang SC;
    }
    & > p {
      height: 34px;
      font-size: 24px;
      font-weight: 300;
      color: #ffffff;
      line-height: 34px;
      margin-bottom: 60px;
    }
    .titleBox {
      width: 630px;
      height: 100px;
      background: #ffffff;
      box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
      border-radius: 16px;
      padding: 30px;
      .hospitalInfo {
        display: flex;
        justify-content: space-between;
        h4 {
          font-size: 36px;
          font-weight: 500;
          color: #252a34;
          line-height: 50px;
        }
        p {
          font-size: 32px;
          font-weight: 500;
          color: #ff4040;
          line-height: 44px;
        }
      }
      span {
        font-size: 24px;
        font-weight: 400;
        color: #bac5d2;
        line-height: 34px;
      }
    }
  }
  .status0 {
    background: linear-gradient(
      180deg,
      #ff6b94 0%,
      #ff6b94 50%,
      rgba(255, 107, 148, 0) 100%
    );
  }
  .status1 {
    background: linear-gradient(
      180deg,
      #17c9c6 0%,
      #17c9c6 50%,
      rgba(23, 201, 198, 0) 100%
    );
  }
  .status2 {
    background: linear-gradient(
      180deg,
      #2a90ff 0%,
      rgba(42, 144, 255, 0.9) 50%,
      rgba(42, 144, 255, 0) 100%
    );
  }
  .container {
    justify-content: start;
    padding: 30px 30px 0 30px;
    background: #f7f9fb;
    height: 100%;
    .orderInfo {
      width: 630px;
      height: 250px;
      background: #ffffff;
      box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
      border-radius: 16px;
      padding: 30px;
      position: relative;
      margin-bottom: 30px;
      ul {
        li {
          font-size: 28px;
          font-weight: 400;
          color: #252a34;
          line-height: 40px;
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          .span0 {
            color: #ff5a88;
          }
          .span1 {
            color: #17c9c6;
          }
          .span02 {
            color: #bac5d2;
          }
          p {
            width: 112px;
            height: 40px;
          }
        }
      }
      img {
        width: 32px;
        height: 32px;
        position: absolute;
        right: 34px;
        bottom: 30px;
      }
    }
    .orderUser {
      width: 690px;
      box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
      margin-bottom: 30px;
      .userTitle {
        height: 88px;
        background: #ffffff;
        border-radius: 16px 16px 0px 0px;
        font-family: PingFangSC-Medium, PingFang SC;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;
        div {
          display: flex;
          .userName {
            font-size: 28px;
            font-weight: 500;
            color: #252a34;
            line-height: 40px;
          }
          .userTel {
            font-size: 28px;
            font-weight: 500;
            color: #bac5d2;
            line-height: 40px;
            margin-left: 16px;
          }
        }
        span {
          font-size: 24px;
          font-weight: 500;
          color: #2a90ff;
          line-height: 34px;
        }
      }
      .userContent {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: #fff;
        height: 278px;
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          img {
            width: 110px;
            height: 110px;
            display: block;
          }
          p {
            font-size: 28px;
            font-weight: 500;
            color: #252a34;
            line-height: 40px;
            margin: 20px 0 12px 0;
          }
          span {
            font-size: 24px;
            font-weight: 500;
            color: #bac5d2;
            line-height: 34px;
          }
        }
      }
    }
  }
}
</style>
