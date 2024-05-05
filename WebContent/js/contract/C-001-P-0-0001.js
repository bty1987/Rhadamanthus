/**
 * 合同html/js文件命名说明: C-<company>-<module>-<type>-<index>.html C-<公司/模式>-<业务类型>-<合同类型>-<序号>.html
 * 
 * 公司/模式: 001 (方林/半包) 002 (1918/大宅) 003 (宜家/半包/整装) 004 (爱林/整装) 005 (恩林/局改/二改)
 * 
 * 业务类型: D (装修) M (主材) P (人事)
 * 
 * 合同类型: 0 (工程) 1 (设计费) 2 (主材代购) 3 (服务费)
 * 
 * 举例: C-001-D-3-0001.html 方林装修服务费相关合同 C-005-D-0-0001.html 恩林装修工程相关合同
 * 
 * 此文件为: 方林人事合同
 */

jQuery(function($) {

    var contractEdit = {

        cover: {},

        modal: {},

        item: {},

        contractArgs: params.personel.contractargs,
        uid: params.personel.uid,

        current: new Date(),
    };

    if (contractEdit.contractArgs.type == "1") {
        com.focusPage(".undispatch", "#form").hide();
    }

    if (contractEdit.contractArgs.type != "1") {
        com.focusPage(".dispatch", "#form").hide();
    }

    com.datetime(com.focusPage("#cov-sign-data"));
    com.datetime(com.focusPage("#con-sign-data"));
    com.datetime(com.focusPage("#sign-sign-data"));
    com.datetime(com.focusPage("#sign-sign-data1"));
    com.datetime(com.focusPage("#con-work-start-date"));
    com.datetime(com.focusPage("#con-term-start-date"));
    com.datetime(com.focusPage("#con-term-end-date"));
    com.datetime(com.focusPage("#con-probation-start-date"));
    com.datetime(com.focusPage("#con-probation-end-date"));
    com.datetime(com.focusPage("#con-dispatch-start-date"));
    com.datetime(com.focusPage("#con-dispatch-end-date"));
    com.datetime(com.focusPage("#con-salary-date"), "day");

    com.post(api.common.current, {}, function(res) {

        contractEdit.current = new Date(res.current);
    }, null, false);

    com.post(api.personel.queryUserInfoByUserId, {
        "userInfo.user.userId": params.personel.userId
    }, function(res) {

        var userInfo = res.userInfo;
        var user = userInfo.user;

        com.focusPage("#con-user-name", "#form").val(user.currentName);
        com.focusPage("#con-user-gender", "#form").val(user.gender);
        com.focusPage("#con-user-ident", "#form").val(user.identity);
        com.focusPage("#con-user-phone", "#form").val(user.phone);
        com.focusPage("#con-duty", "#form").val(user.duty.name);
        com.focusPage("#con-user-addr", "#form").val(userInfo.address);
        com.focusPage("#con-company-name", "#form").val(user.companys);

        contractEdit.user = user;

        contractEdit.cover["cov-user-name"] = user.currentName;
        contractEdit.cover["con-user-householdType"] = userInfo.householdType == 1 ? '非农业' : '农业';

    });

    com.focusPage("#preservation").unbind().on('click', function() {

        if (com.validate('form'))
            return false;

        com.showConfirm("请仔细认真检查合同填写内容", function() {

            var conitems = com.focusPage(".conitem:visible", "#form");

            var data = {};

            $.each(conitems, function(i, e) {

                var content = $(e);
                data[content.attr("id")] = content.val();
            });

            data = $.extend({}, data, contractEdit.cover);

            data["cov-sign-year"] = com.focusPage("#cov-sign-data").val().substr(0, 4);
            data["cov-sign-month"] = com.focusPage("#cov-sign-data").val().substr(5, 2);
            data["cov-sign-day"] = com.focusPage("#cov-sign-data").val().substr(8, 2);
            data["con-sign-year"] = com.focusPage("#con-sign-data").val().substr(0, 4);
            data["con-sign-month"] = com.focusPage("#con-sign-data").val().substr(5, 2);
            data["con-sign-day"] = com.focusPage("#con-sign-data").val().substr(8, 2);
            data["sin-sign-year"] = com.focusPage("#sign-sign-data").val().substr(0, 4);
            data["sin-sign-month"] = com.focusPage("#sign-sign-data").val().substr(5, 2);
            data["sin-sign-day"] = com.focusPage("#sign-sign-data").val().substr(8, 2);
            data["sin-sign-year1"] = com.focusPage("#sign-sign-data1").val().substr(0, 4);
            data["sin-sign-month1"] = com.focusPage("#sign-sign-data1").val().substr(5, 2);
            data["sin-sign-day1"] = com.focusPage("#sign-sign-data1").val().substr(8, 2);

            data["con-work-year"] = com.focusPage("#con-work-start-date").val().substr(0, 4);
            data["con-work-month"] = com.focusPage("#con-work-start-date").val().substr(5, 2);
            data["con-work-day"] = com.focusPage("#con-work-start-date").val().substr(8, 2);
            data["con-start-year"] = com.focusPage("#con-term-start-date").val().substr(0, 4);
            data["con-start-month"] = com.focusPage("#con-term-start-date").val().substr(5, 2);
            data["con-start-day"] = com.focusPage("#con-term-start-date").val().substr(8, 2);
            data["con-end-year"] = com.focusPage("#con-term-end-date").val().substr(0, 4);
            data["con-end-month"] = com.focusPage("#con-term-end-date").val().substr(5, 2);
            data["con-end-day"] = com.focusPage("#con-term-end-date").val().substr(8, 2);
            data["con-start-year1"] = com.focusPage("#con-probation-start-date").val().substr(0, 4);
            data["con-start-month1"] = com.focusPage("#con-probation-start-date").val().substr(5, 2);
            data["con-start-day1"] = com.focusPage("#con-probation-start-date").val().substr(8, 2);
            data["con-end-year1"] = com.focusPage("#con-probation-end-date").val().substr(0, 4);
            data["con-end-month1"] = com.focusPage("#con-probation-end-date").val().substr(5, 2);
            data["con-end-day1"] = com.focusPage("#con-probation-end-date").val().substr(8, 2);
            data["con-start-year2"] = com.focusPage("#con-dispatch-start-date").val().substr(0, 4);
            data["con-start-month2"] = com.focusPage("#con-dispatch-start-date").val().substr(5, 2);
            data["con-start-day2"] = com.focusPage("#con-dispatch-start-date").val().substr(8, 2);
            data["con-end-year2"] = com.focusPage("#con-dispatch-end-date").val().substr(0, 4);
            data["con-end-month2"] = com.focusPage("#con-dispatch-end-date").val().substr(5, 2);
            data["con-end-day2"] = com.focusPage("#con-dispatch-end-date").val().substr(8, 2);

            if (contractEdit.contractArgs.type != "1") {
                delete data["con-start-year2"];
                delete data["con-start-month2"];
                delete data["con-start-day2"];
                delete data["con-end-year2"];
                delete data["con-end-month2"];
                delete data["con-end-day2"];
                delete data["con-company-addr"];
                delete data["con-company-name"];
            }

            var options = {
                "userContract.uid": contractEdit.uid,
                "contract.cid": params.personel.contractargs.cid,
                "data": JSON.stringify(data),
                "contract.no": params.personel.contractargs.no,
                "contract.name": params.personel.contractargs.name,
                "contract.title": params.personel.contractargs.title,
            };

            console.log(options);

            var popup = com.focusPage("#popup-page");
            var target = com.focusPage("#layerPopUp");

            var mask = $("<div></div>").addClass("tab-mask").appendTo(popup);
            var maskh1 = $("<h1></h1>").css({
                "position": "absolute",
                "top": "30%",
                "left": "45%"
            }).appendTo(mask);
            var maskicon = $("<i></i>").addClass("icon-spinner icon-spin bigger-450").appendTo(maskh1);

            mask.css("top", target.height() - mask.height() + 30);
            popup.css("overflow", "hidden");

            com.post(api.personel.addUserContract, options, function(res) {

                com.closePopup();
            }, function(res) {

                com.showAlert(com.error, res.errorMsg);

                mask.remove();
                popup.css("overflow", "");
            });
        });
    });

});