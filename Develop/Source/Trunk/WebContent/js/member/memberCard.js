jQuery(function ($) {

    var memberCard = {

        saveBtn: $("#saveBtn").on("click", saveData),
        turnPointsBtn: $('#turnPointsBtn').on("click", turnPoints),
        cancelBtn: $("#cancelBtn").on("click", empty),
        turnPointsCancelBtn: $('#turnPointsCancelBtn').on("click", empty),
        modal: $("#memberModal").on("show.bs.modal", function (a) {
            com.clearValidator()
        }),

        turnPoints: $("#turnPointsModal").on("show.bs.modal", function (a) {
            com.clearValidator()
        }),

        items: {
            $mcid: null,
            $pid: null,
            $no: null,
            $credits:null,
            $type: $('#type'),
            $subtype: $('#subtype'),
            $credit: $('#credit'),
            $comment: $('#comment'),
            $inNo: $('#cardId'),
            $turnPointsCredit: $('#turnPointsCredit')
        },

    };

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html('会员卡'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $btnDetails = $('<a></a>').addClass('btn btn-minier btn-info').html('明细');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-danger').html('新增');
            var $btnTurnPoints = $('<a></a>').addClass('btn btn-minier btn-success').html('转积分');

            var propertyArr = [

                ["会员卡号: ", v.no, "red"],
                ["订单编号: ", v.orderId, "grey"],
                ["会员积分: ", v.credits + "分", "red"],
                ["创建时间: ", v.createTime, "red"]

            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            $divBtnWrap.append($btnEdit).append($btnDetails).append($btnTurnPoints).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnDetails.click(function () {
                com.switchPage('views/member/memberDetail.html');
                params["mcId"] = v.mcId;
                params["orderId"] = v.orderId;
                return false;
            });

            $btnEdit.click(function () {
                memberCard.items.$mcid = v.mcId;
                memberCard.items.$pid = v.orderId;
                dialogPayment();
            });

            $btnTurnPoints.click(function () {
                memberCard.items.$no = v.no;
                memberCard.items.$credits = v.credits;
                dialogTurnPoints();
            });


            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();
    var _condArr = ['versionNumber', 'versionCreateTime'];
    searcher.init(_condArr, "condList", api.member.pageMemberCard, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "memberCardPostData", null, false, null, null);


    //会员积分编辑弹窗
    function dialogPayment() {

        memberCard.modal.modal("show");

    }

    //会员积分转换弹窗
    function dialogTurnPoints() {

        memberCard.turnPoints.modal("show");

    }

    function saveData() {
        if (com.validate("memberModal")) {
            return false
        } else {
            var option = {
                "memberDetail.memberCard.mcId": memberCard.items.$mcid,
                "memberDetail.pid": memberCard.items.$pid,
                "memberDetail.type": memberCard.items.$type.val(),
                "memberDetail.subType": memberCard.items.$subtype.val(),
                "memberDetail.credit": memberCard.items.$credit.val(),
                "memberDetail.comment": memberCard.items.$comment.val(),
            };
            com.post(api.member.addMemberDetail, option, function () {
                com.showAlert(com.info, '添加成功');
                searcher.doSearch();
                empty();
            });
            memberCard.modal.modal("hide");
        }
    }

    function turnPoints() {
        if (com.validate("turnPointsModal")) {
            return false
        } else {
            var option = {
                "outMemberCard.no": memberCard.items.$no,
                "inMemberCard.no": memberCard.items.$inNo.val(),
                "memberDetail.credit": memberCard.items.$turnPointsCredit.val(),
            };

            //转出分数验证只能输入数字
            var reg = /^[0-9]*$/;
            if(reg.test($("#turnPointsCredit").val()) != true){
                com.showAlert(com.error, "转出分数只能为数字");
                return false;
            }
            if($("#turnPointsCredit").val() == null || $("#turnPointsCredit").val() == ""){
                com.showAlert(com.error, "转出分数不能为空");
                return false;
            }

            if (memberCard.items.$turnPointsCredit.val() > memberCard.items.$credits ) {
                com.showAlert(com.error, "转出分数不能大于该卡剩余分数");
                return false;
            }

            com.post(api.member.turnPointsForMemberCard, option, function () {
                com.showAlert(com.info, '添加成功');
                searcher.doSearch();
                empty();
            });
            memberCard.turnPoints.modal("hide");
        }
    }

    function empty() {
        memberCard.items.$credit.val("");
        memberCard.items.$comment.val("");
        memberCard.items.$inNo.val("");
        memberCard.items.$turnPointsCredit.val("");
    }


});
