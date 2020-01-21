var EjectBindMobile = (function() {
    var showBindMobileTimes = 0,
        bath = document.getElementById("bath").value,
        changeMobile = document.getElementById("change-mobile").value;

    var _e = {
        ejectBindMobile: function() {
            setTimeout(function() {
                if (window.preventEjectBindMobile) {
                    _e.ejectBindMobile();
                } else {
                    $.modal({
                        title:  '提示',
                        text: '您好，您的手机号可能已更换，请绑定新的手机号！',
                        buttons: [
                            {
                                text: '关闭',
                                onClick: function () {
                                    if (showBindMobileTimes < 3) {
                                        _e.ejectBindMobile();
                                    }
                                }
                            },
                            {
                                text: '去绑定',
                                onClick: function() {
                                    location.href = bath + "/goEditMobile";
                                }
                            }
                        ]
                    });
                    showBindMobileTimes++;
                }
            }, 10000);
        },
        init: function() {
            if (changeMobile == 1) {
                // 需要更换手机号
                $.modal({
                    title:  '提示',
                    text: '您好，您的手机号可能已更换，请绑定新的手机号！',
                    buttons: [
                        {
                            text: '关闭',
                            onClick: function () {
                                if (showBindMobileTimes < 3) {
                                    _e.ejectBindMobile();
                                }
                            }
                        },
                        {
                            text: '去绑定',
                            onClick: function() {
                                location.href = bath + "/goEditMobile";
                            }
                        }
                    ]
                });
                showBindMobileTimes++;
            }
        }
    };

    return _e;
}) ();

window.preventEjectBindMobile || (window.preventEjectBindMobile = false);
EjectBindMobile.init();