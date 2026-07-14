$(function(){

    var supplier = {
        $nowLine : null,
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        cancelBtn: com.focusPage("#cancelBtn"),
        saveUserBtn : com.focusPage("#saveUserBtn").on("click", saveUser),
        supplierRightModal  : com.focusPage("#supplierRightModal").on("show.bs.modal", function(a) {

        }).on("hide.bs.modal", function(a) {

        }),
        modal: com.focusPage("#supplierModal").on("show.bs.modal", function(a) {
            com.clearValidator();
        }).on("hide.bs.modal", function(a) {
            supplier.editFlg = false;
            supplier.repeatFlg = false;
            com.focusPage("#password").removeAttr('disabled')
        }),
        supplierModelItems: {
            supplierName : com.focusPage("#supplierName"),
            loginId : com.focusPage("#loginId"),
            password : com.focusPage("#password"),
        },
        data: {
            materialTypeData: {},
            materialBrandData: {},
            measurementUnitData: {}
        },
        editFlg: !1,
        repeatFlg: !1,
    };
    var tag_input = com.focusPage("#user");

    tag_input.tag({
        placeholder:tag_input.attr('placeholder'),
        //enable typeahead by specifying the source array
        isStaticResource : false,
        flsource: {
            url : api.personel.queryUserByPinyin,
            postData : {"departmentType.name": '主材部', "user.status": 0},
            resultList : "autoFillKeyValue",
            keyPath : "key",
            valuePath : "value",
            isResultTypeMap : true, //是否是key - value 形式的列表
        },
    });

    var lineprops = (function() {

        return [{
            field: "sid",
            name: "厂商ID",
            prop: "sid",
            clazz: "blue"
        }, {
            field: "loginId",
            name: "登陆名",
            prop: "loginId",
            clazz: "grey"
        }, {
            field: "isLogin",
            name: "登陆状态",
            prop: function(v) { return v.isLogin == 0 ? "禁用" : "启用"; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            user: {
                name: "驻店",
                clazz: "btn-yellow",
                handle: function(v) { dialogSupplierRight(v.sid); }
            },
            edit: {
                name: "编辑",
                clazz: "btn-success",
                handle: function(v) {
                    supplier.$nowLine = v.sid;
                    editSupplier(v);
                }
            },
            status: {
                type: "switch",
                clazz: "status-lbl",
                init: function(v) { return v.isLogin; },
                handle: function(v, checked) { updateStatus(v.sid, checked ? 1 : 0, null); }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var _condArr = [];

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.data.pageSupplier, null, _condArr, "materialModelPostData", null, false, buttons);
    searcher.line("currentName", lineprops, linebtns).render();

    //添加按钮
    $('a[name="add"]',com.focusPage('#pagenation')).click(function(){
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

            var _tag = com.focusPage('#user').data('tag');

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
