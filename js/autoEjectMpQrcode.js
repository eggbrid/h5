var EjectMpQrcode = (function() {
    var appRegex = /LT-APP\/(\d+)/,
        weChatRegex = /micromessenger/i,
        userAgent = navigator.userAgent,
        showQrCodeTimes = 0,
        ejectQrcode = document.getElementById("ejectQrcode").value,
        changeMobile = document.getElementById("change-mobile").value;
    var html =
        '<div id="eject-mp-qrcode" style="position: fixed; top: 0; bottom: 0; background: rgba(0,0,0,.7); display: none; justify-content: center; align-items: center; z-index: 861019; min-width: 320px; max-width: 480px;width: 100%;height: 100%;">\
            <div style="width: 80%; max-width: 300px; height: fit-content; border-radius: 0.25rem; overflow: hidden; background-color: #ffffff;">\
                <div style="padding: .75rem; font-size: .75rem; text-align: center;">\
                    <img style="width: 100%; height: 100%;" src="static/images/nzjob-qrcode.jpg">\
                    <p style="margin: 0; font-size: .75rem; color: #5e5e5e; white-space: nowrap; user-select: none; -webkit-user-select: none;">长按关注公众号</p>\
    	 			<p style="margin: 0; font-size: .75rem; color: #5e5e5e; white-space: nowrap; user-select: none; -webkit-user-select: none;">发工资早知道 </p>\
    				<p style="margin: 0; font-size: .75rem; color: #5e5e5e; white-space: nowrap; user-select: none; -webkit-user-select: none;">推荐奖早知道</p>\
                </div>\
                <div style="border-top: 1px solid #f0f0f0;">\
                    <a href="javascript: EjectMpQrcode.closeMpQrcode()" \
                        style="display: block; height: 2.7rem; line-height: 2.7rem; text-align: center; font-size: 0.75rem;">关闭</a>\
                </div>\
            </div>\
        </div>';

    var _e = {
        ejectMpQrcode: function() {
            setTimeout(function() {
                if (window.preventEjectMpQrcode) {
                    console.log('用户报名中，等待下一个 10 秒')
                    _e.ejectMpQrcode();
                } else {
                    $('#eject-mp-qrcode').css('display', 'flex');
                    showQrCodeTimes++;
                }
            }, 1000);
        },
        closeMpQrcode: function() {
            $('#eject-mp-qrcode').css('display', 'none');

            // if (showQrCodeTimes < 3) {
            //     _e.ejectMpQrcode();
            // }
        },
        init: function() {
            if (!appRegex.test(userAgent) && ejectQrcode == 0 && changeMobile == 0 && weChatRegex.test(userAgent)) {
                // 没有关注公众号，并且不在 APP 中弹出关注公众号二维码
                // 新增不需要更换手机号
                $('body').append(html);
                _e.ejectMpQrcode();
            }
        }
    };

    return _e;
}) ();

window.preventEjectMpQrcode || (window.preventEjectMpQrcode = false);
EjectMpQrcode.init();