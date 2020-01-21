(function () {
    if(!$('#customer').val())return;
    var $serviceCenter = $("#service-center");
    var $user = $('#user');
    var $bindSubsidyCard = $('.bind-subsidy-card');
    var $bindJob = $('.bind-job');
    var $bindSubsidy = $('.bind-subsidy');
    var $myAnswerTips = $(".my-answer-tips");
    $.ajax({
        url : '/tips',
        type : 'post',
        dataType : 'json',
        success : function (data) {
            if(data.response==="success") {
                if (data.data.bindBankTips === 1 || data.data.shareTips >= 1 || data.data.subsidyTips === 1 || data.data.realnameVerifyStatus != 1) {
                    $user.append('<span class="badge"></span>');
                    if ($bindSubsidyCard.length && data.data.bindBankTips === 1) {
                        $bindSubsidyCard.append('<span></span>');
                    }
                    if ($bindJob.length && data.data.shareTips >= 1) {
                        $bindJob.append('<span></span>');
                    }
                }
                if (data.data.subsidyTips === 1 && $bindSubsidy.length) {
                    $bindSubsidy.append('<span></span>');
                }

                if (data.data.unratedTips > 0 && $serviceCenter.length) {
                    $serviceCenter.append('<span class="badge unrate-tips">' + data.data.unratedTips + '</span>');
                }
                if (data.data.unreadReplyCount > 0 && $myAnswerTips.length) {
                    $myAnswerTips.html(data.data.unreadReplyCount);
                    $myAnswerTips.removeClass("nz-hide");
                } else {
                    $myAnswerTips.html("");
                    $myAnswerTips.addClass("nz-hide");
                }
            }

        }
    });
}());