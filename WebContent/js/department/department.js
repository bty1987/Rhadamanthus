jQuery(function ($) {

    var businessDept = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},

        editFlg: false,

        validator: {
            businessDept: {
                type: "v_businessDept",
                regex: /^FL_D_\d{3}$/g,
                errorMsg: "请以FL_D_作为前缀 , 之后以两位数字组成(如FL_D_001)."
            }
        },
    };

    businessDept.saveBtn = $("#saveBtn").bindClick(saveData);
    businessDept.cancelBtn = $("#cancelBtn");

    businessDept.items.businessDeptId = $("#businessDeptId");
    businessDept.items.businessDeptName = $("#businessDeptName");
    businessDept.items.fatherdept = $("#fatherdept");//部门
    businessDept.items.departmenttype = $("#departmenttype");//部门类型

    businessDept.items.cityProperSel = $("#cityProperSel");//城区
    businessDept.items.contractPrefix = $("#contractPrefix");//合同标识

    businessDept.items.des = $("#des");

    businessDept.modal = $("#businessDeptModal");
    businessDept.modal.on('show.bs.modal', function (e) {
        com.clearValidator();
        com.clearValidator("#businessDeptId", true);
    });
    $.extend(com.validator, businessDept.validator);


    com.post(api.department.queryDepartment, { }, function (res) {
        businessDept.items.fatherdept.bindData(res.deptList, "did", "deptName",true);
    });//所属部门

    com.post(api.department.queryDepartmentType, {}, function (res) {
        businessDept.items.departmenttype.bindData(res.departmentTypes, "dtid", "name", false);
    });//部门类型
    com.post(api.system.queryCityProper, {}, function (res) {//"cityProperId", "cityProperName", true
        businessDept.items.cityProperSel.bindData(res.cityPropers, "cityProperId", "cityProperName", true);
    });//城市

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.deptName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-info').html('编辑');
            var $btnDel = $('<input />').attr("type", "checkbox").addClass('ace ace-switch ace-switch-5').attr("checked", v.status == 0 ? false : true);
            var $btnSpan = $('<span></span>').addClass("lbl status-lbl");



            var propertyArr = [
                ["编号:", v.deptId ==null?'无': v.deptId, "grey"],
                ["所属分区:", v.fatherDept ==null?'无':v.fatherDept.deptName, "grey"],
                ["城区:", v.cityProper ==null?'无': v.cityProper.cityProperName, "grey"],
                ["合同前缀:", v.contractPrefix ==null?'无': v.contractPrefix, "grey"],
                ["创建时间:", v.createTime ==null?'无': v.createTime, "grey"],
                ["描述:", v.des ==null?'无': v.des, "grey"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).append($btnDel).append($btnSpan).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function () {
                editBusinessDept(v.did, v.type,v.deptId, v.deptName, v.fatherDept.did ,v.cityProper, v.des);
            });

            $btnDel.click(function () {
                var cvalue = $btnDel.prop("checked");
                if (cvalue) {
                    cvalue = 1;
                } else {
                    cvalue = 0;
                }
                updateBusinessDept(v.deptId, cvalue);
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();
    var _condArr = ['deptName', 'deptType'];

    searcher.init(_condArr, "condList", api.department.pageDepartment, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "designDeptPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addBusinessDept').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    $('a[name="addBusinessDept"]', '#pagenation').click(function () {
        editFlg = false;

        com.cleanItems(businessDept.items);

        businessDept.items.businessDeptId.prop("disabled", false).css("display", "none");

        businessDept.modal.modal("show");
    });

    function editBusinessDept(did,type,deptId, deptName, fatherDeptId,cityProper , des) {

        businessDept.items.businessdid=did;

        businessDept.items.departmenttype.val(type.dtid)
            editFlg = true;

            businessDept.items.businessDeptId.val(deptId).prop("disabled", true).css("display", "block");
            businessDept.items.businessDeptName.val(deptName);
            businessDept.items.fatherdept.val(fatherDeptId);
            businessDept.items.cityProperSel.val(cityProper.cityProperId);
            if(cityProper.city !=null){
                if(cityProper.city.region){
                    var cityProperIds=cityProper.cityProperId;
                }
            }

        businessDept.items.des.val(des);

        businessDept.modal.modal("show");
    }

    function updateBusinessDept(deptId, cvalue) {

        var options = {};
        options["dept.deptId"] = deptId;
        options["dept.status"] = cvalue;

        com.post(api.department.updateDepartmentForStatus, options, function (res) {
            searcher.doSearch();
        });

    }

    function saveData() {
        if (com.validate()) {
            return;
        }

        if(businessDept.items.cityProperSel.val()==""){
            var cityProperSel=null;
        }else {
            var cityProperSel=businessDept.items.cityProperSel.val();
        }

        var url;
        var options = {
            'dept.ident': 15,
            'dept.deptName': businessDept.items.businessDeptName.val(),//部门名称
            'dept.type.dtid': businessDept.items.departmenttype.val(),//部门类型
            'dept.contractPrefix': businessDept.items.contractPrefix.val(),//合同标识
            'dept.des': businessDept.items.des.val(),//备注
            'dept.subType':"",
            'dept.status':1,
        };

        if(businessDept.items.fatherdept.val() != null && businessDept.items.fatherdept.val() != ""){
            $.extend(options,{
                'dept.fatherDept.did': businessDept.items.fatherdept.val(),
            })
        }

        if(businessDept.items.cityProperSel.val() != null && businessDept.items.cityProperSel.val() != ""){
            $.extend(options,{
                'dept.cityProper.cityProperId': businessDept.items.cityProperSel.val(),
            })
        }

        if (editFlg) {
            url = api.department.updateDepartment;
            options['dept.did'] = businessDept.items.businessdid;
            com.post(url, options, function (res) {
                searcher.doSearch();
            });
        } else {
            url = api.department.addDepartment;
            com.post(url, options, function (res) {
                searcher.doSearch();
            });
        }

        businessDept.modal.modal("hide");
    }

});
