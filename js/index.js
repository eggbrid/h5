/**
 * Created by Administrator on 2017/8/4.
 */

window.onload = function () {
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        loop: true,
        autoplay: {
            delay: 2000,
            stopOnLastSlide: false,
            disableOnInteraction: true,
        },
        // 如果需要自定义分页器
        pagination: {
            el: ".swiper-pagination",
        },
        observer: true,
        observeParents: true
    });

//	 var popout = window.localStorage.popout;
//	 var url = window.location.href
//	 var customer= $("#customer").val();
//	 var nppStatus= $("#nppStatus").val();
//	 var show = false;  
//	 if (popout == null || popout ==""|| popout == undefined) {// 没有点击过才会弹出
//				show  = true;
//// }
//	}else {
//		 if (popout <= 111) {
//			 show = true;
//		 }
//	}
//	if (show) {
//		if (nppStatus != null && nppStatus != undefined  && nppStatus == "1") {
//			var bath = $("#bath").val();
//				 if (customer == undefined || customer == null || customer == ""){
//					 $(".popbg").attr("src",bath + "/static/images/npp/npp_popout.png");
//				 	}else {
//					 $(".popbg").attr("src",bath + "/static/images/npp/npp_popout_old.png");
//				 	}
//				 window.preventEjectMpQrcode = true;
//				 setTimeout(() => {
//					 		$(".popout-layer").show();
//					 	}, 1000);
//		}
//	}
};

var slide = function (option) {
	var reloadOffset = 200;
    var defaults = {
        container: '',
        next: function () {
        }
    };
    var start, end, length, isLock = false, // 是否锁定整个操作
        isCanDo = false, // 是否移动滑块
        isTouchPad = (/hp-tablet/gi).test(navigator.appVersion), hasTouch = 'ontouchstart' in window
        && !isTouchPad;
    var obj = document.querySelector(option.container);
    var searchBar = document.querySelector(option.searchBar);
    var loading = obj.firstElementChild;
    var offset = loading.clientHeight;
    var objparent = obj.parentElement;
    /* 操作方法 */
    var fn = {
        // 移动容器
        translate: function (diff) {
            obj.style.webkitTransform = 'translate3d(0,' + diff + 'px,0)';
            obj.style.transform = 'translate3d(0,' + diff + 'px,0)';
            searchBar.style.webkitTransform = 'translate3d(0,' + (diff + offset) + 'px,0)';
            searchBar.style.transform = 'translate3d(0,' + (diff + offset) + 'px,0)';
        },
        // 设置效果时间
        setTransition: function (time) {
            obj.style.webkitTransition = 'all ' + time + 's';
            obj.style.transition = 'all ' + time + 's';
            searchBar.style.webkitTransition = 'all ' + time + 's';
            searchBar.style.transition = 'all ' + time + 's';
        },
        // 返回到初始位置
        back: function () {
            fn.translate(0 - offset);
            // 标识操作完成
            isLock = false;
            length = 0;
        },
        addEvent: function (element, event_name, event_fn) {
            if (element.addEventListener) {
                element.addEventListener(event_name, event_fn, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + event_name, event_fn);
            } else {
                element['on' + event_name] = event_fn;
            }
        }
    };

    fn.translate(0 - offset);
    fn.addEvent(obj, 'touchstart', start);
    fn.addEvent(obj, 'touchmove', move);
    fn.addEvent(obj, 'touchend', end);
    fn.addEvent(obj, 'mousedown', start);
    fn.addEvent(obj, 'mousemove', move);
    fn.addEvent(obj, 'mouseup', end);

    // 滑动开始
    function start(e) {
        if (objparent.scrollTop <= 0 && !isLock) {
            var even = typeof event == "undefined" ? e : event;
            // 标识操作进行中
            isLock = true;
            isCanDo = true;
            // 保存当前鼠标Y坐标
            start = hasTouch ? even.touches[0].pageY : even.pageY;
            // 消除滑块动画时间
            fn.setTransition(0);
            $(".loading").text("下拉刷新数据")
        }
        return false;
    }

    // 滑动中
    function move(e) {
        if (objparent.scrollTop <= 0 && isCanDo) {
            var even = typeof event == "undefined" ? e : event;
            // 保存当前鼠标Y坐标
            end = hasTouch ? even.touches[0].pageY : even.pageY;
            if (start < end) {
                even.preventDefault();
                // 消除滑块动画时间
                fn.setTransition(0);
                length = end - start;
                fn.translate((length / 2) - offset);
                if (end - start >= reloadOffset) {
                	 $(".loading").text("松开刷新数据")
                }else {
                	 $(".loading").text("下拉刷新数据")
				}
            }
        }
    }

    // 滑动结束
    function end(e) {
        if (isCanDo) {
        	isCanDo = false;
            // 判断滑动距离是否大于等于指定值
            if (end - start >= reloadOffset) {
                // 设置滑块回弹时间
                fn.setTransition(0.5);
                // 保留提示部分
                fn.translate(0);
                // 执行回调函数
                if (typeof option.next == "function") {
                    $(".loading").text("正在刷新数据···")
                    setTimeout(function () {
                        option.next.call(fn, e);
                        isCanDo = false;
                    }, 500);

                }
            } else {
                // 返回初始状态
            	fn.setTransition(0.5);
                fn.back();
                setTimeout(() => {
                	isCanDo = false;
				}, 500);
            }
        }
    }
}

