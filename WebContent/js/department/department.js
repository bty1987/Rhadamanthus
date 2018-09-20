jQuery(function ($) {

    var department = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},
        editFlg: false
    };

    department.saveBtn = $("#saveBtn").bindClick(saveData);
    department.cancelBtn = $("#cancelBtn");
    department.items.deptId = $("#deptId");
    department.items.deptName = $("#deptName");
    department.items.fatherdept = $("#fatherdept");//部门
    department.items.deptype = $("#deptype");//部门类型
    department.items.cityProperSel = $("#cityProperSel");//城区
    department.items.contractPrefix = $("#contractPrefix");//合同标识
    department.items.des = $("#des");
    department.modal = $("#deptModal");
    department.modal.on('show.bs.modal', function (e) {
        com.clearValidator();
        com.clearValidator("#deptId", true);
    });

    com.post(api.communion.queryDepartment, {}, function (res) {
        department.items.fatherdept.bindData(res.deptList, "did", "deptName",true);
    });

    com.post(api.communion.queryDepartmentType, {}, function (res) {
        department.items.deptype.bindData(res.departmentTypes, "dtid", "name", false);
    });

    com.post(api.system.queryCityProper, {}, function (res) {
        department.items.cityProperSel.bindData(res.cityPropers, "cpid", "name", true);
    });

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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.deptName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl');


            var propertyArr = [
                ["编号:", v.deptId, "grey"],
                ["所属部门:", v.fatherDept.deptName ==null?'无':v.fatherDept.deptName, "grey"],
                ["所属城区:", v.cityProper.name ==null?'无': v.cityProper.name, "grey"],
                ["合同号标识:",(v.contractPrefix == ""||v.contractPrefix == null)?'无': v.contractPrefix, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["描述:", v.des == ""?'无': v.des, "grey"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);

            $divBtnWrap.append($btnEdit).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function () {
                editdepartment(v);
            });

            v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click",function() {
                $statusSwitch.prop("checked") ? (updateStatus(v.did, 1, function(){$statusSwitch.prop("checked")})) : (updateStatus(v.deptId, 0,function(){$statusSwitch.removeAttr("checked")}));
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

    searcher.init(_condArr, "condList", api.communion.pageDepartment, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "designDeptPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'adddepartment').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    $('a[name="adddepartment"]', '#pagenation').click(function () {
        department.editFlg = false;
        com.cleanItems(department.items);
        $("#ndeptId").css({"display":"none"});
        department.modal.modal("show");
    });

    function editdepartment(dept) {

        department.modal.modal("show");
        department.editFlg = true;
        $("#ndeptId").css({"display":"block"});
        department.items.did=dept.did;
        department.items.deptId.val(dept.deptId)
        department.items.deptype.val(dept.type.dtid)
        department.items.deptName.val(dept.deptName);
        department.items.fatherdept.val(dept.fatherDept.deptName == null ?null:dept.fatherDept.did);
        department.items.cityProperSel.val(dept.cityProper.cpid);
        department.items.des.val(dept.des);
    }

    function updateStatus(did, cvalue) {
        var options = {};
        options["dept.did"] = did;
        options["dept.status"] = cvalue;
        com.post(api.communion.updateDepartmentForStatus, options, function (res) {
            searcher.doSearch();
        });
    }

    function saveData() {
        if (com.validate()) {
            return false;
        }

        var url;
        var options = {
            'dept.deptName': department.items.deptName.val(),
            'dept.type.dtid': department.items.deptype.val(),
            'dept.fatherDept.did': department.items.fatherdept.val() ? department.items.fatherdept.val() :null ,
            'dept.contractPrefix': department.items.contractPrefix.val(),
            'dept.cityProper.cpid': department.items.cityProperSel.val() ? department.items.cityProperSel.val() : null,
            'dept.des': department.items.des.val(),
        };
        department.editFlg ? (url=api.communion.updateDepartment,options['dept.did'] = department.items.did):
            (url = api.communion.addDepartment)

        com.post(url, options, function (res) {
            department.modal.modal("hide");
            searcher.doSearch();
        });
    }

});
