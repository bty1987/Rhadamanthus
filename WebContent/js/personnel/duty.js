$(function() {

    var lineprops = (function() {

        return [];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {

                    edit(v);
                }
            },
            dutment: {
                name: "定岗信息",
                clazz: "btn-blue",
                handle: function(v) {

                    params.did = v.did;
                    params.type = 1;
                    com.popup4page("#layerPopUp", api.index.dutment.url, "定岗信息", null, function() {

                        dutySeacher.doSearch();
                    });
                }
            },
            status: {
                type: "switch",
                clazz: "status-lbl",
                init: function(v) { return !v.status; },
                handle: function(v, checked) {

                    updateStatus(v.did, checked ? 0 : 1);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addDuty').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var dutySeacher = new Searcher();

    dutySeacher.set("condList", "pagenation", "resultList", api.system.pageDuty, null, ["personel-duty-name"], "dutyPostData", null, false, buttons);
    dutySeacher.line(function(v) { return v.name + (v.code ? ' [' + v.code + ']' : ''); }, lineprops, linebtns).render();

    // 定义全局变量 json
    var duty = {

        saveBtn: com.focusPage("#saveAddItemBtn").on("click", saveData),// 绑定事件
        cancelBtn: null,
        modal: null,
        dutyItems: {},
        validator: {
            duty: {
                type: "v_duty",
                regex: /^([1-9]\d|\d)$/,
                errorMsg: "请输入0~99数字 (如:1)."
            },
        },
        editFlg: false,
        repeatFlg: false
    };

    // 给全局变量赋值(主要操作是制定页面标签)
    // duty.saveBtn = com.focusPage("#saveAddItemBtn").on("click", saveData);
    duty.cancelBtn = com.focusPage("#cancelBtn");
    duty.modal = com.focusPage("#addItemModal");
    duty.dutyItems.did = com.focusPage("#did");
    duty.dutyItems.name = com.focusPage("#dutyName");
    duty.dutyItems.code = com.focusPage("#dutyCode");
    duty.dutyItems.lead = com.focusPage("#lead");
    duty.dutyItems.depttype = com.focusPage("#depttype");
    $.extend(com.validator, duty.validator); // 将多个对象合并成一个对象

    com.post(api.communion.queryDepartmentType, {}, function(res) {

        duty.dutyItems.depttype.bindData(res.departmentTypes, "dtid", "name", false);
    });

    // 编辑
    function edit(row) {

        // 给页面标签赋值
        duty.editFlg = true;
        duty.repeatFlg = false;
        duty.dutyItems.depttype.val(row.departmentType.dtid);
        duty.dutyItems.lead.val(row.lead);
        duty.dutyItems.did.val(row.did);
        duty.dutyItems.name.val(row.name);
        duty.dutyItems.code.val(row.code);
        duty.modal.modal("show"); // 弹出弹层
    }
    // 保存
    function saveData() {

        if (com.validate("addItemModal") || duty.repeatFlg)
            return false;

        var url;
        var options = {
            "duty.name": duty.dutyItems.name.val(),
            "duty.code": duty.dutyItems.code.val(),
            "duty.lead": duty.dutyItems.lead.val(),
            "duty.departmentType.dtid": duty.dutyItems.depttype.val(),
            "duty.type": 0,
            "duty.pinyin": ""
        };

        if (duty.editFlg) {
            url = api.system.updateDuty;
            options["duty.did"] = duty.dutyItems.did.val();
        } else {
            url = api.system.addDuty;
        }
        com.post(url, options, function (res) {

            dutySeacher.doSearch();
            duty.modal.modal("hide");

            var dutyData = {
                "name": duty.dutyItems.name.val(),
                "companyName": "方林集团"
            };

            kingdeeUtils.duty(dutyData);
        });
    }

    // 添加
    com.focusPage('[name="addDuty"]', '#pagenation').on("click", function() { // 选择器 [属性名="属性值"] 匿名函数

        duty.editFlg = false;

        com.cleanItems(duty.dutyItems);
        duty.modal.modal("show");
    });

    // 启用禁用功能
    function updateStatus(id, status) {

        com.post(api.system.updateDutyForStatus, {
            "duty.did": id,
            "duty.status": status
        }, function() {

            dutySeacher.doSearch();
        });
    }

});
