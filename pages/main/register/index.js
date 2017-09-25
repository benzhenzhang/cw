// index.js  注册页面
import { $wuxToast } from '../../../components/wux'
import req from '../../../utils/requestUtils'
var app = getApp();
Page({
  data: {
    operName: '',
    operGender: '',
    operNo: '',
    password: '',
    sec_password: '',
    tel: '',
    officeTel: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    this.WxValidate = app.WxValidate({
      operName: {
        required: true,
        minlength: 2,
        maxlength: 10,
      },
      operNo: {
        required: true,
        minlength: 2,
        maxlength: 10,
      },
      password: {
        required: true,
      },
      sec_password: {
        required: true,
        equalTo:'password',
      },
      tel: {
        required: true,
        tel : true
      },
    }, {
        operName: {
          required: '请输入姓名',
        },
        tel: {
          required: '请输入电话',
        },
        operNo: {
          required: '请输入账号',
        },
        password: {
          required: '请输入密码',
        },
        sec_password: {
          required: '请再次输入密码',
        },
      })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  register: function () {

  },
  formSubmit: function (e) {
  

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      console.log(error);
      wx.showToast({
        title: error.param + ':' + error.msg,
      })
      return false
    }
    var param = e.detail.value;
    param['paramNames'] = ['operNo', 'password', 'operName', 'operGender', 'tel', 'officeTel'];

    var datacopy = req.postData('operRegister', param);

    //wsdlurl中设置需要访问的webservice的url地址
    var wsdlurl = 'https://www.iomgroup.cn/way/services/iomWay?wsdl';
    var targetNamespace = 'http://service.ws.iomWay.com/';

    wx.showToast({
      title: '注册中,请稍后...',
      icon: 'loading',
      duration: 100000,
    })

    wx.request({
      url: wsdlurl,
      data: datacopy,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'content-type': 'text/xml; charset=utf-8',
        'SOAPAction': targetNamespace + 'operRegister',
      },
      // 设置请求的 header
      success: function (res) {
        // success
        wx.hideToast();
        var resData = req.parseWebServiceResponseData(res, 'operRegister');
        // console.log(resData['RT_LIST']);
        $wuxToast.show({
          type: 'text',
          timer: 1500,
          color: '#fff',
          text: resData['RT_D'],
          success: () => console.log(resData['RT_D'])
        })
        if (resData['RT_F'] == '1') {
          
          wx.navigateBack({
            url: '../../login/login',
          })
        } else {
          wx.hideToast();
        }


      },
      fail: function (res) {
        // fail
        var resData = res.data;
        console.log(resData);
        
      },
      complete: function () {
        // complete 
      }
    })

  },
})