$(function () {
    slide({
        container: "#container",
        searchBar: "#listSearch",
        next: function (e) {
            // 松手之后执行逻辑,ajax请求数据，数据返回后隐藏加载中提示
            var that = this;
            setTimeout(function () {
                that.back.call();
                location.href = location.href;
            }, 500);
        }
    });
});

function goTag(tagId) {
	 location.href = '/tag?tagId='+tagId;
}

function followWX() {
    location.href = "follow";
}

function goMessageList() {
    location.href = "messageList";
}

// 点击跳转jobDetail
function getJobDetails(jobId) {
    var bath = $("#bath").val();
    window.location.href = bath + "/jobDetail?jobId=" + jobId + "&url="
        + encodeURI(window.location.href);
}


function goRefer() {
    location.href = "/goReferFriend?loginImg=loginImg_steward_recommend";
}


function goMediaJob() {
    location.href = "/mediationJob";
}

function goVIP() {
    location.href = "/myCardTicket";
}

function goMyJob() {
    location.href = "/getJobApplys";
}

// 获取用户注册了多少天
function getUserAccountLife() {
    $.ajax({
        url: "/registerDays",
        type: "post",
        async: false,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (res) {
            if (res.response == "success") {
                var day = res.data;
                console.log(day);
            }
        },
        error: function (e) {
        }
    })


}

function hidePopout() {
    window.preventEjectMpQrcode = false;
    var popout = window.localStorage.popout;
    if (popout == null || popout == "" || popout == undefined) {
        popout = 0;
    }
    popout += 1;
    console.log("popout:" + popout)
    window.localStorage.popout = popout;
    $(".popout-layer").removeClass("popout-fade-in");
    $(".popout-layer").addClass("popout-fade-out");
    setTimeout(function () {
        $(".popout-layer").hide();
    }, 600); // 必须要跟css动画duration一致，否则会出现页面跳动
}


var dynamicPageNumber = 1;
var dynamicPageSize = 10;
var dynamicIndex = 0;
var dynamicPageTotalElements = 0;
var dynamicTotalPages = 1;

