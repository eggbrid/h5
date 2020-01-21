/**
 * Created by Administrator on 2017/2/5.
 */
var indexNumber = '';
$(function() {
	if (getCookie('scrollTopFlag') === 'true') {
		// 如果去过 岗位详情页 如果存在数据
		if (localStorage.getItem('ls')) {
			// 如果 本地存储存在 那么添加到 列表里
			$('#index-joblist').append(localStorage.getItem('ls'));
			if (localStorage.getItem('pageNumber')) {
				// 如果 pageNumber 存在那么交给
				indexNumber = localStorage.getItem('pageNumber');
			}
		} else {
			// 去过详情页但是 没有存数据 那么肯定在page 1
			indexNumber = 1;
		}
		$("#listContent").scrollTop(getCookie('scrollTop'));
		setCookie('scrollTopFlag', '');
	} else {
		indexNumber = 1;
		clearLocalStorage();
	}
});
function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=")
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1
			c_end = document.cookie.indexOf(";", c_start)
			if (c_end == -1)
				c_end = document.cookie.length
			return unescape(document.cookie.substring(c_start, c_end))
		}
	}
	return ""
}
function setCookie(c_name, value, expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays)
	document.cookie = c_name + "=" + escape(value)
			+ ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
function clearLocalStorage() {
	if (typeof (Storage) != "undefined") {
		if (localStorage.lsTime) {
			localStorage.removeItem("lsTime");
		}
		if (localStorage.ls) {
			localStorage.removeItem("ls");
		}
		if (localStorage.pageNumber) {
			localStorage.removeItem("pageNumber");
		}
		var scrollTop = getCookie("scrollTop");
		if (scrollTop != null && scrollTop != "") {
			setCookie("scrollTop", 0, null);
		}
	}
}
// 点击刷新列表
(function() {
	var reloadList = window.document.getElementById("reload-list");
	var reloadListBtn = window.document.getElementById("reload-list-btn");
	var iconClose = window.document.getElementById("icon-close");
	reloadListBtn.onclick = function() {
		clearLocalStorage();
		location.href = location.href;
	};
	// 点击关闭按钮 点击刷新列表刷新
	iconClose.onclick = function() {
		reloadList.style.display = "none";
	};
}());
// 搜索输入框
var jobName = document.getElementById("search");
$(function() {
	var bath = $("#bath").val(); // 获取bath 值
	// 点击搜索按钮
	// $(document).on('click', '#search', function() {
	// 	location.href = '/search';
	// });

	// 加载flag
	var loading = false;
	// 最多可加载的条目 下拉加载工作列表条数
	var maxItems = $("#totalElements").val();
	// 每次加载添加多少条目 每次下拉加载数量 20 条
	var itemsPerLoad = 20;
	// 获取每个列表的长度
	var lastIndex = $('#index-joblist li').length;
	// var indexNumber = 1;
	var ls = [];
	// 动态生成工作列表 以及 滚到底部加载
	function addItems(number, indexNumber) {
		var url = bath + "/getJobList";
		// if ($("#flag").val() == "1") {
		// 	url = bath + "/getJobListByApplyAjax";
		// } else {
		// 	url = bath + "/getJobList";
		// }
		// 生成新条目的HTML
		$.post(url, {
							pageNumber : indexNumber,
							pageSize : number,
							jobName : $('#jobNameInput').val(),
							ifrom : 0
						},
						function(data) {
							if (data.response == "success") {
								var data = data.data.jobPage.content;
								var html = '';
								for (var i = 0, len = data.length; i < len; i++) {
									var currentClass = '';
									if (data[i].setTop < 0) {
										// 停招岗位
										currentClass = 'stop-mark';
									} else {
										// 非停招岗位
										currentClass = 'hot-mark';
									}
									html += '<li><a href="javascript:void (0);" onclick="getJobDetails(' + data[i].jobId + ')" class="item-link external item-content" style="padding-left:0rem;">';
									if (typeof (data[i].imageCosSourceUrl) == "undefined") {
										html += '<div class="item-image"><img src="' + bath + '/static/images/jobJpg.jpg" width="100%"></div>';
									} else {
										html += '<div class="item-image"><img src="'
												+ (data[i].imageCosSourceUrl.replace(
																"http://niuzhigongzuo-1251799515.cossh.myqcloud.com",
																"https://cos.niuzhigongzuo.com"))
												+ '" width="100%">';
										html += '</div>';
									}
									html += '<div class="item-inner noneImges">';
									if (data[i].jobType == 0) {
										if (currentClass === "stop-mark") {
											html += '<div class="item-amount"><p class="'
													+ currentClass
													+ '">已停招</p><p>'
													+ data[i].jobHourlyMaxPay
													+ '元/小时</p></div>';
										} else {
											html += '<div class="item-amount"><p class="'
													+ currentClass
													+ '">工价</p><p>'
													+ data[i].jobHourlyMaxPay
													+ '元/小时</p></div>';
										}
									} else {
										var index_x = 0;
										for (var j = 0; data[i].returnFees
												&& j < data[i].returnFees.length; j++) {
											if (data[i].returnFees[j].returnFeeFlag == 1 && index_x == 0) {
												index_x = 1;
												var hourReturnFee = 0.0;
												var monthReturnFee = 0.0;
												var returnFeeMan = 0.0;
												var returnFeeWoman = 0.0;
												for (var k = 0; data[i].returnFees[j].returnFeeDetails
														&& k < data[i].returnFees[j].returnFeeDetails.length; k++) {
													if (data[i].returnFees[j].returnFeeType == 0) {
														if (data[i].returnFees[j].returnFeeDetails[k].returnFeeDetailMan > hourReturnFee) {
															hourReturnFee = parseFloat(data[i].returnFees[j].returnFeeDetails[k].returnFeeDetailMan);
														}
														if (data[i].returnFees[j].returnFeeDetails[k].returnFeeDetailWoman > hourReturnFee) {
															hourReturnFee = parseFloat(data[i].returnFees[j].returnFeeDetails[k].returnFeeDetailWoman);
														}
													} else if (data[i].returnFees[j].returnFeeType == 1) {
														if (data[i].returnFees[j].returnFeeDetails[k].returnFeeDetailMan != 0) {
															returnFeeMan += parseFloat(data[i].returnFees[j].returnFeeDetails[k].returnFeeDetailMan);
														}
														if (data[i].returnFees[j].returnFeeDetails[k].returnFeeDetailWoman != 0) {
															returnFeeWoman += parseFloat(data[i].returnFees[j].returnFeeDetails[k].returnFeeDetailWoman);
														}
													} else {
														if (data[i].returnFees[j].returnFeeDetails[k].returnFeeDetailMan > monthReturnFee) {
															monthReturnFee = parseFloat(data[i].returnFees[j].returnFeeDetails[k].returnFeeDetailMan);
														}
														if (data[i].returnFees[j].returnFeeDetails[k].returnFeeDetailWoman > monthReturnFee) {
															monthReturnFee = parseFloat(data[i].returnFees[j].returnFeeDetails[k].returnFeeDetailWoman);
														}
													}
												}
												if (data[i].returnFees[j].returnFeeType == 0) {
													if (hourReturnFee > 0) {
														if (currentClass === "stop-mark") {
															html += '<div class="item-amount"><p class="'
																	+ currentClass
																	+ '">已停招</p><p>'
																	+ hourReturnFee
																	+ '元/小时</p></div>';
														} else {
															html += '<div class="item-amount"><p class="'
																	+ currentClass
																	+ '">补贴</p><p>'
																	+ hourReturnFee
																	+ '元/小时</p></div>';
														}
													}
												} else if (data[i].returnFees[j].returnFeeType == 1) {
													var _f = returnFeeMan;
													if (returnFeeWoman > _f) {
														_f = returnFeeWoman;
													}
													if (_f > 0) {
														if (currentClass === "stop-mark") {
															html += '<div class="item-amount"><p class="'
																	+ currentClass
																	+ '">已停招</p><p>'
																	+ _f
																	+ '元</p></div>';
														} else {
															html += '<div class="item-amount"><p class="'
																	+ currentClass
																	+ '">补贴</p><p>'
																	+ _f
																	+ '元</p></div>';
														}
													} else {
                                                        if (currentClass === "stop-mark") {
                                                            html += '<div class="item-amount"><p class="'
                                                                + currentClass
                                                                + '">已停招</p><p>无补贴</p></div>';
                                                        } else {
                                                            html += '<div class="item-amount"><p class="'
                                                                + currentClass
                                                                + '">补贴</p><p>无补贴</p></div>';
                                                        }
													}
												} else {
                                                    if (currentClass === "stop-mark") {
                                                        html += '<div class="item-amount"><p class="'
                                                            + currentClass
                                                            + '">已停招</p><p>无补贴</p></div>';
                                                    } else {
                                                        html += '<div class="item-amount"><p class="'
                                                            + currentClass
                                                            + '">补贴</p><p>无补贴</p></div>';
                                                    }
												}
											}
										}
                                        if (index_x == 0) {
                                            if (currentClass === "stop-mark") {
                                                html += '<div class="item-amount"><p class="'
                                                    + currentClass
                                                    + '">已停招</p><p>无补贴</p></div>';
                                            } else {
                                                html += '<div class="item-amount"><p class="'
                                                    + currentClass
                                                    + '">补贴</p><p>无补贴</p></div>';
                                            }
                                        }
									}
									html += '<div class="item-price-row"><p class="item-number index-item-title text-filter" title="'
											+ data[i].jobName
											+ '">'
											+ data[i].jobName.substr(0, 10)
											+ '</p></div>';
									if (data[i].tagTextListStr
											&& data[i].tagTextListStr.length > 0) {
										html += '<p class="index-item-subtitle">';
										for (var y = 0, length = data[i].tagTextListStr
												.split(',').length; y < length; y++) {
											html += '<span>'
													+ data[i].tagTextListStr
															.split(',')[y]
													+ '</span>';
										}
										html += '</p>';
									} else {
										html += '<p class="index-item-subtitle" style="color: #3f3f3f">&nbsp;</p>';
									}
									html += '<div class="item-price-row">';
									if (data[i].jobType == "0") {
										var low =  accMul(
												data[i].jobHourlyMinPay,
												data[i].minWorkHour)/100;
										var high =accMul(
												data[i].jobHourlyMaxPay,
												data[i].maxWorkHour)/100;
										html += '<p class="price-price"><span>'
												+ accMul(parseInt(low), 100)
												+ '-'
												+ accMul(parseInt(high),100)
												+ '</span> 元/月</p>';
									} else {
										html += '<p class="price-price"><span>'
												+ data[i].jobRegularMinPay
												+ '-'
												+ data[i].jobRegularMaxPay
												+ '</span> 元/月</p>';
									}
									html += '</div></div></a></li>';// </li>';
								}

								if (html != "") {
									ls.length = 0;
									ls.push(html);
									if (typeof (Storage) != "undefined") {
										localStorage.ls = (localStorage.ls || '')
												+ ls.join(' ');
										// 存入
										localStorage.pageNumber = indexNumber;
										if (!localStorage.lsTime) {
											localStorage.lsTime = (new Date())
													.getTime();
										}
									}
								}

								// 添加新条目
								$('#page-index .infinite-scroll #index-joblist').append(
										html);
								lastIndex = $('#index-joblist li').length;

								// 重置加载flag
								loading = false;
							}
						});
	}

	//自动加载更多条目 2019-11-07
	$(".infinite-scroll").on('scroll',function() {
		var scrollTop = $(".infinite-scroll").scrollTop();
		if (scrollTop + $(".infinite-scroll").height() > $(".scroller").height()) {
			if (loading)
				return;
			// 设置flag
			loading = true;
			// 模拟1s的加载过程
			setTimeout(function() {
				if (lastIndex >= maxItems) {
					// 加载完毕，则注销无限加载事件，以防不必要的加载
					// $.detachInfiniteScroll($('#page-index .infinite-scroll'));
					// 删除加载提示符
					$('#page-index .infinite-scroll-preloader').remove();
					return;
				}
				// 添加新条目
				indexNumber++;
				console.log(indexNumber);
				addItems(itemsPerLoad, indexNumber);
				// 更新最后加载的序号
				lastIndex = $('#index-joblist li').length;
				// 容器发生改变,如果是js滚动，需要刷新滚动
				// $.refreshScroller();
			}, 300);
		}
	});

});
// 滚动100 距离 显示返回顶部图标
$(function () {
    var i = 1;
    var t, p = 0;
    var a = 0;
    var flag = true;
    var layerCode = $('#layer-code');
    $("#listContent").on('scroll', function () {
        setCookie("scrollTop", listContent.scrollTop, null);
        if ('ontouchstart' in document && navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1) {
            // 获取banner图片高度
            var bh = $('#today-recommend-job').height();
            // 获取单个Li高度
            var lh = $('#page-index .index-item-list #index-joblist li')[0].offsetHeight;
            var scrollTop = $("#listContent").scrollTop();
            p = scrollTop;
            if (t <= p) {
                if (scrollTop > bh + lh * 3 * i) {
                    i++;
                    a = scrollTop;
                    if (layerCode.length) {
                        layerCode.show();
                    }
                }
            } else {
                if (flag && (scrollTop > bh + lh * 3)) {
                    a = scrollTop;
                    flag = false;
                }
                if (scrollTop <= a - lh * 3) {
                    i--;
                    a = scrollTop;
                    if (layerCode.length) {
                        layerCode.show();
                    }
                }
            }
            setTimeout(function () {
                t = p;
            }, 0);
        }
        if ($("#listContent").scrollTop() > 100) {
            $('#nzjob-home').css('display', 'none');
            $('#back-top').css('display', 'table-cell');
            $('#refer-ad').show();
        } else {
            $('#nzjob-home').css('display', 'table-cell');
            $('#back-top').css('display', 'none');
            $('#refer-ad').hide();
        }
    });
    // 点击回到顶部
    var backTopSpeed = 25;
    var backTopTimer = null;

    function backTop() {
        var oTop = listContent.scrollTop; // 1000
        if (oTop > 0) {
            listContent.scrollTop = oTop - backTopSpeed; // 1000 - 25
        } else {
            clearInterval(backTopTimer);
            $('#nzjob-home').css('display', 'table-cell');
            $('#back-top').css('display', 'none');
        }
    }

    $('#back-top').click(function () {
        backTopTimer = setInterval(backTop, 1);
        document.ontouchstart = function () {
            clearInterval(backTopTimer);
        }
    });
});

// 关闭
$('#layer-code .close').bind('click', function() {
	$('#layer-code').hide();
});

function back() {
	history.back();

}