
jQuery(function($) {

    var approve = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items:{},

        editFlg: false,
        postParam: {},
    };


    approve.saveBtn = $("#saveBtn").bindClick(saveData);
    approve.cancelBtn = $("#cancelBtn");
    approve.modal = $("#groupUserModal");
    approve.items.userSel = $("#userSel");
    approve.items.comment = $("#comment");
    com.post(api.ds.approval, {"timestamp": new Date().getTime()}, function(res){
        approve.approvalType = res.approvalType;

        approve.approvalTypeData = {};

        for(var i=0;i<approve.approvalType.length;i++){
            var _ = approve.approvalType[i];
            approve.approvalTypeData[_["key"]] = _["value"];
        }
    }, null, false);

    com.initChosen('userSel', api.personel.queryUserByPinyin, "pinyinName", {"user.status":"0","departmentType.name":""}, "userBases", "uid", "currentName");

    approve.items.type = $("#type").bindData(approve.approvalType, "key", "value", false);

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var userBase = v.user;

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + userBase.currentName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [
                ["编号:", userBase.userId, "grey"],
                ["职位:", userBase.duty.name, "grey"],
                ["说明:", v.content, "grey"]
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
                deleteGroupUser(v.duid);
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();

    searcher.init([], "condList", api.decoration.queryDecorationUser, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "groupUserPostData", {"decorationUser.orderId":params.gorderId}, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addGroupUser').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    $('a[name="addGroupUser"]', '#pagenation').click(function(){
        editFlg = false;
        com.clearValidator();
        com.updateChosen('userSel', '', '');
        approve.items.userSel.prop("disabled", false).trigger("chosen:updated");
        // com.cleanItems(approve.items);
        approve.modal.modal("show");
    });

    function deleteGroupUser(duid){

        var options = {
            "decorationUser.duid": duid
        };

        com.post(api.decoration.deleteDecorationUser, options, function(){
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        },null,false);
    }

    function saveData(){

        if(com.validate()){
            return;
        }

        var url;
        var options = {
            'decorationUser.user.uid': approve.items.userSel.val(),
            'decorationUser.orderId': params.gorderId,
            'decorationUser.content': approve.items.comment.val(),
        };
        url = api.decoration.addDecorationUser;

        com.post(url, options, function(res){
            searcher.doSearch();
        },null,false);

        approve.modal.modal("hide");
    }

});
