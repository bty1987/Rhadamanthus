$(function(){

    var supplier = {
        $nowLine : null,
        saveBtn: $("#saveBtn").on("click", saveData),
        cancelBtn: $("#cancelBtn"),
        saveUserBtn : $("#saveUserBtn").on("click", saveUser),
        supplierRightModal  : $("#supplierRightModal").on("show.bs.modal", function(a) {

        }).on("hide.bs.modal", function(a) {

        }),
        modal: $("#supplierModal").on("show.bs.modal", function(a) {
            com.clearValidator();
        }).on("hide.bs.modal", function(a) {
            supplier.editFlg = false;
            supplier.repeatFlg = false;
            $("#password").removeAttr('disabled')
        }),
        supplierModelItems: {
            supplierName : $("#supplierName"),
            loginId : $("#loginId"),
            password : $("#password"),
        },
        data: {
            materialTypeData: {},
            materialBrandData: {},
            measurementUnitData: {}
        },
        editFlg: !1,
        repeatFlg: !1,
    };
    var tag_input = $("#user");

    tag_input.tag({
        placeholder:tag_input.attr('placeholder'),
        //enable typeahead by specifying the source array
        isStaticResource : false,
        flsource: {
            url : api.personel.queryUserByDepartmentType,
            postData : {"departmentType.name": '主材部', "user.status": 0},
            resultList : "autoFillKeyValue",
            keyPath : "key",
            valuePath : "value",
            isResultTypeMap : true, //是否是key - value 形式的列表
        },
    });

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ,用来显示的div的id
     * result.list 列表的json数组
     * */
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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnUser = $('<a></a>').addClass('btn btn-minier btn-yellow').html('驻店');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-success').html('编辑');

            //启用禁用
            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl');

            var propertyArr = [
                ["厂商ID:", v.sid , "blue "],
                ["登陆名:", v.loginId , "grey"],
                ["登陆状态:", v.isLogin == 0 ? "禁用" : "启用", "red "]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);

            $divBtnWrap.append($btnUser).append($btnEdit).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);
            $btnUser.click(function(){
                dialogSupplierRight(v.sid);
            });

            $btnEdit.click(function(){
                supplier.$nowLine = v.sid;
                editSupplier(v);
            });

            v.isLogin && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click",function() {
                $statusSwitch.prop("checked") ? (updateStatus(v.sid, 1, function(){$statusSwitch.removeAttr("checked")})) : (updateStatus(v.sid, 0,function(){$statusSwitch.prop("checked")}));
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

    var _condArr = [];

    var searcher = new Searcher();

    searcher.init( _condArr, "condList", api.data.pageSupplier, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "materialModelPostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);

        /*$adda.click(function(){
            $("#supplierModal").modal('show');
        });*/

    	return [$adda];
    });

    //添加按钮
    $('a[name="add"]','#pagenation').click(function(){
        supplier.editFlg = !1;
        com.cleanItems(supplier.supplierModelItems);
        supplier.modal.modal("show");
    });

    //保存
    function saveData() {

        if (!com.validate('supplierModal') && !supplier.repeatFlg) {

            var _params = {
                "supplier.name": supplier.supplierModelItems.supplierName.val(),
                "supplier.loginId": supplier.supplierModelItems.loginId.val(),
            };

            var extra = supplier.editFlg ?{
                "supplier.sid": supplier.$nowLine
            } : {
                "supplier.password": supplier.supplierModelItems.password.val()
            };

            com.post(supplier.editFlg ? api.data.updateSupplier: api.data.addSupplier, $.extend({},_params,extra), function(a) {
                supplier.modal.modal("hide");
                searcher.doSearch();
            });
        }
    }

    //删除
    function deleteMaterial(mmid) {
        var  options = {};
        
        options["ids[0]"] = mmid;

        com.post(api.material.deleteMaterialModelByIds, options, function(){
        	searcher.doSearch();
        });
    }

    //编辑按钮
    function editSupplier(c) {
        supplier.editFlg = !0;

        supplier.supplierModelItems.supplierName.val(c.name);
        supplier.supplierModelItems.loginId.val(c.loginId);
        supplier.supplierModelItems.password.val(null).attr('disabled' ,true);

        supplier.modal.modal("show");
    }

    //启用禁用功能
    function updateStatus(id, isLogin, failcallBack) {

        com.post(api.data.updateSupplierForLogin, {
            "supplier.sid": id,
            "supplier.isLogin": isLogin,
        }, function () {

        }, function () {
            failcallBack && failcallBack();
        });
    }

    function dialogSupplierRight(sid){
        supplier.sid = sid;

        com.post(api.data.querySupplierUserRightBySId, {"supplierUserRight.sid": sid}, function(res){

            var _tag = $('#user').data('tag');

            if(_tag){
                while(_tag.values.length > 0){
                    _tag.remove(0)
                }

                if(res.supplierUserRights.length){
                    $.each(res.supplierUserRights, function(i, v){
                        _tag.fladd(v.user.userId, v.user.currentName);
                    });
                }
            }
        });

        supplier.supplierRightModal.modal("show");
    }


    function saveUser(){

        var options = {
            "supplierUserRight.sid": supplier.sid,
        };

        var users = $("#user").val();

        if(users){
            users = users.split(', ');
            if(users.length){
                $.each(users, function( i, v){
                    options[ 'userIds[' + i + ']' ] = v;
                });
            }
        }

        com.post(api.data.updateSupplierUserRight, options, function(){
            supplier.supplierRightModal.modal("hide");
        });
    }
});
