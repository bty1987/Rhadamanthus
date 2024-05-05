$(function() {

    var complaint = {

        btns: {
            addConfirmBtn: com.focusPage('#addConfirmBtn'),
            editConfirmBtn: com.focusPage('#editConfirmBtn'),
            backBtn: com.focusPage('#backBtn'),
            addComplaint: com.focusPage('#addComplaint')
        },

        modals: {
            addItemModal: com.focusPage("#addItemModal"),
            editItemModal: com.focusPage("#editItemModal"),
            complackItemModal: com.focusPage("#complackItemModal"),
        },

        items: {
            type: com.focusPage("#type"),
            deptName: com.focusPage('#deptName'),
            staffName: com.focusPage("#staffName"),
            brandName: com.focusPage('#brandName'),
            content: com.focusPage("#content")
        },

        complackItems: {
            comment: com.focusPage("#comment")
        },

        cid: params.customer.aid,
        ctid: null,
        complaintType: {},
        complaintStatus: {},
        uid: null,
        did: null,
        bid: null,
        editFlg: true
    };

    complaint.btns.addConfirmBtn.bindClick(saveData);
    complaint.btns.editConfirmBtn.bindClick(trackComplack);

    complaint.btns.addComplaint.click(function() {

        complaint.modals.addItemModal.modal("show");
    });

    complaint.modals.addItemModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(complaint.items);
    });

    complaint.modals.editItemModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(complaint.complackItems);
    });

    complaint.items.type.bindData(constant.customer().complaint.type.datas, "key", "value");

    com.initTypeahead("staffName", api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'userBases', 'uid', 'currentName', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.uid == k) {
                complaint.uid = val.uid;
                complaint.did = val.dept.did;
                complaint.items.deptName.val(val.dept.name);
            }
        });

        return v;
    });

    com.initTypeahead("brandName", api.data.queryBrandByPinyin, "brand.pinyin", {}, 'brands', 'bid', 'alias', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.bid == k) {
                complaint.bid = val.bid;
                complaint.items.brandName.val(val.name);
            }
        });

        return v;
    });

    function initList(listData) {

        if (listData.length == 0)
            emptyData('complaintList');
        var $tableWrap = com.focusPage('#complaintList');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function(i, v) {

                var $liLine = $('<li></li>').addClass('clearfix item-orange');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $title = $('<small></small>').addClass('blue').html(v.staff.currentName);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $btnComplaink = $('<a></a>').addClass('btn btn-minier btn-yellow').html('跟踪内容');
                var $btnComplainkContent = $('<a></a>').addClass('btn btn-minier btn-success').html('跟踪');
                var $btnComplaintFinish = $("<a></a>").addClass('btn btn-minier btn-warning').html("完结");
                var $btnComplaintClose = $("<a></a>").addClass('btn btn-minier btn-inverse').html("关闭");

                var propertyArr = [["类型:", constant.customer().complaint.type.keys[v.type], "red"], ["部门:", v.dept.name, "grey"], ["品牌:", v.brand.name, "grey"], ["创建人: ", v.creater.currentName, "grey"], ["操作人: ", v.updater.currentName, "grey"], ["创建时间: ", v.createTime, "grey"], ["操作时间: ", v.updateTime, "grey"], ["完成时间: ", v.finishTime, "grey"], ["状态:", constant.customer().complaint.status.keys[v.status], "red"], ["内容:", v.content, "grey"]];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.append($h3).append($ulProperty);
                $btnDiv.append($btnComplaink);
                if (v.status == constant.customer().complaint.status.STATUS_INIT_INT) {
                    $btnDiv.append($btnComplainkContent);
                }
                if (v.status == constant.customer().complaint.status.STATUS_HANDLE_INT) {
                    $btnDiv.append($btnComplaintFinish);
                } else if (v.status == constant.customer().complaint.status.STATUS_END_INT) {
                    $btnDiv.append($btnComplaintClose);
                }

                $h3.append($title).append($btnDiv);
                $liLine.append($h3).append($ulProperty);
                $liLine.appendTo($ul);

                $btnComplainkContent.click(function() {

                    complaint.ctid = v.ctid;
                    complaint.modals.editItemModal.modal("show");
                });

                $btnComplaink.click(function(e) {

                    com.popup4mini("#miniPopUp", "#layerSubmits", "跟踪内容", function() {

                        queryComplack(v.ctid);
                    }, function() {

                        com.focusPage('#complaintList').empty();
                        queryComplaint();
                    });
                });

                $btnComplaintFinish.click(function(e) {

                    com.post(api.customer.finishComplaint, {
                        "complaint.ctid": v.ctid
                    }, function(res) {

                        com.focusPage('#complaintList').empty();
                        com.showAlert(com.info, "操作成功");
                        queryComplaint();
                    });
                });

                $btnComplaintClose.click(function(e) {

                    com.post(api.customer.closeComplaint, {
                        "complaint.ctid": v.ctid
                    }, function(res) {

                        com.focusPage('#complaintList').empty();
                        com.showAlert(com.info, "操作成功");
                        queryComplaint();
                    });
                });
            });
            $ul.appendTo($tableWrap);
        }
    }
    ;

    function complackList(listData) {

        if (listData.length == 0)
            emptyData('list');
        var $tableWrap = com.focusPage('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function(i, v) {

                var $liLine = $('<li></li>').addClass('clearfix item-orange');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $title = $('<small></small>').addClass('blue').html(v.comment);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var propertyArr = [["操作人: ", v.operater.currentName, "grey"], ["创建时间: ", v.createTime, "grey"], ["操作时间: ", v.operateTime, "grey"], ];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.append($h3).append($ulProperty);
                $h3.append($title).append($btnDiv);
                $liLine.appendTo($ul);

            });
            $ul.appendTo($tableWrap);
        }
    }
    ;

    queryComplaint();

    function trackComplack() {

        if (com.validate('editFrom')) {
            return false;
        }

        var options = {
            "complack.cid": complaint.cid,
            "complack.ctid": complaint.ctid,
            "complack.comment": complaint.complackItems.comment.val()
        };

        com.post(api.customer.trackComplack, options, function() {

            com.focusPage('#complaintList').empty();
            queryComplaint();
            com.showAlert(com.info, "操作成功");
            complaint.modals.editItemModal.modal("hide");
        });
    }
    ;

    function saveData() {

        if (com.validate('addFrom')) {
            return false;
        }

        var options = {
            "complaint.cid": complaint.cid,
            "complaint.dept.did": complaint.did,
            "complaint.staff.uid": complaint.uid,
            "complaint.brand.bid": complaint.bid,
            "complaint.type": complaint.items.type.val(),
            "complaint.content": complaint.items.content.val(),
        };

        com.post(api.customer.addComplaint, options, function() {

            com.focusPage('#complaintList').empty();
            queryComplaint();
            com.showAlert(com.info, "操作成功");
            complaint.modals.addItemModal.modal("hide");
        })
    }
    ;

    function queryComplaint() {

        com.post(api.customer.queryComplaint, {
            "complaint.cid": complaint.cid
        }, function(data) {

            initList(data.complaints);
        }, function(e) {

            com.showAlert(com.error, e.errorMsg);
        }, false);
    }
    ;

    function queryComplack(ctid) {

        com.post(api.customer.queryComplack, {
            "complack.ctid": ctid
        }, function(data) {

            complackList(data.complacks);
        }, function(e) {

            com.showAlert(com.error, e.errorMsg);
        }, false);
    }
    ;

    function emptyData(id) {

        com.focusPage('#complaintList').empty();

        var $resultList = com.focusPage('#' + id).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    }
    ;

});
