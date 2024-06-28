var approvalUtils = {

    initqueryApprovalUser: function(id, type) {

        var $approvalDiv = com.focusPage('#' + id).empty();

        com.post(api.approval.queryApproverByType, {
            "approver.type": type
        }, function(res) {

            $.each(res.approvers, function(i, v) {

                var comment = v.comment == null ? "" : v.comment;

                var $div = $('<div></div>').addClass("radio no-padding").attr("style", "margin-bottom:10px").appendTo($approvalDiv);
                var $approvaler = $('<label></label>').appendTo($div);

                var $input = $('<input>').attr({
                    "type": "radio",
                    "name": "form-field-radio",
                    "class": "ace",
                    "uid": v.userBase.uid,
                    "userId": v.userBase.userId
                }).appendTo($approvaler);

                var $span = $('<span></span>').addClass('lbl').appendTo($approvaler);
                var $name = $('<label></label>').attr('style', 'margin-left:10px;').text(v.userBase.currentName).appendTo($span)

                var $comment = $('<span></span>').addClass("lbl").text(comment).attr("style", "margin-left:15px").appendTo($approvaler);
            });
        }, null, false);
    },
    initApprover: function(id, type) {

        var $approvalDiv = com.focusPage('#' + id).empty();

        com.post(api.approval.queryApproverByType, {
            "approver.type": type
        }, function(res) {

            $.each(res.approvers, function(i, v) {

                var comment = v.comment == null ? "" : v.comment;

                var $div = $('<div></div>').addClass("radio no-padding").attr("style", "margin-bottom:10px").appendTo($approvalDiv);
                var $approvaler = $('<label></label>').appendTo($div);

                var $input = $('<input>').attr({
                    "type": "radio",
                    "name": "form-field-radio",
                    "class": "ace",
                    "uid": v.userBase.uid,
                    "userId": v.userBase.userId
                }).appendTo($approvaler);

                var $span = $('<span></span>').addClass('lbl').appendTo($approvaler);
                var $name = $('<label></label>').attr('style', 'margin-left:10px;').text(v.userBase.currentName).appendTo($span)

                var $comment = $('<span></span>').addClass("lbl").text(comment).attr("style", "margin-left:15px").appendTo($approvaler);
            });
        }, null, false);
    },
    addspan: function(px, name, value) {

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
    },

};