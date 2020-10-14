<template>
  <div class="lookCard">
    <div class="container">
      <!-- 个人信息 -->
      <div class="userBox">
        <h1>个人信息</h1>
        <div class="userInfo">
          <ul>
            <li>
              <p>姓名</p>
              <span>{{ infoData.name }}</span>
            </li>
            <li>
              <p>手机号码</p>
              <span>{{ infoData.phone }}</span>
            </li>
            <li>
              <p>身份证号码</p>
              <span>{{ infoData.id_number }}</span>
            </li>
            <li>
              <p>家庭住址</p>
              <span>{{ infoData.address }}</span>
            </li>
            <li>
              <p>紧急联系人</p>
              <span>{{ infoData.emergency_contact }}</span>
            </li>
            <li>
              <p>联系电话</p>
              <span>{{ infoData.emergency_contact_phone }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 实名认证 -->
      <div class="realBox">
        <h1>实名信息</h1>
        <div class="realInfo">
          <ul>
            <li @click="lookId('zm')">
              <div class="r-left">
                <h2>身份证正面</h2>
                <p>预览</p>
              </div>
              <div class="r-right">
                <img :src="infoData.idcar_front" alt="" />
              </div>
            </li>
            <li @click="lookId('fm')">
              <div class="r-left">
                <h2>身份证背面</h2>
                <p>预览</p>
              </div>
              <div class="r-right">
                <img :src="infoData.idcar_back" alt="" />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 体检报告 -->
      <div class="reportBox">
        <div class="r-title">
          <h1>体检报告</h1>
          <p class="upData">{{ infoData.update_time }}上传</p>
        </div>
        <div class="reportInfo">
          <ul>
            <li
              v-for="(value, key, index) in infoData.medical_report"
              :key="index"
              @click="lookReport(value)"
            >
              <img :src="value" alt="" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取的详情数据
      infoData: {},
      // 预览报告对象转数组
      reportArr: []
    };
  },
  created() {
    this.$store.commit("changeFbTitle", { name: "查看信息卡", tState: "0" });
    this.$store.commit("changeFbFoot", 0);
    let user_info_id = this.$route.params.user_info_id;
    this.getInfoDetail(user_info_id);
  },
  methods: {
    //获取用户信息详情
    getInfoDetail(user_info_id) {
      this.$request
        .getInfoDetail({
          user_info_id
        })
        .then(data => {
          this.infoData = data.data;
          this.reportArr = Object.values(this.infoData.medical_report);
        });
    },
    //预览身份证
    lookId(e) {
      let urls = [];
      if (e == "zm") {
        urls.push(this.infoData.idcar_front);
      } else if (e == "fm") {
        urls.push(this.infoData.idcar_back);
      }
      wx.previewImage({
        urls
      });
    },
    //预览体检报告
    lookReport(value) {
      wx.previewImage({
        current: value,
        urls: this.reportArr
      });
    }
  }
};
</script>
<style lang="less">
.lookCard {
  padding-bottom: 100px;
  margin-top: 86px;
  .container {
    background: #f7f9fb;
    padding: 60px 30px;
    .userBox {
      h1 {
        font-size: 32px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #252a34;
        line-height: 44px;
        margin-bottom: 30px;
      }
      .userInfo {
        padding: 20px 30px;
        width: 630px;
        background-color: #ffffff;
        box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
        border-radius: 16px;
        ul {
          li {
            display: flex;
            align-items: center;
            font-size: 28px;
            line-height: 40px;
            color: #464e5e;
            height: 100px;
            p {
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              width: 220px;
            }
            span {
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
        }
      }
    }
    .realBox {
      margin-top: 60px;
      h1 {
        font-size: 32px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #252a34;
        line-height: 44px;
        margin-bottom: 30px;
      }
      .realInfo {
        ul {
          li {
            width: 600px;
            height: 188px;
            background: #ffffff;
            box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
            border-radius: 16px;
            padding: 40px 60px 30px 30px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            .r-left {
              h2 {
                font-size: 32px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #464e5e;
                line-height: 44px;
                margin-bottom: 10px;
              }
              p {
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #bac5d2;
                line-height: 40px;
              }
            }
            img {
              width: 268px;
              height: 188px;
              background: rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              display: block;
            }
          }
        }
      }
    }
    .reportBox {
      width: 690px;
      margin-top: 30px;
      .r-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        h1 {
          font-size: 32px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #252a34;
          line-height: 44px;
        }
        .upData {
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #bac5d2;
          line-height: 40px;
        }
      }
      .reportInfo {
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            width: 188px;
            height: 188px;
            margin-right: 63px;
            margin-bottom: 30px;
            &:nth-child(3n) {
              margin-right: 0;
            }
            img {
              display: block;
              width: 188px;
              height: 188px;
            }
          }
        }
      }
    }
  }
}
</style>
