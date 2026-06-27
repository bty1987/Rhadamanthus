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

    function buildCompanyLineprops() {

        return [{
            field: "no",
            name: "编号",
            prop: "no",
            clazz: "grey"
        }, {
            field: "code",
            name: "code",
            prop: "code",
            clazz: "gery"
        }, {
            field: "fullname",
            name: "全名",
            prop: "fullname",
            clazz: "grey"
        }, {
            field: "shortname",
            name: "短名",
            prop: "shortname",
            clazz: "gery"
        }, {
            field: "address",
            name: "地址",
            prop: "address",
            clazz: "grey"
        }, {
            field: "corporation",
            name: "法人",
            prop: "corporation",
            clazz: "grey"
        }, {
            field: "phone",
            name: "电话",
            prop: "phone",
            clazz: "grey"
        }, {
            field: "drganization.name",
            name: "装修组织",
            prop: function(v) { return com.checkNull(v.drganization.name, "无"); },
            clazz: "grey"
        }, {
            field: "srganization.name",
            name: "销售组织",
            prop: function(v) { return com.checkNull(v.srganization.name, "无"); },
            clazz: "grey"
        }, {
            field: "atttype",
            name: "业务类型",
            prop: function(v) { return company.atttype[v.atttype]; },
            clazz: "red"
        }, {
            field: "block",
            name: "板块",
            prop: function(v) { return constant.system().company.block.keys[v.block]; },
            clazz: "red"
        }];
    }

    function buildCompanyLinebtns() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    company.company = v;
                    edit(v);
                }
            },
            organization: {
                name: "组织",
                clazz: "btn-success",
                handle: function(v) {
                    company.company = v;
                    organization(v);
                }
            },
            status: {
                name: "状态",
                type: "switch",
                clazz: "status-lbl",
                init: function(v) {
                    return v.status == 0;
                },
                handle: function(v, check) {
                    updateStatus(v.cid, check ? 0 : 1, null);
                }
            }
        };
    }

    function buildCompanyButtons() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addCompany').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    }

    com.initTypeahead('drganization', api.system.queryOrganization, "organization.name", {}, 'organizations', 'oid', 'name', null);
    com.initTypeahead('srganization', api.system.queryOrganization, "organization.name", {}, 'organizations', 'oid', 'name', null);

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.system.pageCompany, null, ["system-company-name", "system-company-status", "system-company-atttype"], "companyPostData", null, false, buildCompanyButtons);
    searcher.line(function(v) { return v.no + " " + v.name; }, buildCompanyLineprops(), buildCompanyLinebtns()).render();

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
