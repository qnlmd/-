<template>
  <div class="packageDetails">
    <div class="transit">
      <!-- 服务图片 -->
      <div class="packageImg">
        <img :src="detailData.service_img" alt="" />
      </div>
    </div>
    <div class="container">
      <!-- 价格 -->
      <div class="price">
        <i>¥</i>
        <span>{{ detailData.service_price }}</span>
      </div>
      <!-- 服务名称 -->
      <div class="packageName">
        <h1>{{ detailData.service_name }}</h1>
      </div>
      <!-- 手风琴 -->
      <van-collapse v-model="activeName" class="accordion">
        <!-- 1:服务 -->
        <van-collapse-item name="1" class="accordionBox active">
          <!-- 遮照层 -->
          <div class="mask" v-show="isShow">
            <div @click="isShow = !isShow">
              展开<img
                src="@/assets/images/packageDetails/ic_unfold.png"
                alt=""
              />
            </div>
          </div>
          <template #title class="accordionTitle">
            <div>
              <h3>服务</h3>
              <span
                v-for="(item, index) in detailData.service_keywords"
                :key="index"
                :style="{
                  backgroundColor: 'rgba(' + item.color + ',0.1)',
                  color: 'rgb(' + item.color + ')'
                }"
                >{{ item.name }}</span
              >
            </div>
          </template>
          <!-- 内容 -->
          <ul class="aContent">
            <li>
              <!-- <i></i> -->
              <p v-html="detailData.service_content"></p>
            </li>
          </ul>
        </van-collapse-item>
        <!-- 2：保险 -->
        <van-collapse-item name="2" class="accordionBox">
          <template #title class="accordionTitle">
            <div>
              <h3>保险</h3>
              <span
                v-for="(item, index) in detailData.insurance_tag"
                :key="index"
                :style="{
                  backgroundColor: 'rgba(' + item.color + ',0.1)',
                  color: 'rgb(' + item.color + ')'
                }"
                >{{ item.name }}</span
              >
            </div>
          </template>

          <ul class="aContent">
            <li>
              <p v-html="detailData.insurance_content"></p>
            </li>
          </ul>
        </van-collapse-item>
        <!-- 3分期 -->
        <van-collapse-item name="3" class="accordionBox">
          <template #title class="accordionTitle">
            <div>
              <h3>分期</h3>
              <span
                v-for="(item, index) in detailData.pay_tag"
                :key="index"
                :style="{
                  backgroundColor: 'rgba(' + item.color + ',0.1)',
                  color: 'rgb(' + item.color + ')'
                }"
                >{{ item.name }}</span
              >
            </div>
          </template>
          <ul class="aContent">
            <li>
              <p v-html="detailData.pay_content"></p>
            </li>
          </ul>
        </van-collapse-item>
      </van-collapse>
      <!-- 立即申请 -->
      <div class="purchaseBox" :style="{ paddingBottom: iphoneHeight }">
        <a class="callMe" @click="callMe" :href="meNumber">
          <img src="@/assets/images/packageDetails/ic_call.png" alt="" />
          <p>致电</p>
        </a>
        <a href="https://yzf.qq.com/xv/web/static/chat/index.html?sign=37ef9b97867356ce24179cec1bb4b830058e47e33e47b6705fcdf047e43611cc6090de56ab3c08e734a5588ca5cadc415387068e" class="advisory">
          <img src="@/assets/images/packageDetails/ic_advisory.png" alt="" />
          <p>咨询</p>
          
        </a>
          
        <div class="purchase" @click="immediately">立即抢购</div>
      </div>
      <!-- 弹窗 -->
      <van-dialog
        title="选择信息卡"
        v-model="popupShow"
        showConfirmButton
        confirmButtonColor="#ffffff"
        closeOnClickOverlay
        :class="{ comfirmButton: userInfo.user_info_id != '' }"
        @confirm="comfirmPop"
      >
        <div class="popupBox">
          <ul>
            <li
              v-for="(item, index) in infoList"
              :key="index"
              @click="
                userInfo.user_info_id = item.user_info_id;
                userStatus = item.status;
                userName = item.name;
                userPhone = item.phone;
              "
              :class="{ pActive: userInfo.user_info_id == item.user_info_id }"
            >
              <div class="p-title">
                <i></i>
                <p>{{ item.name }}</p>
              </div>
              <div class="p-phone">{{ item.phone }}</div>
            </li>
            <!-- 新建用户 -->
            <li class="addUser" @click="addUser">
              <img src="@/assets/images/packageDetails/ic_my_add.png" alt="" />
              <p>新建信息卡</p>
            </li>
          </ul>
        </div>
        <div class="p-close" @click="closePop">
          <img src="@/assets/images/packageDetails/ic_close.png" alt="" />
        </div>
      </van-dialog>
      <!-- 结束 -->
    </div>
  </div>
</template>
<script>
import { Collapse, CollapseItem } from "vant";
import { Dialog } from "vant";

