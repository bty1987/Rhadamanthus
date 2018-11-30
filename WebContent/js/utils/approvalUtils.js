	var approvalUtils = {
        initqueryApprovalUser: function (id, type) {
            var $approvalDiv = com.focusPage('#' + id);
            $approvalDiv.empty();
            com.post(api.approval.queryApproverByType, {"approver.type": type}, function (res) {
                for (var i = 0; i < res.approvalUsers.length; i++) {
                    var $approvaler = $('<label></label>');
                    var $div = $('<div></div>').addClass("radio no-padding").attr("style", "margin-bottom:10px");
                    var $input = $('<input>').attr({
                        "type": "radio",
                        "name": "form-field-radio",
                        "class": "ace",
                        "uid": res.approvalUsers[i].userBase.uid,
                        "userId": res.approvalUsers[i].userBase.userId
                    });
                    var $span = $('<span></span>').addClass('lbl').html($('<label></label>').attr('style', 'display:inline-block;width:47px;text-align-last:justify;margin-left:10px;padding:0px').text(res.approvalUsers[i].userBase.currentName));
                    var $comment = $('<span></span>').addClass("lbl").text(res.approvalUsers[i].comment == null ? " " : res.approvalUsers[i].comment).attr("style", "margin-left:15px");
                    $input.appendTo($approvaler);
                    $span.appendTo($approvaler);
                    $comment.appendTo($approvaler);
                    $approvaler.appendTo($div);
                    $div.appendTo($approvalDiv);
                }
            });
        },
        addspan: function (px, name, value) {
            var $10pxdiv = $('<div></div>').css({
                'display': 'inline-block',
                'margin-left': '10px'
            });
            var $40pxdiv = $('<div></div>').css({
                'display': 'inline-block',
                'margin-left': '40px'
            });
            var $nameSpan = $('<b></b>').html(name);
            var $valueSpan = $('<span></span>').text(value);

            if (px == '40') {
                return $40pxdiv.append($nameSpan).append($valueSpan);
            } else if (px == '10') {
                return $10pxdiv.append($nameSpan).append($valueSpan);
            } else if (px == '0') {
                return $10pxdiv.append($('<h3></h3>').html(value));
            }
        }
    };