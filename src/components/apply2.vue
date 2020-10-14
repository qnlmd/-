<template>
  <div class="apply2">
    <div class="container">
      <!-- 步骤 -->
      <div class="head">
        <div>
          <ul>
            <li>
              <i></i>
              <p>个人信息</p>
            </li>
            <li class="active">
              <i></i>
              <p>实名认证</p>
            </li>
            <li>
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
      <!-- 正面 -->
      <div class="zm userId">
        <div>
          <h3>身份证正面</h3>
          <p>上传您身份证国徽面</p>
        </div>
        <img @click="zmUpImg" :src="zmSrc" alt="" />
        <img
          src="@/assets/images/applys/ic_deletepic.png"
          alt=""
          @click="deleteImg('zm')"
          v-if="zmBtnShow == 1"
          class="delete"
        />
      </div>
      <!-- 反面 -->
      <div class="fm userId">
        <div>
          <h3>身份证背面</h3>
          <p>上传您身份证人像面</p>
        </div>
        <img @click="fmUpImg" :src="fmSrc" alt="" />
        <img
          src="@/assets/images/applys/ic_deletepic.png"
          alt=""
          @click="deleteImg('fm')"
          v-if="fmBtnShow == 1"
          class="delete"
        />
      </div>
      <!-- next -->
      <button class="next" @click="next()">继续完善</button>
    </div>
  </div>
</template>
<script>
export default {
  name:"apply2",
  data() {
    return {
      // 图片路径
      zmSrc: require("../assets/images/applys/ic_certificate_up.png"),
      fmSrc: require("../assets/images/applys/ic_certificate_down.png"),
      // 记录图片是否上传状态值
      zmState: 0,
      fmState: 0,
      //用户id
      user_info_id: "",
      //删除按钮的显示隐藏
      zmBtnShow: 0,
      fmBtnShow: 0,
      //处理微信无法多文件上传数组
      wxlj: [],
      //返回的图片地址
      returnUrl: [],
      //
      token: ""
    };
  },
  created() {
    this.$store.commit("changeFbTitle", { name: "填写申请表", tState: "0" });
    this.$store.commit("changeFbFoot", 1);
    this.user_info_id = this.$route.params.user_info_id;
    // 清除记录值
    this.zmBtnShow = 0;
    this.fmBtnShow = 0;
    this.zmSrc = require("../assets/images/applys/ic_certificate_up.png");
    this.fmSrc = require("../assets/images/applys/ic_certificate_down.png");
    this.zmState = 0;
    this.fmState = 0;
    // 获取用户jskd
     this.$wxInit();
    // this.$wxInit(["chooseImage", "uploadImage"]);
  },
  methods: {
    // 正面拍照上传or预览
    zmUpImg() {
      if (this.zmState == 0) {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            var tempFilePaths = res.localIds;
            this.zmSrc = tempFilePaths[0];          
            this.zmBtnShow = 1;
            this.zmState = 1;
          },
          fail: function() {
            this.$toast.fail({
              message: "上传失败"
            });
          }
        });
      } else if (this.fmState == 1) {
        // 预览图片
        wx.previewImage({
          current: this.zmSrc,
          urls: [this.zmSrc]
        });
      }
    },
    // 反面拍照上传or预览
    fmUpImg() {
      if (this.fmState == 0) {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"],
          success: res => {
            var tempFilePaths = res.localIds;
            this.fmSrc = tempFilePaths[0];
            this.fmBtnShow = 1;
            this.fmState = 1;
          },
          fail: function() {
            this.$toast.fail({
              message: "上传失败"
            });
          }
        });
      } else if (this.fmState == 1) {
        // 预览图片
        wx.previewImage({
          current: this.fmSrc,
          urls: [this.fmSrc]
        });
      }
    },
    // 删除图片
    deleteImg(e) {
      if (e == "zm") {
        this.zmSrc = require("../assets/images/applys/ic_certificate_up.png");
        this.zmState = 0;
        this.zmBtnShow = 0;
      } else if (e == "fm") {
        this.fmSrc = require("../assets/images/applys/ic_certificate_down.png");
        this.fmState = 0;
        this.zmBtnShow = 0;
      }
    },
    //多文件上传
    muchUpData(count, length) {
      // 使用递归的方法解决wx.uploadFile多文件上传异步的问题
      wx.uploadImage({
        localId: this.wxlj[count],
        success: res => {
          const data = res.serverId;
          this.returnUrl.push(data);
        },
        fail: res => {
        },
        complete: res => {
           count++;
          if (count == length) {
            this.$request.addInfoAuth({
              user_info_id: this.user_info_id,
              idcar_front: this.returnUrl[0],
              idcar_back: this.returnUrl[1]
            }).then(data => {
              if (data.code == 1) {
                // let url ="../infoCard/main?user_info_id=" +data.data.user_info_id + "&userStatus=" + 2;
               this.$router.replace({
                 url:'/next',
                 name:'next',
                 params:{
                   user_info_id:data.data.user_info_id
                 }
               })
              }
            });
          } else {
            this.muchUpData(count, this.wxlj.length);
          }
        }
      });
    },
    // 提交申请
    next() {
      // 是否上传了图片
      if (this.zmState == 1 && this.fmState == 1) {
        //0是正面，1是反面
        this.wxlj.push(this.zmSrc, this.fmSrc);
        this.muchUpData(0, this.wxlj.length);
      } else {
        this.$toast.fail({
          message: "亲，请先上传身份证照片"
        });
      }
    }
  }
};
</script>
<style lang="less">
.apply2 {
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
          z-index: 999;
          i {
            background-color: #ffffff;
            z-index: 999;
          }
          &::before {
            content: "";
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #2a90ff;
            position: absolute;
            left: 328px;
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
          left: 115px;
        }
        .lineR {
          position: absolute;
          width: 214px;
          height: 4px;
          background: #eef1f4;
          top: 85px;
          right: 113px;
        }
      }
    }
    .userId {
      display: flex;
      justify-content: space-around;
      background: #ffffff;
      padding: 40px 40px 30px 30px;
      box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
      border-radius: 16px;
      position: relative;
      div {
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
        }
      }
      img {
        width: 268px;
        height: 188px;
        display: block;
      }
      .delete {
        width: 38px;
        height: 38px;
        display: block;
        position: absolute;
        right: 50px;
        top: 26px;
      }
    }
    .fm {
      margin-top: 20px;
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
