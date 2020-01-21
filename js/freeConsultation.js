var bath = $("#bath").val();
// var pathname = location.pathname;

// $("#free-external").click(function () {
//     window.preventEjectMpQrcode = true;
//     $.post(bath + "/getMediationContactInformation", {}, function (data) {
//         if (data.response == "success") {
//
//             if (pathname.length > 1) {
//                 _hmt.push(['_trackEvent', pathname.substr(1) + '#freeConsult', 'click', '免费咨询']);
//             } else {
//                 _hmt.push(['_trackEvent', 'other#freeConsult', 'click', '免费咨询']);
//             }
//
//             //  存在门店联系方式，弹层询问会员是否联系专属门店
//             var concatName = data.data.concatName;
//             var concatMobile = data.data.concatMobile;
//             var text = concatName + '：<a href="tel:concatMobile" class="am-concat-mobile" id="concat-mediation-now">concatMobile</a>'.replace(/(concatMobile)/g, concatMobile);
//             $.modal({
//                 title: '是否联系服务门店',
//                 text: text,
//                 extraClass: 'no-before',
//                 buttons: [
//                     {
//                         text: '下次再说',
//                         onClick: function () {
//                             window.preventEjectMpQrcode = false;
//                         }
//                     },
//                     {
//                         text: '立即联系',
//                         onClick: function () {
//                             window.preventEjectMpQrcode = false;
//                             // $("#concat-mediation-now").click();
//                             window.location.href = "tel:" + concatMobile;
//                             if (pathname.length > 1) {
//                                 _hmt.push(['_trackEvent', pathname.substr(1) + '#contact', 'click', '立即联系']);
//                             } else {
//                                 _hmt.push(['_trackEvent', 'other#contact', 'click', '立即联系']);
//                             }
//                         }
//                     }
//                 ]
//             });
//
//         } else if (data.data.errorcode == 1) {
//             // 未登录
//             // 跳转至登录页面
//             location.href = bath + "/login?loginImg=loginImg_index_mediation";
//         } else if (data.data.errorcode == 20) {
//             // 没有专属服务门店
//             // 跳转至选择服务门店页面
//             location.href = bath + "/getReCode";
//         } else {
//             // 未知异常，往我的门店跳转准没错
//             // 跳转至我的门店
//             location.href = bath + "/myMediation?loginImg=loginImg_index_mediation";
//         }
//     });
// });

$("#free-external").click(function () {
    window.preventEjectMpQrcode = true;
    var jobId = $(this)[0].dataset.jobId;
    if(!jobId) {
        jobId = "";
    }
    window.location.href = bath + "contactMediation?jobId=" + jobId;
});

/**
 * 去首页
 */
$("#go-index").click(function () {
    location.href = bath + "/index";
});