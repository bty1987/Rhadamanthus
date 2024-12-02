$(function() {

    var feedback = {

        modals: {
            feedbackDrawingModal: com.focusPage("#feedbackDrawingModal")
        }

    };

    com.popup4photos("#resultList");

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix ');

            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').text(v.type == constant.customer.feedback.STATUS_FEEDBACK_INT ? "反馈" : v.type == constant.customer.feedback.STATUS_COMPLAINT_INT ? "投诉" : "维修"));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $urldiv = $('<div id="photo" style="float: left; border: 1px solid #ccc;"></div>').addClass('divimg').css("width", "75px").css("height", "75px").css("margin-right", "10px").appendTo($liLine);
            var img = $('<img/>');
            var imgA = $('<a></a>').attr("display", "none").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo($urldiv);

            var $drawingedit = $('<a></a>').addClass('btn btn-minier btn-warning').html('图片');

            com.showImg(img, v.picture, 75, 75, '', null, 0);
            
            var $btnView = $("<a></a>").addClass("btn btn-minier btn-yellow").html("记录");
            var $btnbind = $("<a></a>").addClass("btn btn-minier btn-success").html("接收");
            var $btnAddUser = $("<a></a>").addClass("btn btn-minier btn-success").html("完成");
            
            var propertyArr = [["装修单号:", v.orderId, "blue", function(btn) {

                tools.decoration.info(btn, v.orderId);
            }], ["创建时间: ", v.createTime, "green"], ["电话:", v.phone, "grey"], ["类型:", constant.customer().feedback.status.keys[v.type], "red"], ["公司:", v.company, "grey"], ["说明: ", v.content, "grey"], ["接收人: ", v.receiver.userName, "grey"], ["接收时间: ", v.receiveTime, "grey"], ["完成人", v.finisher.userName, "grey"], ["完成时间: ", v.finishTime, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b style="float: right"></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);

                if (value[3]) {
                    $b.click(function() {

                        value[3]($b);
                    });
                }

                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($drawingedit).appendTo($h3);

            $divBtnWrap.append($btnView).append($btnbind).append($btnAddUser).appendTo($h3);

            $drawingedit.click(function() {

                manageDrawing(v.fid);
            });

            $btnbind.click(function() {

                balanceOrder(v.fid);
            });

            $btnAddUser.click(function() {

                finishFeedback(v.fid);
            });

            $btnView.click(function() {

                params.customer.vid = v.fid;

                com.popup4page("#feedBackRecordPopUp", api.index.feedRecord.url, "记录");
            });

            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };
        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(['customer-feedback-orderId', 'customer-feedback-phone', 'customer-feedback-createTime', 'customer-feedback-type', 'customer-feedback-company'], "condList", api.customer.pageFeedback, function(res) {

        displayFunc.init("resultList", res);
    }, "pagenation");

    function manageDrawing(fid) {

        feedback.modals.feedbackDrawingModal.modal("show");

        com.focusPage('#feedbackDrawing').html("");

        com.post(api.customer.queryFeedbackDrawing, {
            "feedback.fid": fid
        }, function(data) {

            var drawings = data.feedbackDrawings;

            for ( var i = 0; i < drawings.length; i++) {
                var drawing = drawings[i];
                addPicture(com.focusPage("#feedbackDrawing"), drawing);
            }

            com.popup4photos("#feedbackDrawing");
        }, null, false);
    }

    function balanceOrder(fid) {

        com.showConfirm("确认要接收吗?", function() {

            var options = {
                "feedback.fid": fid
            };
            com.post(api.customer.receiveFeedback, options, function() {

                com.showAlert(com.info, "接收成功");
            });
        });
    }

    function finishFeedback(fid) {

        com.showConfirm("确认要完成吗?", function() {

            var options = {
                "feedback.fid": fid
            };
            com.post(api.customer.finishFeedback, options, function() {

                com.showAlert(com.info, "完成成功");
            });
        });
    }

    function addPicture(i, v) {

        var $li = $('<li></li>').attr("id", "imgLi_" + v.ddid).appendTo(i);
        var $img = $('<img/>').attr('width', 200).attr('height', 200);
        var $imgA = $('<a></a>').addClass('cboxElement').attr('target', '_blank').append($img).appendTo($li);

        com.showImg($img, v.path, 200, 200, "", null);

        var $tags = $('<div></div>').addClass('tags').appendTo($li);
        var $nameHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $nameInfo = $('<span></span>').addClass('label label-info arrowed').text(v.name).appendTo($nameHolder);
        var $timeHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $timeInfo = $('<span></span>').addClass('label label-danger arrowed').text(v.createTime).appendTo($timeHolder);

    }

});