$(function(){
    var bath = $("#bath").val(); // 获取bath 值

    // 点击标签
    $('#tag-list .tag-list-items').on('click','li',function(){
        location.href = '/tag?tagId='+this.dataset.tagId;
    });

    // 点击搜索
    $(document).on('click','.searchbar-cancel', function () {
        var search = $('#search').val();
        if(search.trim()) {
            $('#tag-list').hide();
            loaddata(search);
        }
    });

    // 输入事件
    var autoSearch = null;
    $('#search').on('input',function () {
        clearTimeout(autoSearch);
        if ($("#search").val().trim()) {
            $('#tag-list').hide();
            $('#page-search .infinite-scroll .index-items').html('');
        } else {
            $('#tag-list').show();
            $('#page-search .infinite-scroll .index-items').html('');
            return;
        }
        autoSearch = setTimeout(function() { loaddata(); }, 500);
    });

    // 加载数据
    function loaddata(val) {
        $.ajax({
            type : 'post',
            url : bath+'/search',
            dataType : 'json',
            data : {
                query: val || $("#search").val()
            },
            beforeSend : function() {
                $('#page-search .infinite-scroll .index-items').html('');
                $('#page-search .infinite-scroll-preloader').show();
            },
            success : function (data) {
                if(data.response === "success") {
                    $('#page-search .infinite-scroll-preloader').hide();
                    var data = data.data.result;
                    var html = '';
                    var tagTextList = '';
                    if(!data.length) {
                        $('#page-search .infinite-scroll .index-items').html('<li style="text-align: center;line-height: 2rem;">没有搜索到岗位</li>');
                        return;
                    }
                    for (var i = 0, len = data.length; i < len; i ++){
                        var currentClass = '';
                        var tagHtml = '';
                        if(data[i].setTop < 0) {
                            // 停招岗位
                            currentClass = 'stop-mark';
                        }else {
                            // 非停招岗位
                            currentClass = 'hot-mark';
                        }
                        html+='<li><a href="/jobDetail?jobId='+data[i].jobId+'" class="item-link external item-content" style="padding-left:0rem;">';
                        if(typeof (data[i].imageCosSourceUrl)== "undefined"){
                            html+='<div class="item-image"><img src="'+bath+'/static/images/jobJpg.jpg" width="100%">';
                            html+='</div>';
                        }else {
                            html+='<div class="item-image"><img src="'+(data[i].imageCosSourceUrl.replace("http://niuzhigongzuo-1251799515.cossh.myqcloud.com", "https://cos.niuzhigongzuo.com"))+'" width="100%">';
                            html+='</div>';
                        }
                        html+='<div class="item-inner noneImges">';
                        if (data[i].jobType == 0){
                            if(currentClass==="stop-mark") {
                                html += '<div class="item-amount"><p class="'+currentClass+'">已停招</p><p>' + data[i].jobHourlyMaxPay + '元/小时</p></div>';
                            }else {
                                html += '<div class="item-amount"><p class="'+currentClass+'">工价</p><p>' + data[i].jobHourlyMaxPay + '元/小时</p></div>';
                            }
                        }
                        else {
                            var index_x = 0;
                            for (var j = 0; data[i].returnFees && j < data[i].returnFees.length; j++) {
                                if (data[i].returnFees[j].returnFeeFlag == 1) {
                                    if (index_x == 0) {
                                        index_x = 1;
                                        var hourReturnFee = 0.0;
                                        var monthReturnFee = 0.0;
                                        var returnFeeMan = 0.0;
                                        var returnFeeWoman = 0.0;
                                        for (var k = 0; data[i].returnFees[j].returnFeeDetails && k < data[i].returnFees[j].returnFeeDetails.length; k++) {
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
                                                if(currentClass==="stop-mark") {
                                                    html += '<div class="item-amount"><p class="'+currentClass+'">已停招</p><p>' + hourReturnFee + '元/小时</p></div>';
                                                }else {
                                                    html += '<div class="item-amount"><p class="'+currentClass+'">补贴</p><p>' + hourReturnFee + '元/小时</p></div>';
                                                }
                                            }
                                        } else if (data[i].returnFees[j].returnFeeType == 1) {
                                            var _f = returnFeeMan;
                                            if (returnFeeWoman > _f) {
                                                _f = returnFeeWoman;
                                            }
                                            if (_f > 0) {
                                                if(currentClass==="stop-mark") {
                                                    html += '<div class="item-amount"><p class="'+currentClass+'">已停招</p><p>' + _f + '元</p></div>';
                                                }else {
                                                    html += '<div class="item-amount"><p class="'+currentClass+'">补贴</p><p>' + _f + '元</p></div>';
                                                }
                                            }
                                        } else {
                                            if (monthReturnFee > 0) {
                                                if(currentClass==="stop-mark") {
                                                    html += '<div class="item-amount"><p class="'+currentClass+'">已停招</p><p>补' + monthReturnFee + '元/月</p></div>';
                                                }else {
                                                    html += '<div class="item-amount"><p class="'+currentClass+'">补贴</p><p>补' + monthReturnFee + '元/月</p></div>';
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        html += '<div class="item-price-row"><p class="item-number index-item-title text-filter" title="' + data[i].jobName + '">' + data[i].jobName.substr(0,10) + '</p></div>';

                        if (data[i].tagTextListStr){
                            tagTextList = data[i].tagTextListStr.split(',');
                            for(var y=0;y<tagTextList.length;y++) {
                                tagHtml+='<span>'+tagTextList[y]+'</span>';
                            }
                            html += '<p class="index-item-subtitle" style="color: #3f3f3f">'+(tagHtml||'&nbsp;')+'</p>';
                        } else {
                            html += '<p class="index-item-subtitle" style="color: #3f3f3f">&nbsp;</p>';
                        }
                        html+='<div class="item-price-row">';
                        if(data[i].jobType == "0"){
                            html+='<p class="price-price"><span>' + accMul(data[i].jobHourlyMinPay, data[i].minWorkHour) + '-'  + accMul(data[i].jobHourlyMaxPay, data[i].maxWorkHour) + '</span> 元/月</p>';
                        }else{
                            html+='<p class="price-price"><span>' + data[i].jobRegularMinPay + '-'  + data[i].jobRegularMaxPay + '</span> 元/月</p>';
                        }
                        html+='</div></div></a></li>';//</li>';
                    }
                    // 添加新条目
                    $('#page-search .infinite-scroll .index-items').html(html);
                }
            }
        });
    }
});