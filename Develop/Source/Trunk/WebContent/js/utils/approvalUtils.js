	var approvalUtils = {
        initqueryApprovalUser : function (id, type){
        var $approvalDiv = $('#' + id);
        $approvalDiv.empty();
        com.post(api.approval.queryApproveUserByType, {"approveUser.type": type}, function (res) {
            for (var i = 0; i < res.approvalUsers.length; i++) {
                var $approvaler = $('<label></label>');
                var $div = $('<div></div>').addClass("radio no-padding").attr("style", "margin-bottom:10px");
                var $input = $('<input>').attr({
                    "type": "radio",
                    "name": "form-field-radio",
                    "class": "ace",
                    "uid": res.approvalUsers[i].user.uid,
                    "userId": res.approvalUsers[i].user.userId
                });
                var $span = $('<span></span>').addClass('lbl').html($('<label></label>').attr('style', 'display:inline-block;width:47px;text-align-last:justify;margin-left:10px').text(res.approvalUsers[i].user.currentName));
                var $comment = $('<span></span>').addClass("lbl").text(res.approvalUsers[i].comment == null ? " " : res.approvalUsers[i].comment).attr("style", "margin-left:15px");
                $input.appendTo($approvaler);
                $span.appendTo($approvaler);
                $comment.appendTo($approvaler);
                $approvaler.appendTo($div);
                $div.appendTo($approvalDiv);
            }
        });
    }
    }