function getIndexDynamic() {
    $.post('/indexDynamic', {pageNumber: dynamicPageNumber, pageSize: dynamicPageSize}, function (data) {
        if (data.response == 'success') {
            console.log(data)
            if (data.data.applyPage.content.length || data.data.entryPage.content.length) {
                dynamicIndex = 0;
                dynamicPageTotalElements = data.data.applyPage.content.length + data.data.entryPage.content.length + data.data.subsidyPage.content.length;
                dynamicTotalPages = data.data.applyPage.totalPages + data.data.entryPage.totalPages + data.data.subsidyPage.totalPages;

                var html = '';
                var i = 0;
                for (; i < data.data.applyPage.content.length && i < data.data.entryPage.content.length && i < data.data.subsidyPage.content.length; i++) {
                    html += '<div><span>报名</span>会员' + data.data.applyPage.content[i].username + '刚刚报名了' + data.data.applyPage.content[i].value + '岗位</div>';
                    html += '<div><span>入职</span>会员' + data.data.entryPage.content[i].username + '入职了' + data.data.applyPage.content[i].value + '岗位</div>';
                    html += '<div><span>补贴</span>会员' + data.data.subsidyPage.content[i].username + '拿到了' + data.data.subsidyPage.content[i].value + '元补贴</div>';
                }

                var minLength = Math.min(data.data.applyPage.content.length, data.data.entryPage.content.length, data.data.subsidyPage.content.length);

                if (minLength == data.data.applyPage.content.length) {
                    for (; i < data.data.entryPage.content.length && i < data.data.subsidyPage.content.length; i++) {
                        html += '<div><span>入职</span>会员' + data.data.entryPage.content[i].username + '入职了' + data.data.applyPage.content[i].value + '岗位</div>';
                        html += '<div><span>补贴</span>会员' + data.data.subsidyPage.content[i].username + '拿到了' + data.data.subsidyPage.content[i].value + '元补贴</div>';
                    }
                } else if (minLength == data.data.entryPage.content.length) {
                    for (; i < data.data.applyPage.content.length && i < data.data.subsidyPage.content.length; i++) {
                        html += '<div><span>报名</span>会员' + data.data.applyPage.content[i].username + '刚刚报名了' + data.data.applyPage.content[i].value + '岗位</div>';
                        html += '<div><span>补贴</span>会员' + data.data.subsidyPage.content[i].username + '拿到了' + data.data.subsidyPage.content[i].value + '元补贴</div>';
                    }
                } else {
                    for (; i < data.data.applyPage.content.length && i < data.data.entryPage.content.length; i++) {
                        html += '<div><span>报名</span>会员' + data.data.applyPage.content[i].username + '刚刚报名了' + data.data.applyPage.content[i].value + '岗位</div>';
                        html += '<div><span>入职</span>会员' + data.data.entryPage.content[i].username + '入职了' + data.data.applyPage.content[i].value + '岗位</div>';
                    }
                }


                for (var j = i; j < data.data.applyPage.content.length; j++) {
                    html += '<div><span>报名</span>会员' + data.data.applyPage.content[j].username + '刚刚报名了' + data.data.applyPage.content[j].value + '岗位</div>';
                }

                for (var j = i; j < data.data.entryPage.content.length; j++) {
                    html += '<div><span>入职</span>会员' + data.data.entryPage.content[j].username + '入职了' + data.data.entryPage.content[j].value + '岗位</div>';
                }

                for (var j = i; j < data.data.subsidyPage.content.length; j++) {
                    html += '<div><span>补贴</span>会员' + data.data.subsidyPage.content[j].username + '拿到了' + data.data.subsidyPage.content[j].value + '元补贴</div>';
                }

                $('.index-dynamic-text').html(html);
                $('.index-dynamic').attr('display', 'flex');

                playDynamic();
            } else {
                dynamicIndex = 0;
                dynamicPageTotalElements = 0;
                dynamicTotalPages = 1;
                if (dynamicPageNumber > 1) {
                    dynamicPageNumber = 1;
                } else {
                    $('.index-dynamic').hide();
                }
            }
        }
    }, 'json');
}

function playDynamic() {
    if (dynamicIndex > dynamicPageTotalElements - 1) {
        dynamicPageNumber ++;
        if (dynamicPageNumber > dynamicTotalPages) {
            dynamicPageNumber = 1;
        }
        getIndexDynamic();
        return;
    }

    if (dynamicIndex == 0) {
        $('.index-dynamic-text div').css('top', '0');
    } else {
        $('.index-dynamic-text div').animate({
            'top': (dynamicIndex * -2) + 'rem'
        }, 500);
    }
    dynamicIndex ++;

    setTimeout(function () {
        playDynamic();
    }, 3000);
}

$(function () {
    getIndexDynamic();
});

