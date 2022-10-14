
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
    com.post(api.ds.approval, {"timestamp": new Date().getTime()}, function(res) {
        approve.items.type.bindData(res.approvalType, "key", "value", false);

        approve.approvalType = res.approvalType.split("key", "value");

    }, null, false);

    /**
     * 分页中 , 显示数据(每行)的处理方法 , 每行显示内容大致分为三个部分 , 行标题 , 行内容 , 行按钮集
     */
    var displayFunc  = (function() {

        // 通过数据集完成每行数据对应的展现处理过程 , 利用creatLine完成每行对应数据的渲染
        var renderList = function(tableId,listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) { 
                $.each(listData,function(i, v) {
                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        // 行渲染处理方法
        var creatLine = function(v) {
            var userBase = v.userBase;

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + userBase.currentName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [
                ["编号:", userBase.userId, "grey"],
                ["职位:", userBase.duty.name, "grey"],
                ["类型:", constant.approval().approval.type.keys[v.type], "red"],
                ["说明:", v.comment, "grey"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDel.bindClick(function(){
                deleteApprover(v.aid);
            });

            return $liLine;
        };

        // 返回结果给searcher , searcher利用返回的方法完成具体分页显示的过程
        return {
            init : function(tableId,listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    /**
     * searcher声明过程 , 参数: 查询条件集/条件元素ID/请求API/数据渲染方法/分页工具元素ID/条件缓存名称/请求参数/是否分页标识/响应结果名/响应结果/自定义按钮
     */
    var searcher = new Searcher();

    searcher.init(["approval-approver-username", "approval-type"], "condList", api.approval.pageApprover, function(data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "approvalUserPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addApprovalUser').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

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
