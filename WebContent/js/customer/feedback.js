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

            var propertyArr = [["装修单号:", v.orderId, "blue"], ["创建时间: ", v.createTime, "green"], ["电话:", v.phone, "grey"], ["类型:", constant.customer().feedback.status.keys[v.type], "red"], ["公司:", v.company, "grey"], ["说明: ", v.content, "grey"], ];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b style="float: right"></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($drawingedit).appendTo($h3);

            $drawingedit.click(function() {
                manageDrawing(v.fid);
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

    searcher.init(['customer-feedback-orderId', 'customer-feedback-phone', 'customer-feedback-createTime', 'customer-feedback-type'], "condList", api.customer.pageFeedback, function(res) {
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