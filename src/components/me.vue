<template>
  <div class="loginBox">
    <div class="transit">
      <!-- 用户 -->
      <div class="user">
        <img :src="newUserData.avatar_url" alt="" class="userLogo" />
        <div class="userBox">
          <p class="userName">{{ newUserData.nickname }}</p>
          <p class="Upload" v-text="UpLoadText"></p>
        </div>
      </div>
    </div>
    <div class="container">
      <!-- 工具栏 -->
      <div class="userTool">
        <router-link to="/focusHospital" replace>
          <div class="follow">
            <img src="@/assets/images/me/ic_my_hospital.png" alt="" />
            <p>关注医院</p>
          </div>
        </router-link>
        <router-link to="/orderList" replace>
          <div class="order">
            <img src="@/assets/images/me/ic_my_order.png" alt="" />
            <p>我的预购</p>
          </div>
        </router-link>
      </div>
      <!-- 信息卡 -->
      <div class="information">
        <div class="i-itle">
          <div class="title-left">
            <span></span>
            <h1>信息卡</h1>
          </div>
          <div class="title-right">
            <router-link to="/apply1" class="addRight" replace>
              <img src="@/assets/images/me/ic_my_add.png" alt="" />
              <p>添加成员</p>
            </router-link>
          </div>
        </div>
        <!-- 卡片 -->
        <div class="card">
          <ul>
            <!-- 没有用户 -->
            <li class="myUser" @click="addUser" v-if="newInfoData.length == 0">
              <img src="@/assets/images/me/ic_users_default_add.png" alt="" />
              <p>添加信息</p>
            </li>
            <!-- 添加了用户 -->
            <li v-for="(item, index) in newInfoData" :key="index">
              <div class="cardTitle">
                <div class="cInfo">
                  <p class="cName">{{ item.name }}</p>
                  <p class="cPhone">{{ item.phone }}</p>
                </div>
                <div
                  class="perfection"
                  :style="{
                    color: item.status == 1 ? '#FF5A88' : '#2A90FF',
                    backgroundColor: item.status == 1 ? '#fcf0f3' : '#ebf3fe'
                  }"
                >
                  <p>信息完善度</p>
                  <span class="pNum" v-if="item.status == 0">10%</span>
                  <span class="pNum" v-if="item.status == 1">30%</span>
                  <span class="pNum" v-else-if="item.status == 2">60%</span>
                  <span class="pNum" v-else-if="item.status == 3">100%</span>
                </div>
              </div>
              <div class="cardLine"></div>
              <div class="cardContent">
                <!-- 展示的省份证和报告 -->
                <div class="userId" v-if="item.is_auth == 0">
                  <img
                    src="@/assets/images/me/ic_my_authentication_null.png"
                    alt=""
                  />
                  <p>身份认证</p>
                  <span>未上传</span>
                </div>
                <div class="userId" v-else-if="item.is_auth == 1">
                  <img
                    src="@/assets/images/me/ic_my_authentication_upload.png"
                    alt=""
                  />
                  <p>身份认证</p>
                  <span>已上传</span>
                </div>
                <div class="report" v-if="item.is_report == 0">
                  <img src="@/assets/images/me/ic_my_report_null.png" alt="" />
                  <p>体检报告</p>
                  <span>未上传</span>
                </div>
                <div class="report" v-else-if="item.is_report == 1">
                  <img
                    src="@/assets/images/me/ic_my_report_upload.png"
                    alt=""
                  />
                  <p>体检报告</p>
                  <span>已上传</span>
                </div>
              </div>
              <div class="cardFoot">
                <div
                  class="isUpload"
                  v-if="item.status == 3"
                  style="color: 2a90ff"
                  @click="perfect(item.status, item.user_info_id)"
                >
                  在线预览
                </div>
                <div
                  class="isUpload"
                  v-else-if="item.status != 3"
                  style="color: #ff5a88"
                  @click="
                    perfect(
                      item.status,
                      item.user_info_id,
                      item.name,
                      item.phone
                    )
                  "
                >
                  继续完善
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 结束 -->
    </div>
  </div>