export default {
  name: "packageDetails",
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      //特色详情数据
      detailData: {},
      // 手风琴默认代开
      activeName: ["1"],
      // 遮罩层显示隐藏
      isShow: true,
      //icon显示隐藏
      isIcon: 1,
      isIcon2: 1,
      //弹窗的显示隐藏
      popupShow: false,
      //获取资料列表数组
      infoList: [],
      //记录弹窗选择的用户信息
      userStatus: "",
      userInfo: {
        user_info_id: "",
        service_type_id: "",
        hospital_id: ""
      },
      // 记录appl0信息
      userName: "",
      userPhone: "",
      // 电话号码
      meNumber: "",
      // iphonex底部
      iphoneHeight:0
    };
  },
  created(options) {
    this.$store.commit("changeFbTitle", { name: "套餐详情", tState: "0" });
    this.$store.commit("changeFbFoot", 1);
    // iphonex 适配
    if (
      /iphone/gi.test(navigator.userAgent) &&
      screen.height >= 812 &&
      screen.width >= 375
    ) {
      this.iphoneHeight = 1.062 + "rem";
    }
    this.userInfo.hospital_id = this.$route.params.hospital_id;
    this.getServiceDetail(this.$route.params.service_type_id);
  },
  methods: {
    //获取特色详情
    getServiceDetail(service_type_id) {
      this.userInfo.service_type_id = service_type_id;
      this.$request.getServiceDetail({ service_type_id }).then(data => {
        this.detailData = data.data;
      });
    },
    //提交申请
    addOrder() {
      this.$request.addOrder(this.userInfo).then(data => {
        if (data.code == 1) {
          //去申请提交成功页面
          this.$router.replace({
            path: "/infoCard",
            name: "infoCard",
            params: {
              userStatus: this.userStatus,
              user_info_id: this.user_info_id,
              userName: this.userName,
              userPhone: this.userPhone
            }
          });
        }
      });
    },
    // 立即抢购
    immediately() {
      this.$request.getInfoList().then(data => {
        this.infoList = data.data;
        if (this.infoList.length == 0) {
          this.$toast.fail({
            message: "亲，请先创建用户",
            forbidClick: true,
            onClose: () => {
              let url = "/apply0";
              this.$router.replace({
                path: url,
                name: "apply0",
                params: { userInfo: this.userInfo }
              });
            }
          });
        } else {
          this.popupShow = true;
        }
      });
    },
    //弹窗确认
    comfirmPop() {
      if (this.userInfo.user_info_id == "") {
        wx.showToast({
          title: "亲，请先选择用户",
          icon: "none",
          duration: 2000
        });
        this.popupShow = false;
      } else {
        this.popupShow = false;
        this.addOrder();
      }
    },
    //关闭弹窗
    closePop() {
      this.popupShow = false;
    },
    //新增用户
    addUser() {
      console.log(this.userInfo);
      let url = "/apply0";
      this.$router.replace({
        path: url,
        name: "apply0",
        params: this.userInfo
      });
    },
    //手风琴

    //电话
    callMe() {
      this.meNumber = "tel://" + this.detailData.tel;
    }
  }
};
</script>
<style lang="less">
.packageDetails {
  width: 100%;
  background: #f7f9fb;
  margin-top: 86px;
  display: flex;
  flex-direction: column;
  .transit {
    position: relative;
    width: 750px;
    height: 200px;
    background: linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%);
    margin-bottom: 228px;
    .packageImg {
      width: 690px;
      height: 388px;
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.05);
      border-radius: 16px;
      padding-top: 20px;
      margin-left: 30px;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
  .container {
    padding: 0 30px 300px 30px;
    background: #f7f9fb;
    justify-content: flex-start;
      height: 1800px;
    .price {
      display: flex;
      justify-content: start;
      align-items: center;
      width: 100%;
      height: 80px;
      margin-bottom: 10px;
      i {
        color: #ff4040;
        margin-right: 12px;
        font-size: 36px;
      }
      span {
        font-size: 56px;
        font-weight: 400;
        color: #ff4040;
        line-height: 50px;
      }
    }
    .packageName {
      width: 100%;
      margin-bottom: 30px;
      h1 {
        font-weight: 500;
        color: #252a34;
        line-height: 50px;
        font-size: 36px;
      }
    }
    .accordion {
      width: 690px;
      height: auto;
      .active {
        position: relative;
        display: block;
        .mask {
          width: 690px;
          height: 200px;
          background-color: rgb(red, green, blue);
          background: linear-gradient(
            360deg,
            #ffffff 0%,
            rgba(255, 255, 255, 0.8) 51%,
            rgba(255, 255, 255, 0) 100%
          );
          border-radius: 0px 0px 16px 16px;
          position: absolute;
          bottom: 0;
          left: 0;
          div {
            font-size: 24px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #bac5d2;
            line-height: 34px;
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 40px;
            right: 30px;
            img {
              width: 20px;
              height: 14px;
              display: block;
              margin-left: 10px;
            }
          }
        }
        .van-cell__right-icon {
          display: none;
        }
      }

      .accordionTitle {
        display: flex;
        align-items: center;
        border: 0;
        h3 {
          font-size: 28px;
          font-weight: 500;
          color: #bac5d2;
          line-height: 40px;
          margin-right: 30px;
        }
        span {
          font-size: 24px;
          height: 42px;
          border-radius: 4px;
          padding: 4px 8px;
          margin-right: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          &:last-child {
            font-size: 24px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            line-height: 34px;
            background-color: #ffffff;
          }
        }
        p {
          height: 34px;
          font-size: 24px;
          color: #2a90ff;
          line-height: 34px;
        }
        i {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          img {
            width: 20px;
            height: 13px;
            display: block;
          }
        }
      }

      .aContent {
        li {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          i {
            width: 12px;
            height: 12px;
            background: rgba(42, 144, 255, 0.1);
            border: 2px solid #2a90ff;
            display: block;
            border-radius: 50%;
            margin-right: 20px;
          }
          p {
            font-size: 28px;
            font-weight: 400;
            color: #464e5e;
            line-height: 40px;
          }
        }
      }
      // van里面默认样式修改
      .van-cell {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 102px;
        background: #ffffff;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
      }
      .van-cell--borderless {
        border-radius: 16px;
      }
      .van-collapse-item {
        margin-bottom: 30px;
      }
      .cell-index--van-cell__right-icon {
        display: none;
      }
      .van-collapse-item__content {
        padding: 0 30px;
        height: 298px;
        overflow-y: scroll;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      }
      .van-cell__title {
        div {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          h3 {
            font-size: 28px;
            font-weight: 500;
            color: #bac5d2;
            line-height: 40px;
          }
        }
      }
    }
    .purchaseBox {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 750px;
      height: 108px;
      background: #ffffff;
      display: flex;
      align-items: center;
      .callMe {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 40px;
        margin-right: 60px;
        img {
          width: 44px;
          height: 40px;
        }
        p {
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #252a34;
          line-height: 28px;
        }
      }
      .advisory {
        padding: 0;
        margin: 0;
        border: 0;
        background-color: #fff;
        margin-right: 60px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: visible;
        &::after {
          border: 0;
        }
        img {
          width: 44px;
          height: 40px;
        }
        p {
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #252a34;
          line-height: 28px;
        }
      }
      .purchase {
        width: 468px;
        height: 80px;
        background: #ff5a88;
        border-radius: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ff5a88;
        color: #ffffff;
      }
    }
    // 弹窗
    .popupBox {
      height: 100%;
      padding: 20px 30px;
      width: 100%;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          width: 240px;
          height: 90px;
          background: #f7f9fb;
          border-radius: 16px;
          padding: 20px 30px;
          margin-bottom: 40px;
          margin-right: 30px;
          &:nth-of-type(even) {
            margin-right: 0;
          }
          .p-title {
            display: flex;
            align-items: center;
            i {
              width: 26px;
              height: 26px;
              background: url("../assets/images/packageDetails/ic_userchoose.png")
                no-repeat;
              margin-right: 10px;
            }
            p {
              font-size: 28px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #464e5e;
              line-height: 40px;
            }
          }
          .p-phone {
            margin-top: 10px;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #252a34;
            line-height: 40px;
          }
        }
        .pActive {
          background: rgba(42, 144, 255, 0.1);
          .p-title {
            i {
              width: 26px;
              height: 26px;
              background: url("../assets/images/packageDetails/ic_userchoose_select.png")
                no-repeat;
              margin-right: 10px;
            }
            p {
              color: #2a90ff;
            }
          }
          .p-phone {
            color: #2a90ff;
          }
        }
        .addUser {
          display: flex;
          color: #252a34;
          align-items: center;
          font-size: 28px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          line-height: 40px;
          img {
            margin-right: 10px;
            width: 26px;
            height: 26px;
            display: block;
          }
        }
      }
    }
    .p-close {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 32px;
      right: 35px;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    // vant 样式
    .van-dialog {
      width: 690px;
    }
    .van-hairline--top {
      &:after {
        border-top-width: 0;
      }
    }
    .van-hairline--bottom {
      &:after {
        border-bottom-width: 0;
      }
    }
    // 取消内比框
    .van-cell {
      &:after {
        border-bottom: 0;
      }
    }

    .van-dialog__footer {
      padding: 0 30px;
    }
    .van-dialog__confirm {
      width: 630px !important;
      height: 72px;
      background: #2a90ff;
      border-radius: 44px;
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      line-height: 40px;
      margin-bottom: 30px;
    }
    .comfirmButton .dialog-index--van-dialog__confirm {
      background: #2a90ff;
    }
  }

  // vant弹窗样式
  .van-dialog__header {
    font-size: 28px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #464e5e;
    line-height: 40px;
    margin-bottom: 50px;
  }
}
</style>
