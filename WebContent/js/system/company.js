$(function() {

    var company = {

        company: null,
        atttype: [],

        items: {

            cid: com.focusPage("#cid"),
            no: com.focusPage("#no"),
            code: com.focusPage("#code"),
            name: com.focusPage("#name"),
            shortname: com.focusPage("#shortname"),
            fullname: com.focusPage("#fullname"),
            address: com.focusPage("#address"),
            corporation: com.focusPage("#corporation"),
            phone: com.focusPage("#phone"),
            atttype: com.focusPage("#atttype"),
            block: com.focusPage("#block"),

            drganization: com.focusPage("#drganization"),
            srganization: com.focusPage("#srganization"),
        },

        modals: {
            updateCompanyModal: com.focusPage("#updateCompanyModal"),
            updateOrganizationModal: com.focusPage("#updateOrganizationModal"),
        },

        btns: {
            updateCompanyBtn: com.focusPage("#updateCompanyBtn").on("click", saveData),// 绑定事件
            updateOrganizationBtn: com.focusPage("#updateOrganizationBtn").on("click", updateOrganization),// 绑定事件
        },

        validator: {
            company: {
                type: "v_company",
                regex: /^([1-9]\d|\d)$/,
                errorMsg: "请输入0~99数字 (如:1)."
            }
        },
    };

    company.items.block.bindData(constant.system().company.block.datas, "key", "value");

    com.post(api.ds.system, {}, function(res) {

        com.focusPage("#atttype").bindData(res.atttype, "key", "value");
        company.atttype = res.atttype.split("key", "value");
    }, null, false);

    company.modals.updateCompanyModal.on('shown.bs.modal', function(e) {

        com.clearValidator();
        com.clearValidator(com.focusPage("#no").attr("id"), true);
    });

    $.extend(com.validator, company.validator); // 将多个对象合并成一个对象

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) { // 页面中的一条数据

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no + " " + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');
            var $btnOrganization = $('<a></a>').addClass('btn btn-minier btn-success').html('组织');

            var propertyArr = [["编号: ", v.no, "grey"], ["code: ", v.code, "gery"], ["全名: ", v.fullname, "grey"], ["短名: ", v.shortname, "gery"], ["地址: ", v.address, "grey"], ["法人: ", v.corporation, "grey"], ["电话: ", v.phone, "grey"], ["装修组织: ", com.checkNull(v.drganization.name, "无"), "grey"], ["销售组织: ", com.checkNull(v.srganization.name, "无"), "grey"], ["业务类型: ", company.atttype[v.atttype], "red"], ["板块: ", constant.system().company.block.keys[v.block], "red"]];
            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>').appendTo($ulProperty);
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            });

            // 启用禁用
            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                "type": "checkbox"
            }).appendTo($btnStatus);
            var $span = $('<span></span>').addClass('lbl status-lbl').appendTo($btnStatus);

            v.status == 0 && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click", function() {

                $statusSwitch.prop("checked") ? (updateStatus(v.cid, 0, function() {

                    $statusSwitch.removeAttr("checked")
                })) : (updateStatus(v.cid, 1, function() {

                    $statusSwitch.prop("checked")
                }));
            });

            $divBtnWrap.append($btnEdit).append($btnEdit).append($btnStatus).appendTo($h3);
            $divBtnWrap.append($btnOrganization).append($btnOrganization).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function() {

                company.company = v;

                edit(v);
            });

            $btnOrganization.click(function() {

                company.company = v;

                organization(v);
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    com.initTypeahead('drganization', api.system.queryOrganization, "organization.name", {}, 'organizations', 'oid', 'name', null);
    com.initTypeahead('srganization', api.system.queryOrganization, "organization.name", {}, 'organizations', 'oid', 'name', null);

    var searcher = new Searcher();

    searcher.init(["system-company-name", "system-company-status", "system-company-atttype"], "condList", api.system.pageCompany, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "companyPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addCompany').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    // 编辑
    function edit(row) {

        company.items.cid.val(row.cid);
        company.items.no.val(row.no);
        company.items.code.val(row.code);
        company.items.name.val(row.name);
        company.items.shortname.val(row.shortname);
        company.items.fullname.val(row.fullname);
        company.items.address.val(row.address);
        company.items.corporation.val(row.corporation);
        company.items.phone.val(row.phone);
        company.items.atttype.val(row.atttype);
        company.items.block.val(row.block);

        company.items.no.prop("disabled", true);

        company.modals.updateCompanyModal.modal("show"); // 弹出弹层
    }

    // 组织
    function organization(row) {

        com.updateTypeahead(company.items.drganization, row.drganization.oid, row.drganization.name);
        com.updateTypeahead(company.items.srganization, row.srganization.oid, row.srganization.name);

        company.modals.updateOrganizationModal.modal("show"); // 弹出弹层
    }

    // 保存
    function saveData() {

        if (com.validate("updateCompanyModal"))
            return false;

        var url = api.system.addCompany;
        var options = {
            "company.no": company.items.no.val(),
            "company.code": company.items.code.val(),
            "company.name": company.items.name.val(),
            "company.shortname": company.items.shortname.val(),
            "company.fullname": company.items.fullname.val(),
            "company.address": company.items.address.val(),
            "company.corporation": company.items.corporation.val(),
            "company.phone": company.items.phone.val(),
            "company.atttype": company.items.atttype.val(),
            "company.block": company.items.block.val(),
        };

        if (company.company) {
            url = api.system.updateCompany;
            options["company.cid"] = company.company.cid;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        company.modals.updateCompanyModal.modal("hide");
    }

    // 组织保存
    function updateOrganization() {

        if (com.validate("updateOrganizationModal"))
            return false;

        var options = {
            "company.cid": company.company.cid,
            "company.no": company.company.no,
            "company.code": company.company.code,
            "company.name": company.company.name,
            "company.shortname": company.company.shortname,
            "company.fullname": company.company.fullname,
            "company.address": company.company.address,
            "company.corporation": company.company.corporation,
            "company.phone": company.company.phone,
            "company.atttype": company.company.atttype,
            "company.block": company.company.block,

            "company.drganization.oid": com.typeahead(company.items.drganization),
            "company.srganization.oid": com.typeahead(company.items.srganization)

        };

        var url = api.system.updateCompany;

        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        company.modals.updateOrganizationModal.modal("hide");
    }

    // 添加
    com.focusPage('[name="addCompany"]', com.focusPage('#pagenation')).on("click", function() {

        company.company = null;

        company.items.no.prop("disabled", false);
        com.cleanItems(company.items);

        company.modals.updateCompanyModal.modal("show");
    });

    // 启用禁用功能
    function updateStatus(id, status, failcallBack) {

        com.post(api.system.updateCompanyForStatus, {
            "company.cid": id,
            "company.status": status
        });
    }

});
