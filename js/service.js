var bath = $("#bath").val();
// 当前服务门店
var serviceMediationId = $("#service-mediation-id").val();
$("#service-mediation-id").remove();
// 评价弹层模板
var $appraiseItemTemp = $(".appraise-item-temp").clone();
$appraiseItemTemp.removeClass("nz-hide").removeClass("appraise-item-temp");
$(".appraise-item-temp").remove();
// 评价星星条
var $starItemTemp = $(".star-item-temp").clone();
$starItemTemp.removeClass("nz-hide").removeClass("star-item-temp");
$(".star-item-temp").remove();
// 评价显示文本
var rateArray = ['很差', '差', '一般', '好', '很好'];

/**
 * 初始化选择分数事件
 */
function initStarClickFunction() {
    $(".appraise .star-item div.img").each(function (index) {
        var that = $(this);
        that.click(function () {
            var clickIndex = that[0].dataset.value;
            that.parent().find("input[name=rate]").val(clickIndex);
            // 修改评价备注
            that.parent().find(".star-item-text").html(rateArray[clickIndex - 1]);
            // 重置星星
            that.parent().find("div.img").each(function (index2) {
                if ($(this)[0].dataset.value <= clickIndex) {
                    $(this).removeClass("star-none");
                    $(this).addClass("star-full");
                } else {
                    $(this).removeClass("star-full");
                    $(this).addClass("star-none");
                }
            });
        });
    })
}

/**
 * 初始化待评价列表
 */
function initRateList() {
    $.post(bath + "/rateList", {pageNumber: 1, pageSize: 5}, function (data) {
        if (data.response == "success") {
            if (data.data.content && data.data.content.length > 0) {
                $(".split-line-appraise").removeClass("nz-hide");
                $(".appraise").removeClass("nz-hide");

                var rateList = data.data.content;
                for (var i = 0; i < rateList.length; i++) {
                    var job = rateList[i].job;
                    var $appraiseItem = $appraiseItemTemp.clone();
                    // if (i == 0) {
                    $appraiseItem.removeClass("appraise-item-line");
                    if (job.company && job.company.companyImageList && job.company.companyImageList.length > 0) {
                        var imageUrl = job.company.companyImageList[0].imageCosSourceUrl
                            .replace("http://niuzhigongzuo-1251799515.cossh.myqcloud.com", "https://cos.niuzhigongzuo.com");
                        $appraiseItem.find(".job-image img").attr("src", imageUrl);
                    }
                    $appraiseItem.find(".job-name span").html(job.jobName);
                    // }
                    if (rateList[i].applyStatus == 1) {
                        $appraiseItem.find(".appraise-type span").html("劳务剔除");
                    } else if (rateList[i].applyStatus == 2) {
                        $appraiseItem.find(".appraise-type span").html("入职");
                    } else if (rateList[i].applyStatus == 3) {
                        $appraiseItem.find(".appraise-type span").html("离职");
                    } else if (rateList[i].applyStatus == 4) {
                        $appraiseItem.find(".appraise-type span").html("补贴发放");
                    }

                    var subsidy = "--";
                    var returnFeeType = 0;
                    if (rateList[i].platformReturnFee) {
                        returnFeeType = rateList[i].platformReturnFee.returnFeeType;
                        var subsidyF = rateList[i].platformReturnFee.maxPayMan;
                        var subsidyFe = rateList[i].platformReturnFee.maxPayWoman;
                        var hourlyPay = rateList[i].platformReturnFee.hourlyPay;
                        if (subsidyF > subsidyFe) {
                            subsidy = subsidyF + hourlyPay;
                        } else {
                            subsidy = subsidyFe + hourlyPay;
                        }
                        subsidy = accDiv(subsidy, 100);
                    } else if (rateList[i].applyReturnFee) {
                        returnFeeType = rateList[i].applyReturnFee.returnFeeType;
                        var subsidyF = rateList[i].applyReturnFee.maxPayMan;
                        var subsidyFe = rateList[i].applyReturnFee.maxPayWoman;
                        var hourlyPay = rateList[i].applyReturnFee.hourlyPay;
                        if (subsidyF > subsidyFe) {
                            subsidy = subsidyF + hourlyPay;
                        } else {
                            subsidy = subsidyFe + hourlyPay;
                        }
                        subsidy = accDiv(subsidy, 100);
                    }

                    var unit = "元";
                    if (returnFeeType == 0) {
                        unit == "元/小时"
                    }
                    subsidy += unit;
                    if (rateList[i].platformReturnFee) {
                        // 存在面试价格
                        $appraiseItem.find(".apply-price span.item-title").html("面试价格：");
                        $appraiseItem.find(".apply-price span.item-text").html(subsidy);
                    } else {
                        $appraiseItem.find(".apply-price span.item-title").html("报名价格：");
                        $appraiseItem.find(".apply-price span.item-text").html(subsidy);
                    }


                    $appraiseItem.find(".apply-mediation span.item-text").html(rateList[i].mediationName);
                    if (rateList[i].laborStatus && rateList[i].laborStatus == 1) {
                        $appraiseItem.find(".apply-time span.item-title").html("入职时间：");
                        $appraiseItem.find(".apply-time span.item-text").html(new Date(rateList[i].laborConfirmTime).format("yyyy年MM月dd日"));
                    } else if (rateList[i].mediationStatus && rateList[i].mediationStatus == 1) {
                        $appraiseItem.find(".apply-time span.item-title").html("发车时间：");
                        $appraiseItem.find(".apply-time span.item-text").html(new Date(rateList[i].confirmTime).format("yyyy年MM月dd日"));
                    } else {
                        $appraiseItem.find(".apply-time span.item-title").html("报名时间：");
                        $appraiseItem.find(".apply-time span.item-text").html(new Date(rateList[i].applyCreateTime).format("yyyy年MM月dd日"));
                    }

                    // 评价
                    for (var x = 0; x < rateList[i].rateRecordList.length; x++) {
                        var $starItem = $starItemTemp.clone();
                        var rateRecord = rateList[i].rateRecordList[x];
                        $starItem.find("input[name=rateId]").val(rateRecord.rateId);
                        if (rateRecord.rateType == 1) {
                            $starItem.addClass("star-mediation");
                            $starItem.find(".star-item-title").html("门店服务")
                            $appraiseItem.find(".mediation-service-content").show();
                        } else if (rateRecord.rateType == 2) {
                            $starItem.addClass("star-labor");
                            $starItem.find(".star-item-title").html("驻场服务")
                        } else if (rateRecord.rateType == 3) {
                            $starItem.addClass("star-job");
                            $starItem.find(".star-item-title").html("岗位体验")
                        }
                        $appraiseItem.find(".star-list").append($starItem);
                    }
                    $appraiseItem.find(".appraise-star").find("form").attr("id", "submit-this-form-" + i).attr("data-current-mediation-id", rateList[i].mediationId);
                    $appraiseItem.find(".appraise-star").find(".appraise-btn a").attr("onClick", "submitThisForm('submit-this-form-" + i + "')");
                    $(".appraise").append($appraiseItem);
                }
                // 初始化选择分数事件
                initStarClickFunction();
                if (location.hash == "#applyActive") {
                    scroll($('.content.native-scroll')[0], $('.service-mediation')[0].offsetTop + $('.service-mediation')[0].offsetHeight, 100);
                }
            } else {
                $(".split-line-appraise").remove();
                $(".appraise").remove();
            }
        }
    });
}

