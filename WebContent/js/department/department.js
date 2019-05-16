jQuery(function ($) {

    var department = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},
        editFlg: false
    };

    department.saveBtn = com.focusPage("#saveBtn").bindClick(saveData);
    department.cancelBtn = com.focusPage("#cancelBtn");
    department.items.no = com.focusPage("#deptId");
    department.items.name = com.focusPage("#deptName");
    department.items.fatherdept = com.focusPage("#fatherdept");//部门
    department.items.deptype = com.focusPage("#deptype");//部门类型
    department.items.kino = com.focusPage("#kino");
    department.items.kiname = com.focusPage("#kiname");
    department.items.manager = com.focusPage("#manager");
    department.items.comment= com.focusPage("#des");
    department.modal = com.focusPage("#deptModal");
    department.modal.on('show.bs.modal', function (e) {
        com.clearValidator();
        com.clearValidator("#no", true);
        com.cleanTypeahead("manager");
    });

    com.post(api.communion.queryDepartment, {}, function (res) {
        department.items.fatherdept.bindData(res.deptList, "did", "name",true);
    });

    com.post(api.communion.queryDepartmentType, {}, function (res) {
        department.items.deptype.bindData(res.departmentTypes, "dtid", "name", false);
    });
    
    com.initTypeahead('manager', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name":"", "user.status":0}, "autoFillKeyValue", "key", "value");

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl');


            var propertyArr = [
                ["编号:", v.no, "grey"],
                ["所属部门:", v.fatherDept.name ==null?'无':v.fatherDept.name, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["金蝶编号:", com.checkNull(v.kino, "无"), "grey"],
                ["金蝶名称:", com.checkNull(v.kiname, "无"), "grey"],
                ["管理人员:", com.checkNull(v.manager.userName, "无"), "grey"],
                ["描述:", v.comment  == ""?'无': v.comment , "grey"]
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
                $statusSwitch.prop("checked") ? (updateStatus(v.did, 1, function(){$statusSwitch.prop("checked")})) : (updateStatus(v.did, 0,function(){$statusSwitch.removeAttr("checked")}));
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
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

    $('a[name="adddepartment"]', com.focusPage('#pagenation')).click(function () {
        department.editFlg = false;
        com.cleanItems(department.items);
        $("#ndeptId").css({"display":"none"});
        department.modal.modal("show");
    });

    function editdepartment(dept) {
        
        department.editFlg = true;
        
        $("#ndeptId").css({"display":"block"});
        
        department.items.did = dept.did;
        department.items.no.val(dept.no);
        department.items.deptype.val(dept.type.dtid);
        department.items.name.val(dept.name);
        department.items.fatherdept.val(dept.fatherDept.name == null ?null:dept.fatherDept.did);
        department.items.kino.val(dept.kino);
        department.items.kiname.val(dept.kiname);
        department.items.comment .val(dept.comment );
        
        if(dept.manager) com.updateTypeahead("manager", dept.manager.userId, dept.manager.currentName);
        
        department.modal.modal("show");
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
            'dept.name': department.items.name.val(),
            'dept.type.dtid': department.items.deptype.val(),
            'dept.fatherDept.did': department.items.fatherdept.val() ? department.items.fatherdept.val() :null ,
            'dept.kino': department.items.kino.val(),
            'dept.kiname': department.items.kiname.val(),
            'dept.manager.userId': com.typeahead("manager"),
            'dept.comment': department.items.comment.val()
        };
        
        department.editFlg ? (url=api.communion.updateDepartment,options['dept.did'] = department.items.did) : (url = api.communion.addDepartment);

        com.post(url, options, function (res) {
            department.modal.modal("hide");
            searcher.doSearch();
        });
    }

});
