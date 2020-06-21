import {getQueryObject} from '../utils/index'
export function getWxParams(self) {
        return new Promise(function (resolve, reject) {
            // if (sessionStorage.getItem('appId') && (sessionStorage.getItem('appId') != '')) {
            //     resolve({
            //         appId: sessionStorage.getItem('appId'),
            //         timestamp: sessionStorage.getItem('timestamp'),
            //         nonceStr: sessionStorage.getItem('nonceStr'),
            //         signature: sessionStorage.getItem('signature'),
            //     })
            // } else {
                var appId = sessionStorage.getItem('appId')
                if (!appId || appId == '') {
                    if (getQueryObject().appId) {
                        appId = getQueryObject().appId
                    } else {
                        appId = '666'
                    }
                }
                sessionStorage.setItem('appId', appId)
                // alert('请求的url》》'+process.env.shop_front_api + '/shareWxInfo/'+sessionStorage.getItem('appId'))
                // alert('请求的参数》》'+window.location.href)
                self.$fetch({
                    url: process.env.shop_front_api + '/shareWxInfo/'+sessionStorage.getItem('appId'),
                    method: 'get',
                    params: {
                        url: window.location.href
                    }
                }).then((res) => {
                    if (res.code == 200) {
                        // 存储配置信息
                        sessionStorage.setItem('appId', res.data.appId)
                        sessionStorage.setItem('timestamp', res.data.timestamp)
                        sessionStorage.setItem('nonceStr', res.data.nonceStr)
                        sessionStorage.setItem('signature', res.data.signature)
                        resolve(res.data)
                    }
                }).catch((err) => {
                    reject()
                })
            // }

        })
    }
    