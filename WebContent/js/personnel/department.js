jQuery(function($) {

    var department = {

        items: {
            no: com.focusPage("#deptId"),
            name: com.focusPage("#deptName"),
            fatherdept: com.focusPage("#fatherdept"),// 部门
            deptype: com.focusPage("#deptype"),// 部门类型
            busitype: com.focusPage("#busitype"),// 业务类型
            kino: com.focusPage("#kino"),
            kiname: com.focusPage("#kiname"),
            manager: com.focusPage("#manager"),
            comment: com.focusPage("#des"),
            isdet: com.focusPage("#isdet"),// 是否定岗
            code: com.focusPage("#code"),
            limit: com.focusPage("#limit"),// 人员数量上限
        },
        modals: {
            modal: com.focusPage("#deptModal")
        },
        btns: {
            saveBtn: com.focusPage("#saveBtn").bindClick(saveData),
        },

        did: null,
    };

    var type = params['urlLoadParams'].type;

    department.modals.modal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.clearValidator("#no", true);
        com.cleanTypeahead("manager");
        com.cleanItems(department.items);
    });

    com.post(api.communion.queryDepartment, {}, function(res) {

        var $arr = [];

        $.each(res.deptList, function(i, v) {

            if (v.fatherDept.did != null && v.fatherDept.did != v.did)
                return true;
            $arr.push(v);
        });

        department.items.fatherdept.bindData($arr, "did", "name", true);
    });

    com.post(api.communion.queryDepartmentType, {}, function(res) {

        department.items.deptype.bindData(res.departmentTypes, "dtid", "name", true);
    });

    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        department.items.busitype.bindData(res.decorationBusitypes, "dbid", "name", true);
    });

    com.initTypeahead('manager', api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value");

    var lineprops = (function() {

        return [{
            field: "no",
            name: "编号",
            prop: "no",
            clazz: "grey"
        }, {
            field: "fatherDept.name",
            name: "所属分区",
            prop: function(v) { return v.fatherDept.name == null ? '无' : v.fatherDept.name; },
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "kino",
            name: "金蝶编号",
            prop: function(v) { return com.checkNull(v.kino, "无"); },
            clazz: "grey"
        }, {
            field: "kiname",
            name: "金蝶名称",
            prop: function(v) { return com.checkNull(v.kiname, "无"); },
            clazz: "grey"
        }, {
            field: "manager.userName",
            name: "管理人员",
            prop: function(v) { return com.checkNull(v.manager.userName, "无"); },
            clazz: "grey"
        }, {
            field: "isdet",
            name: "是否定岗",
            prop: function(v) { return com.checkNull(v.isdet == 1 ? "定岗" : "开放"); },
            clazz: "red"
        }, {
            field: "limit",
            name: "人员数量上限",
            prop: "limit",
            clazz: "blue"
        }, {
            field: "comment",
            name: "描述",
            prop: function(v) { return v.comment == "" ? '无' : v.comment; },
            clazz: "grey"
        }, {
            field: "code",
            name: "code",
            prop: function(v) { return v.code == null ? '无' : v.code; },
            clazz: "grey"
        }, {
            field: "busitype.name",
            name: "业务类型",
            prop: function(v) { return com.checkNull(v.busitype && v.busitype.name ? v.busitype.name : '无'); },
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        var btns = {};

        if (type == 'dutment') {
            btns.dutment = {
                name: "定岗",
                clazz: "btn-blue",
                handle: function(v) {

                    params.deptId = v.did;
                    params.name = v.name;
                    params.type = 0;
                    params.typeId = v.type.dtid;

                    com.popup4page("#layersPopUp", "views/personnel/dutment.html", "定岗信息", null);
                }
            };
        } else {
            btns.partner = {
                name: "合作",
                clazz: "btn-warning",
                handle: function(v) {

                    params.personel.did = v.did;

                    com.popup4page("#departmentPartnerPopUp", api.index.departmentPartnerIndex.url, "合作");
                }
            };
            btns.edit = {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {

                    edit(v);
                }
            };
            btns.status = {
                type: "switch",
                init: function(v) { return v.status; },
                handle: function(v, checked) {

                    updateStatus(v.did, checked ? 1 : 0);
                }
            };
        }

        return btns;
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'adddepartment').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        if (type == 'dutment')
            return [];
        else
            return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.communion.pageDepartment, null, ['personel-dept-name', 'personel-dept-status', 'personel-dept-type', 'personel-dept-isdet'], postData, null, false, buildDepartmentButtons);
    searcher.line("name", lineprops, linebtns).render();

    $('a[name="adddepartment"]', com.focusPage('#pagenation')).click(function() {

        department.did = null;

        com.cleanItems(department.items);

        com.focusPage("#ndeptId").css({
            "display": "none"
        });
        department.modals.modal.modal("show");
    });

    function edit(dept) {

        department.items.fatherdept.find("option").eq(0).val(0);

        department.did = dept.did;

        com.focusPage("#ndeptId").css({
            "display": "block"
        });

        department.items.did = dept.did;
        department.items.no.val(dept.no);
        department.items.deptype.val(dept.type.dtid);
        department.items.busitype.val(dept.busitype && dept.busitype.dbid ? dept.busitype.dbid : null);
        department.items.name.val(dept.name);
        department.items.fatherdept.val(dept.fatherDept.name == null ? null : dept.fatherDept.did);
        department.items.kino.val(dept.kino);
        department.items.kiname.val(dept.kiname);
        department.items.comment.val(dept.comment);
        department.items.isdet.val(dept.isdet);
        department.items.code.val(dept.code);
        department.items.limit.val(dept.limit);

        if (dept.manager)
            com.updateTypeahead("manager", dept.manager.userId, dept.manager.currentName);

        department.modals.modal.modal("show");
    }

    function updateStatus(did, cvalue) {

        var options = {
            "dept.did": did,
            "dept.status": cvalue,
        };

        com.post(api.communion.updateDepartmentForStatus, options, function(res) {

            searcher.doSearch();
        });
    }

    function saveData() {

        if (com.validate("deptModal")) {
            return false;
        }

        var url = api.communion.addDepartment;

        var options = {
            'dept.name': department.items.name.val(),
            'dept.type.dtid': department.items.deptype.val(),
            'dept.busitype.dbid': department.items.busitype.val() ? department.items.busitype.val() : null,
            'dept.fatherDept.did': department.items.fatherdept.val() ? department.items.fatherdept.val() : null,
            'dept.kino': department.items.kino.val(),
            'dept.kiname': department.items.kiname.val(),
            'dept.manager.userId': com.typeahead("manager"),
            'dept.comment': department.items.comment.val(),
            'dept.isdet': department.items.isdet.val(),
            'dept.code': department.items.code.val(),
            'dept.limit': department.items.limit.val()
        };

        if (department.did) {
            url = api.communion.updateDepartment;
            options['dept.did'] = department.did;
        }

        com.post(url, options, function(res) {

            department.modals.modal.modal("hide");

            searcher.doSearch();
        });
    }

});