function submitThisForm(id) {
    var $form = $("#" + id);
    var submitData = $form.serialize();
    var $starMediation = $form.find(".star-mediation");
    // 本次评论的服务门店
    var currentMediationId = $form[0].dataset.currentMediationId;

    $.confirm('确定对本次服务进行评价？','牛职工作网', function () {
        $.post(bath + "/rate", submitData, function (data) {
            if (data.response == "success") {
                // 是否更换门店
                if ($starMediation) {
                    var mediationScore = $starMediation.find("input[name=rate]").val();
                    if (mediationScore <= 2) {
                        if (currentMediationId && currentMediationId == serviceMediationId){
                            // 如果评论的服务门店与目前的服务门店不一致才询问，否则不询问
                            $(".bad-layer-wrapper").show();
                        } else {
                            location.reload();
                        }
                    } else {
                        location.reload();
                    }
                } else {
                    location.reload();
                }
            } else {
                $.alert(data.data.text || "评价失败", "评价提示");
            }
        });
    }, function () {

    });
}

function scroll(domObj, targetY, millis) {
    // 计算需要移动的距离
    var needScrollTop = targetY - domObj.scrollTop;
    var _currentY = domObj.scrollTop;
    var dist = 0;
    var t = 0;

    if (Math.abs(needScrollTop) >= millis) {
        dist = Math.ceil(needScrollTop / millis);
        t = 1;
    } else {
        dist = 1;
        t = Math.ceil(millis / needScrollTop);
    }

    setTimeout(function () {
        _currentY += dist;
        domObj.scrollTop = _currentY;

        // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
        if ((needScrollTop > 10 || needScrollTop < -10) && millis > 0) {
            scroll(domObj, targetY, millis - t)
        } else {
            domObj.scrollTop = targetY;
        }
    }, t)
}

$(function () {
    // 门店评分
    var rateScore = $("#mediation-score").val();
    if (rateScore > 0) {
        for (var j = 10; j <= 50; j += 10) {
            if (rateScore >= j) {
                $(".mediation-rate div.img").eq(j / 10 - 1).addClass("show-star-full");
            } else if (rateScore >= j - 5) {
                $(".mediation-rate div.img").eq(j / 10 - 1).addClass("show-star-half");
            } else {
                $(".mediation-rate div.img").eq(j / 10 - 1).addClass("show-star-none");
            }
        }
        var score = (Math.floor(rateScore / 10)) + '.' + (rateScore % 10);
        $(".mediation-rate .mediation-rate-score").html(score);
    }
    $(".mediation-rate .mediation-rate-show").removeClass("nz-visibility-hidden");



    // 初始化待评价列表
    initRateList();

    // 更换服务门店
    $("#change-service-mediation").click(function () {
        location.href = bath + "/chooseServiceMediation";
    });
    // 跳转至我的门店
    $(".go-my-service-mediation").click(function () {
        location.href = bath + "/myMediation"
    });
    // 去岗位详情
    $(".go-this-job").click(function () {
        var jobId = $(this)[0].dataset.jobId;
        var type = $(this)[0].dataset.type;
        if (type == 0) {
            location.href = bath + "/jobDetail?jobId=" + jobId;
        } else if (type == 1) {
            location.href = bath + "/mediaJobDetail?jobId=" + jobId;
        }
    });
    // 去找工作
    $(".go-apply-job").click(function () {
        location.href = bath + "/index";
    });
    // 关闭更换门店弹层
    $(".bad-layer-wrapper .bad-footer .bad-cancel").click(function () {
        location.reload();
    });
    // 更换服务门店
    $(".bad-now-go").click(function () {
        location.href = bath + "/chooseServiceMediation";
    });
    // 更过报名记录
    $(".more-apply-btn").click(function () {
        location.href = bath + "/getJobApplys";
    });
});