<template>
  <div class="apply3">
    <div class="container">
      <div class="head">
        <div>
          <ul>
            <li>
              <i></i>
              <p>个人信息</p>
            </li>
            <li>
              <i></i>
              <p>实名认证</p>
            </li>
            <li class="active">
              <i></i>
              <p>体检报告</p>
            </li>
          </ul>
          <!-- 分割线 -->
          <div class="line">
            <span class="lineL"></span>
            <span class="lineR"></span>
          </div>
        </div>
      </div>
      <!-- 添加报告 -->
      <div class="addReport">
        <div class="reportBox">
          <h3>添加体检报告</h3>
          <p>请提供三甲医院检查报告</p>
          <div>
            <img
              src="@/assets/images/applys/ic_report_hospital.png"
              alt=""
              class="r-hospital"
            />
            <span @click="goExam">全部体检医院</span>
            <img
              src="@/assets/images/applys/ic_report_hospital_more.png"
              alt=""
              class="r-more"
            />
          </div>
        </div>
        <img
          src="@/assets/images/applys/ic_report.png"
          alt=""
          class="reportUpdata"
          @click="photograph"
        />
      </div>
      <!-- 上传的图片 -->
      <div class="uploadBox">
        <ul>
          <li v-for="(item, index) in imgSrc" :key="index">
            <img
              :src="item"
              alt=""
              class="uploadImg"
              @click="previewImage(index)"
            />
            <i>
              <img
                src="@/assets/images/applys/ic_deletepic.png"
                alt=""
                @click="deleteImg(index)"
              />
            </i>
          </li>
        </ul>
      </div>
      <!-- 完成 -->
      <button class="next" @click="finish">完成</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "apply3",
  data() {
    return {
      // 图片路径
      imgSrc: [],
      //记录是否上传
      isUpImg: 0,
      //用户id
      user_info_id: "",
      //返回的图片地址
      returnUrl: []
    };
  },
  created() {
    this.$store.commit("changeFbTitle", { name: "填写申请表", tState: "0" });
    this.$store.commit("changeFbFoot", 1);
    this.$wxInit();
    this.user_info_id = this.$route.params.user_info_id;
    // 初始化图片
    this.imgSrc = [];
    this.isUpImg = 0;
    this.returnUrl = [];
  },
  methods: {
    //上传or拍照
    photograph() {
      wx.chooseImage({
        count: 9,
        sizeType: ["original", "compressed"],
        sourceType: ["album"],
        success: res => {
          this.imgSrc = res.localIds;
          console.log(this.imgSrc )
          this.isUpImg = 1;
        },
        fail: function() {
          this.$toast.fail({
            message: "上传失败！"
          });
        }
      });
    },
    // 预览图片
    previewImage(e) {
      wx.previewImage({
        current: this.imgSrc[e],
        urls: this.imgSrc
      });
    },
    //删除图片
    deleteImg(e) {
      this.imgSrc.splice(e, 1);
      console.log(this.imgSrc);
    },
    //多文件上传
    muchUpData(count, length) {
      // 使用递归的方法解决wx.uploadFile多文件上传异步的问题
      wx.uploadImage({
        localId: this.imgSrc[count].toString(),
        isShowProgressTips: 1,
        success: res => {
          const data = res.serverId;
          this.returnUrl.push(data);
        },
        fail: res => {},
        complete: res => {
          count++;
          if (count == length) {
            this.addReport();
          } else {
            this.muchUpData(count, this.imgSrc.length);
          }
        }
      });
    },
    // 添加报告
    addReport() {
      this.$request.addReport({
        user_info_id:this.user_info_id,
        medical_report:this.returnUrl,
      }).then(data=>{
        if(data.data.status == 3){
          this.$toast.success({
            message:'创建成功',
            onClose:()=>{
              this.$router.replace({
                path: "/me",
                name:'me'
              })
            }
          })
        }
      })
    },
    //查看体检医院
    goExam() {
      this.$router.replace({path:'/examHospital'})
    },
    //完成
    finish() {
      if (this.isUpImg == 1) {
        this.muchUpData(0, this.imgSrc.length);
      } else {
        this.$toast.fail({
          message: "亲，请先上传体检报告"
        });
      }
    }
  }
};
</script>
<style lang="less">
.apply3 {
  height: 100%;
  background: #f7f9fb;
  margin-top: 86px;
  .container {
  padding: 0 30px;
  width: 690px;
  display: block;
  .head {
    width: 690px;
    padding-top: 80px;
    padding-bottom: 60px;
    position: relative;
    ul {
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: relative;
      li {
        display: flex;
        flex-direction: column;
        align-items: center;
        i {
          width: 12px;
          height: 12px;
          background: #c3dffc;
          margin-bottom: 42px;
          border-radius: 50%;
          z-index: 9998;
        }
        p {
          font-size: 24px;
          font-weight: 500;
          color: #bac5d2;
          line-height: 34px;
        }
      }
      .active {
        i {
          background-color: #ffffff;
          z-index: 9999;
        }
        &::before {
          content: "";
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #2a90ff;
          position: absolute;
          right: 97px;
          top: -12px;
        }
      }
    }
    .line {
      .lineL {
        position: absolute;
        width: 214px;
        height: 4px;
        background: #eef1f4;
        top: 85px;
        left: 126px;
      }
      .lineR {
        position: absolute;
        width: 214px;
        height: 4px;
        background: #eef1f4;
        top: 85px;
        right: 132px;
      }
    }
  }
  .addReport {
    box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
    border-radius: 16px;
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    padding: 40px 40px 30px 30px;
    .reportBox {
      h3 {
        font-size: 32px;
        font-weight: 500;
        color: #464e5e;
        line-height: 44px;
        font-family: PingFangSC-Medium, PingFang SC;
        margin-bottom: 10px;
      }
      p {
        font-size: 28px;
        font-weight: 400;
        color: #bac5d2;
        line-height: 40px;
        font-family: PingFangSC-Regular, PingFang SC;
        margin: 10px 0 52px 0;
      }
      div {
        background: #eafafb;
        border-radius: 21px;
        height: 42px;
        width: 224px;
        display: flex;
        justify-content: start;
        align-items: center;
        padding-left: 8px;
        .r-hospital {
          width: 32px;
          height: 32px;
          display: block;
        }
        span {
          font-size: 24px;
          font-weight: 500;
          color: #7fd5d4;
          line-height: 34px;
          margin: 0 10px;
        }
        .r-more {
          width: 10px;
          height: 16px;
          display: block;
        }
      }
    }
    .reportUpdata {
      width: 188px;
      height: 188px;
      display: block;
    }
  }
  .uploadBox {
    margin-top: 60px;
    ul {
      li {
        float: left;
        position: relative;
        margin-right: 63px;
        &:nth-child(3n) {
          margin-right: 0;
        }
        .uploadImg {
          width: 188px;
          height: 188px;
          display: block;
        }
        i {
          width: 36px;
          height: 36px;
          img {
            width: 38px;
            height: 38px;
            display: block;
            position: absolute;
            right: -18px;
            top: -18px;
            z-index: 9999;
          }
        }
      }
    }
  }
  .next {
    width: 690px;
    height: 80px;
    background: #2a90ff;
    border-radius: 44px;
    font-size: 32px;
    font-weight: 500;
    color: #ffffff;
    line-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 60px;
    left: 30px;
  }
}
}

</style>
