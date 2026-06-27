
jQuery(function($) {

    /**
     * 当前页变量声明 , 利用一个页面变量包含页面整体需要的变量类型 
     * 其中modals代表页面使用的modal集合(弹窗) , items代表页面输入元素集合(input/select/...) , 同时初始化(赋值)集合中的元素
     * 另外 , 声明一些状态/类型等信息 , 按钮等元素对象
     */
    var approve = {

        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),

        modals: {
            approveModal: com.focusPage("#approveModal")
        },

        items:{
            approver: com.focusPage("#approver"),
            type: com.focusPage("#type"),
            comment: com.focusPage("#comment")
        },

        approvalType: {}
    };

    /**
     * 声明按钮/modal事件 , 初始化部分元素控件 , 例如typeahead/date控件等
     */
    approve.saveBtn.bindClick(saveData);

    com.initTypeahead("approver", api.personel.queryUserByPinyin, "pinyinName", {"user.status":"0", "departmentType.name":""}, "autoFillKeyValue", "key", "value", null);

    /**
     * 初始化页面变量中的状态/类型等信息 , 同时判断是否需要绑定数据
     */

    approve.items.type.bindData(constant.approval().approval.type.datas, "key", "value", false);
    approve.approvalType = constant.approval().approval.type.keys;

    var lineprops = (function() {

        return [{
            field: "userBase.userId",
            name: "编号",
            prop: "userBase.userId",
            clazz: "grey"
        }, {
            field: "userBase.duty.name",
            name: "职位",
            prop: "userBase.duty.name",
            clazz: "grey"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return constant.approval().approval.type.keys[v.type]; },
            clazz: "red"
        }, {
            field: "comment",
            name: "说明",
            prop: "comment",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {

                    deleteApprover(v.aid);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addApprovalUser').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    /**
     * searcher声明过程
     */
    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.approval.pageApprover, null, ["approval-approver-username", "approval-type"], "approvalUserPostData", null, false, buttons);
    searcher.line("userBase.currentName", lineprops, linebtns).render();

    /**
     * 自定义按钮绑定事件
     */
    com.focusPage('#addApprovalUser', '#pagenation').click(function() {
        approve.modals.approveModal.modal("show");
    });

    approve.modals.approveModal.on("hide.bs.modal", function() {
        com.clearValidator();
        com.cleanTypeahead('approver');
        com.cleanItems(approve.items);
    });

    /**
     * 事件声明 , 包括行数据中按钮事件/modal中使用按钮事件等
     */
    function deleteApprover(aid) {

        com.post(api.approval.deleteApprover, {"approver.aid": aid}, function() {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        },null,false);
    }

    function saveData() {

        if (com.validate('form')) {
            return false;
        }

        var options = {
            'approver.userBase.userId': com.typeahead("approver"),
            'approver.type': approve.items.type.val(),
            'approver.comment': approve.items.comment.val(),
        };

        com.post(api.approval.addApprover, options, function(res) {
            searcher.doSearch();
        }, null, false);

        approve.modals.approveModal.modal("hide");
    }

});
