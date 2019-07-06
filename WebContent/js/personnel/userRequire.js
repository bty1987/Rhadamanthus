$(function () {
// 定义全局变量 json
    var userRequire = {
        status: [],
        saveBtn: com.focusPage("#addplanBtn").on("click", saveData),// 绑定事件
        cancelBtn: com.focusPage("#cancelplanBtn"),//取消
        modal: com.focusPage("#addplanModal"),//添加
        userRequireItems: {},
        userRequireItem:{}
    };

    userRequire.userRequireItems.backVisitContent = com.focusPage("#backVisitContent");//需求内容
    userRequire.userRequireItem.type = com.focusPage("#type");//类型
    userRequire.userRequireItem.status = com.focusPage("status");//状态

    userRequire.modal.on('hide.bs.modal', function (e) {
        com.cleanItems(userRequire.userRequireItems);
        com.closeTip();
    });

    //画列表
    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();

            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {   // 页面中的一条数据

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.creater.userName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDown = $('<a></a>').addClass('btn btn-minier btn-yellow').html('通过');
            var errlog = $('<a></a>').addClass('btn btn-minier btn-danger').html('拒绝');
            var $btncancel = $('<a></a>').addClass('btn btn-minier btn-warning').html('完成');

            var status = {
                "0": "初始",
                "1": "通过",
                "2": "拒绝",
                "3": "完成"
            };

            var type = {
                "0": "招聘",
                "1": "培训",
            };

            var propertyArr = [
                ["创建人:", v.creater.userName, "grey"],
                ["归属部门:", v.dept.name, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["接收人:", v.receiveId.currentName, "grey"],
                ["需求内容:", v.content != null ? v.content : "---", "grey"],
                ["审批时间:", v.approveTime != null ? v.approveTime : "---", "green"],
                ["完成时间:", v.finishTime != null ? v.finishTime : "---", "green"],
                ["状态:", status[v.status], "red"],
                ["类型:", type[v.type], "red"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDown).appendTo($h3);//通过按钮
            $divBtnWrap.append(errlog).appendTo($h3);//拒绝按钮
            $divBtnWrap.append($btncancel).appendTo($h3);//完成按钮

            $liLine.append($h3).append($ulProperty);

            //审批通过
            $btnDown.click(function () {
                currency(v);
            });

            //审批拒绝
            errlog.click(function () {
                refuse(v);
            });

            //审批完成
            $btncancel.click(function () {
                complete(v);
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html("");
                renderList(tableId, listData);
            }
        };
    })();

    var seacher = new Searcher();

    seacher.init([], "condList", api.personel.PageUserRequire, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "userRequirePostData_test_", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addplan').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('[name="addplan"]', '#pagenation').on("click", function () {  // 选择器 [属性名="属性值"] 匿名函数
        userRequire.modal.modal("show");
    });

    // 保存
    function saveData() {

        var options = {
            "userRequire.content": com.focusPage("#backVisitContent").val(),
            "userRequire.type": com.focusPage("#type").val(),
        };

        com.post(api.personel.addUserRequire, options, function (res) {
            com.showAlert(com.info, "创建成功!");
            userRequire.modal.modal("hide");
            seacher.doSearch();
        });
    }

    //取消
    com.focusPage("#cancelplanBtn").on("click",function () {
        com.cleanItems(userRequire.userRequireItems);
    });

    //通过
    function currency(v) {

    	com.showConfirm("是否确认通过审批?", function(result){
            var options = {
                "userRequire.urid": v.urid,
             };
            com.post(api.personel.approveUserRequire, options, function (res) {
            	com.showAlert(com.info, "审批通过!");
            	userRequire.modal.modal("hide");
            	seacher.doSearch();
            });
        });
    }

    //拒绝
    function refuse(v) {

    	com.showConfirm("是否确认拒绝审批?", function(result){
            var options = {
               "userRequire.urid": v.urid,
            };
            com.post(api.personel.refuseUserRequire, options, function (res) {
                com.showAlert(com.info, "审批拒绝!");
                userRequire.modal.modal("hide");
                seacher.doSearch();
             });
        });
    }

    //完成
    function complete(v) {

    	com.showConfirm("是否确认完成审批?", function(result){
                var options = {
                    "userRequire.urid": v.urid,
                };
                com.post(api.personel.finishUserRequire, options, function (res) {

                    com.showAlert(com.info, "审批完成!");
                    userRequire.modal.modal("hide");
                    seacher.doSearch();
                });
        });
    }
});