</template>
<script>
export default {
  name: "me",
  data() {
    return {
      //用户数据
      userData: {},
      // 处理微信小程序三层的话会报错问题
      newUserData: {
        avatar_url: ""
      },
      newInfoData: {
        user_info: []
      },
      // Upload的内容
      UpLoadText: ""
    };
  },
  created() {
    this.$store.commit("changeFbTitle", { name: "我的", tState: "1" });
    this.$store.commit("changeFbFoot", 0);
    let token = window.sessionStorage.getItem("token");
    this.$request.userLogin({ token }).then(data => {
      this.userData = data.data;
      // 处理三层问题，三层点出来的微信小程序会报错
      this.newUserData = data.data.user;
      this.newInfoData = data.data.user_info;
      if (this.newInfoData.length == 0) {
        this.UpLoadText = "尚未建立信息卡";
      } else if (this.newInfoData.status == 3) {
        this.UpLoadText = "已完善";
      } else {
        this.UpLoadText = "未完善";
      }
    });
  },
  methods: {
    // 完善资料or查看跳转
    perfect(status, user_info_id, name, phone) {
      let path = "";
      let vName = "";
      let params = {};
      switch (status) {
        case 0:
          path = "/apply1";
          vName = "apply1";
          params = {
            user_info_id,
            name,
            phone
          };
          break;
        case 1:
          (path = "/apply2"),
            (vName = "apply2"),
            (params = {
              user_info_id,
              userStatus: 2
            });
          break;
        case 2:
          path = "/apply3";
          vName = "apply3";
          params = {
            user_info_id
          };
          break;
        case 3:
          path = "/lookCard";
          vName = "lookCard";
          params = {
            user_info_id
          };
          break;
      }
      this.$router.replace({
        path,
        params,
        name: vName
      });
    },
    addUser() {
      this.$router.replace({
        path:'apply0',
        name:'apply0'
      })
    }
  }
};
</script>
<style lang="less">
.loginBox {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 106px;
  .transit {
    position: relative;
    left: 0;
    width: 750px;
    height: 200px;
    background: linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%);

    .user {
      padding: 0 30px;
      width: 690px;
      height: 176px;
      display: flex;
      align-items: center;
      background-color: #fff;
      .userLogo {
        width: 116px;
        height: 116px;
        border-radius: 50%;
        margin-left: 30px;
      }
      .userBox {
        margin-left: 30px;
        margin-right: 202px;
        .userName {
          font-size: 32px;
          font-weight: 500;
          color: #252a34;
          line-height: 44px;
        }
        .Upload {
          font-size: 24px;
          font-weight: 500;
          color: #bac5d2;
          line-height: 34px;
        }
      }
    }
  }
  .container {
    padding: 0 30px 320px 30px;
    background: #f7f9fb;

    .userTool {
      width: 690px;
      height: 210px;
      background: #ffffff;
      box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
      border-radius: 16px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 40px 0;
      margin-bottom: 60px;
      img {
        width: 60px;
        height: 60px;
        margin: 0 auto;
        display: block;
      }
      p {
        margin-top: 30px;
        font-size: 28px;
        font-weight: 500;
        color: #252a34;
        line-height: 40px;
      }
    }
    .information {
      .i-itle {
        width: 690px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 26px;
        .title-left {
          display: flex;
          align-items: center;
          span {
            width: 8px;
            height: 36px;
            background-color: #08d9d6;
            border-radius: 4px;
            opacity: 0.3;
            display: inline-block;
            margin-right: 10px;
          }
          h1 {
            width: 160px;
            height: 56px;
            font-size: 40px;
            font-weight: 500;
            color: #2a90ff;
            line-height: 56px;
            display: inline-block;
          }
        }
        .title-right {
          display: flex;
          align-items: center;
          .addRight {
            display: flex;
            align-items: center;
            img {
              width: 26px;
              height: 26px;
              display: block;
            }
            p {
              font-size: 24px;
              font-weight: 500;
              color: #2a90ff;
              line-height: 34px;
              margin-left: 10px;
            }
          }
        }
      }
      .card {
        box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
        border-radius: 16px;
        width: 100%;
        li {
          background: #ffffff;
          margin-bottom: 30px;
          height: 453px;
          border-radius: 16px;
          .cardTitle {
            height: 88px;
            background: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 30px;
            .cInfo {
              display: flex;
              align-items: center;
              .cName {
                font-size: 28px;
                font-weight: 500;
                color: #252a34;
                line-height: 40px;
              }
              .cPhone {
                font-size: 28px;
                font-weight: 500;
                color: #bac5d2;
                line-height: 40px;
                margin-left: 16px;
              }
            }
            .isUpload {
              font-size: 24px;
              font-weight: 500;
              color: #2a90ff;
              line-height: 34px;
            }
            .perfection {
              height: 56px;
              background: #e9f3ff;
              border-radius: 28px 0px 0px 28px;
              display: flex;
              align-items: center;
              padding: 0 10px 0 20px;
              p {
                font-size: 20px;
                font-weight: 500;
                line-height: 28px;
                margin-right: 10px;
              }
              .pNum {
                font-size: 32px;
                font-weight: 500;
                line-height: 44px;
              }
            }
          }
          .cardLine {
            width: 628px;
            height: 2px;
            background: #f7f9fb;
            margin-left: 32px;
          }
          .cardContent {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 276px;
            .userId {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .report {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
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
          .cardFoot {
            height: 88px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #2a90ff;
          }
        }
        .myUser {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 84px;
          height: 236px;
          margin-bottom: 100px;
          img {
            width: 88px;
            height: 88px;
          }
          p {
            font-size: 32px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #2a90ff;
            line-height: 44px;
            margin-top: 20px;
          }
        }
      }
    }
  }
}
</style>
