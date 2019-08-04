var drawNode = {};
$(function () {

    function createWizardStep(id, title) {
        var li = createLi("complete").attr("data-target", "#step" + id);

        if (id == 1) li.attr("class", "complete active");
        var setpSpan = $('<span></span>').attr("class", "step").text(id);
        var titleSpan = $('<span></span>').attr("class", "title").text(title);

        li.append(setpSpan).append(titleSpan);
        return li;
    }

    function createStepPane(id) {
        return $('<div></div>').attr("class", "step-pane active").attr("id", "step" + id);
    }

    function createDiv(classes, id, css) {
        var div = $('<div></div>').attr("class", classes);
        if (id) div.attr("id", id);
        if (css) div.attr("style", css);
        return div;
    }

    function createForm(classes) {
        return classes == null ? $('<form></form>').attr("class", "form-horizontal") : $('<form></form>').attr("class", classes);
    }

    function createLabel(classes, text, forId) {
        var label = $('<label></label>').attr("class", classes).text(text);
        if (forId) label.attr("for", forId);
        return label;
    }

    function createInput(id, classes, readonly, type, value) {
        var input = $('<input>').attr("id", id).attr("type", type == null ? "text" : type).attr("class", classes).attr("value", value == null ? "" : value);
        if (readonly)  input.attr("readonly", "readonly");
        return input;
    }

    function createSelect(id, classes, options, css, placeholder, toggle, trigger) {
        var select = $('<select></select>').attr("id", id).attr("class", classes).prop("disabled", true);
        if (css) select.attr("style", css);
        if (placeholder) select.attr("data-placeholder", placeholder);
        if (toggle) select.attr("data-toggle", toggle);
        if (trigger) select.attr("data-trigger", trigger);
        if ($.isEmptyObject(options)) return select;
        $.each(options, function (i, v) {
            select.append("<option value='" + v["value"] + "'>" + v["text"] + "</option>");
        });
        return select;
    }

    function createButton(conf, id, classes, text, type, icon) {
        var button = $('<button></button>').attr("id", id).attr("class", classes);
        if (text) button.text(text);
        if (type) button.attr("type", type);
        if (icon) button.prepend(icon);
        if (!checkButton(conf, button)) return $('<button></button>').attr("class", "hidden");
        return button;
    }

    function createSpan(classes, css, text) {
        var span = $('<span></span>').attr("class", classes).text(text);
        if (css) span.attr("style", css);
        return span;
    }

    function createUl(id, classes, css) {
        var ul = $("<ul></ul>").attr("class", classes);
        if (css) ul.attr("style", css);
        if (id) ul.attr("id", id);
        return ul;
    }

    function createLi(classes) {
        var li = $('<li></li>');
        if (classes) li.attr("class", classes);
        return li;
    }

    function checkButton(conf, button) {
        if ($.isEmptyObject(conf.opt)) return false;
        if ($.isEmptyObject(conf.opt.btn)) return false;
        var flag = false;
        var id = button.attr("id");
        $.each(conf.opt.btn, function (i, v) {
            if (v == id) {
                flag = true;
                if (id = "houseType") {
                    var statuses = ["初始", "定金"];
                    if (statuses.indexOf(params.orederStatus)) {
                        button.prop("disabled", false);
                    } else {
                        params.orederStatus == "已签约" ? button.prop("disabled", true) : button.prop("disabled", false);
                    }
                }
            }
        });

        return flag;
    }

    function drawBasic(conf) {
        var row1 = createDiv("row");
        var form1 = createForm();
        var left1 = createDiv("col-xs-12 col-sm-5").append(createDiv("control-group").append(
            createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "订单号", "orderId"), createDiv("col-sm-9").append(createInput("orderId", "col-xs-10 col-sm-5", true, "text")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "客户名", "customer"), createDiv("col-sm-9").append(createInput("customer", "col-xs-10 col-sm-5", true, "text")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "", "customerInfosBtn"), createDiv("col-sm-9").append(createButton(conf, "customerInfosBtn", "btn btn-xs btn-danger col-xs-10 col-sm-5", "客户信息", "button"), createButton(conf, "customerChangeBtn", "btn btn-xs btn-info", "修改客户信息", "button")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "楼盘地址", "houseAddr"), createDiv("col-sm-9").append(createInput("houseAddr", "col-xs-10 col-sm-5", true), createButton(conf, "villageChangeBtn", "btn btn-xs btn-info", "修改房产信息", "button")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "设计部", "designDepartment"), createDiv("col-sm-9").append(createInput("designDepartment", "col-xs-10 col-sm-5", true, "text")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "设计师", "designer"), createDiv("col-sm-9").append(createInput("designer", "col-xs-10 col-sm-5", true, "text")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "业务部门", "businessDepartment"), createDiv("col-sm-9").append(createInput("businessDepartment", "col-xs-10 col-sm-5", true, "text")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "业务员", "salesman"), createDiv("col-sm-9").append(createInput("salesman", "col-xs-10 col-sm-5", true, "text")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "业务人员类型", "salesmanType"), createDiv("col-sm-9").append(createInput("salesmanType", "col-xs-10 col-sm-5", true, "text")))
        ));
        var right1 = createDiv("col-xs-12 col-sm-5").append(createDiv("control-group").append(
            createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "等级", "grade"), createDiv("col-sm-9").append(createSelect("grade", "col-xs-10 col-sm-5", [], null, null, "popover", "manual")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "订单类型", "orderType"), createDiv("col-sm-9").append(createSelect("orderType", "col-xs-10 col-sm-5", [], null, null, "popover", "manual")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "房屋类别", "houseType"), createDiv("col-sm-9").append(createSelect("houseType", "col-xs-10 col-sm-5", [], null, null, "popover", "manual")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "房屋类型", "houseClass"), createDiv("col-sm-9").append(createSelect("houseClass", "col-xs-10 col-sm-5", [], null, null, "popover", "manual")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "建筑面积", "houseArea"), createDiv("col-sm-9").append(createInput("houseArea", "col-xs-10 col-sm-5 v_float v_required", true, "text", "0")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "订单状态", "status"), createDiv("col-sm-9").append(createInput("status", "col-xs-10 col-sm-5", true, "text", "0")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "量房时间", "measureTime"), createDiv("col-sm-9").append(createInput("measureTime", "col-xs-10 col-sm-5", true, "text", "0")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "报价员", "quoterId"), createDiv("col-sm-9").append(createInput("quoterId", "col-xs-10 col-sm-5",[], null, null, "popover", "manual")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "跟单员", "escorterId"), createDiv("col-sm-9").append(createInput("escorterId", "col-xs-10 col-sm-5", [], null, null, "popover", 'manual')))
        ));
        form1.append(left1, right1).appendTo(row1);

        var row2 = createDiv("row");
        var form2 = createForm();
        var left2 = createDiv("col-xs-12 col-sm-5").append(
            createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "非业务人员名称", "notSalesmanName"), createDiv("col-sm-9").append(createInput("notSalesmanName", "col-xs-10 col-sm-5 v_name", true, "text").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("maxlength", "8")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "非业务提点", "notSalesmanRate"), createDiv("col-sm-9").append(createInput("notSalesmanRate", "col-xs-10 col-sm-5  v_required v_float", true, "text").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("maxlength", "11").attr("value", "0")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "非业务人员手机", "notSalesmanPhone"), createDiv("col-sm-9").append(createInput("notSalesmanPhone", "col-xs-10 col-sm-5  v_phone", true, "text").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("maxlength", "11")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "非业务备注", "notSalesmanContent"), createDiv("col-sm-9").append('<textarea id="notSalesmanContent" class="col-xs-10 col-sm-5"rows="3" data-toggle="popover"data-trigger="manual" maxlength="128"readonly="readonly"></textarea>'))
        );
        var right2 = createDiv("col-xs-12 col-sm-5").append(
            createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "返单人员名称", "backOrderName"), createDiv("col-sm-9").append(createInput("backOrderName", "col-xs-10 col-sm-5 v_name", true, "text").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("maxlength", "8")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "返单人员电话", "backOrderPhone"), createDiv("col-sm-9").append(createInput("backOrderPhone", "col-xs-10 col-sm-5 v_phone", true, "text").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("maxlength", "11")))
            , createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "返单人员备注", "backOrderContent"), createDiv("col-sm-9").append('<textarea id="backOrderContent" class="col-xs-10 col-sm-5"rows="3" data-toggle="popover"data-trigger="manual" maxlength="128"readonly="readonly"></textarea>'))
        );
        form2.append(left2, right2).appendTo(row2);
        return [row1, $('<hr>'), row2];
    }

    function drawQuotaion(conf) {
        var row = createDiv("row").append(
            createDiv("col-md-8").append(
                createDiv("form-group").append(createLabel("col-md-2 control-label no-padding-right", "显示方式", "showWay")
                    , createDiv("col-md-6").append(createSelect("showWay", "col-md-6", [{
                        "text": "功能区分组",
                        "value": 0
                    }, {"text": "工种分组", "value": 1}]).prop("disabled", false))
                )
            )
            , createDiv("col-md-4 text-right").append(
                createDiv("form-group").append(
                    createDiv("col-md-12").append(createButton(conf, "btnPrintDefaultQuotationInfo", "btn btn-info", "打印报价", null, '<i class="icon-print bigger-120"></i>'))
                )
            )
            , createDiv("col-md-12", "quotationItemListDiv"));

        return [row];
    }

    function drawPicture(conf) {

        var row1 = createDiv("row").append(createDiv("col-md-6").append(createDiv("col-md-2", "OriginalUpload"), createDiv("col-md-2", "designPictureUpload"), createDiv("col-md-2", "projectPictureUpload"), createDiv("col-md-2", "ContractUpload"),createDiv("col-md-2", "CADUpload")));

        var contractMap = createDiv("col-xs-12").append(createLabel("control-label", "合同图:").attr("style", "margin-left: 20px;margin-top: 20px;"), createDiv("col-md-12 hr"), createDiv("row-fluid").append(createUl("ContractPictures", "ace-thumbnails")));

        var row2 = createDiv("row").append(
            createDiv("col-xs-12").append(createLabel("control-label", "原始图:").attr("style", "margin-left: 20px;margin-top: 20px;"), createDiv("col-md-12 hr"), createDiv("row-fluid").append(createUl("OriginalPicture", "ace-thumbnails")))
            , createDiv("col-xs-12").append(createLabel("control-label", "效果图:").attr("style", "margin-left: 20px;margin-top: 20px;"), createDiv("col-md-12 hr"), createDiv("row-fluid").append(createUl("designPictures", "ace-thumbnails")))
            , createDiv("col-xs-12").append(createLabel("control-label", "工程图:").attr("style", "margin-left: 20px;margin-top: 20px;"), createDiv("col-md-12 hr"), createDiv("row-fluid").append(createUl("projectPictures", "ace-thumbnails")))
            , conf.contracts == "noShow" ? null : contractMap
            , createDiv("col-xs-12").append(createLabel("control-label", "工程文件:").attr("style", "margin-left: 20px;margin-top: 20px;"), createDiv("col-md-12 hr"), createDiv("row-fluid").append(createDiv("col-sm-7 infobox-container", "CADProjectPicture")))

        );
        return [row1, row2];
    }

    function drawMaterial(conf) {

        var row = createDiv("row");
        var left = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable ").append(createDiv("tabbable").append(
            createUl("myTab", "nav nav-tabs", "margin-top: 7px;").append(
                createLi("active").append($("<a></a>").attr("data-toggle", "tab").attr("href", "#fanglinMaterialPayments" + conf).css("color", "#4383b4").append($("<strong></strong>").text("主材款项")))
                , createLi().append($("<a></a>").attr("data-toggle", "tab").attr("href", "#salesMaterialPayments" + conf).css("color", "#4383b4").append($("<strong></strong>").text("销售款项")))
            )
            , createDiv("tab-content").append(createDiv("tab-pane in active", "fanglinMaterialPayments" + conf, "margin-left: -12px;"), createDiv("tab-pane", "salesMaterialPayments" + conf, "margin-left: -12px;"))
        ));
        var right = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable ").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h5></h5>").append($("<strong></strong>").text("品牌汇总"))), createDiv("widget-body").append(createDiv("widget-body-inner", "materialPaymentBrands" + conf))));
        row.append(left, right);
        return [row];
    }

    function drawActivity(conf) {
        var row = createDiv("row").append(
            createDiv("col-md-12").append(createButton(conf, "joinActivityBtn", "btn btn-info", "参加活动", "button", '<i class="icon-cog bigger-110"></i>'), createButton(conf, "applyActivityItemBtn", "btn btn-info", "申领活动物品", "button", '<i class="icon-cog bigger-110"></i>'), createDiv("col-sm-6", "activityPriceInfo").attr("style", "padding:0px;float:right;text-align:right;"))
            , createDiv("col-md-12 hr"), createDiv("col-md-12", null, "padding: 0;margin: 0 8px;font-size: 24px;color: #2679b5;").html("活动"), createDiv("col-md-12", "activitys"), createDiv("col-md-12 hr"), createDiv("col-md-12", null, "padding: 0;margin: 0 8px;font-size: 24px;color: #2679b5;").html("奖品"), createDiv("col-md-12", "activityItems")
        );

        return [row];
    }

    function drawPayment(conf) {
        var row1 = createDiv("row", "preparePayment");
        row1.append(createDiv("widget-container-span").append(
            createDiv("widget-box transparent").append(
                createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("预付款项信息")))
                , createDiv("widget-body").append(createDiv("widget-body-inner").append(createDiv("clearfix", null, "margin-top: 15px; margin-bottom: 15px;").append(
                    createDiv("col-md-3", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("合同预付款"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "balanceAdvance").text(0)))
                    , createDiv("col-md-3", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("工程预付款"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "projectAdvance").text(0)))
                    , createDiv("col-md-3", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("主材预付款"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "materialAdvance").text(0)))
                    , createDiv("col-md-3", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("正林预付款"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "zaterialAdvance").text(0)))
                )))
            )
            , createDiv("hr col-md-12")
            )
        );
        var row2 = createDiv("row").append(createDiv("col-md-6").append(createButton(conf, "btnSetDecorationPaymentInfo", "btn btn-info", "生成款项", "button", '<i class="icon-cog bigger-110">'), createButton(conf, "btnOtherPayment", "btn btn-info", "其他款项", "button", '<i class="icon-cog bigger-110">').attr("style", "margin-left: 5px")));
        var row3 = createDiv("row");
        row3.append(createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent", "basePaymentWidget").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("基本款项信息"))), createDiv("widget-body").append(createDiv("widget-body-inner", "basePaymentDiv")))), createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent", "otherPaymentWidget").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("其他项信息"))), createDiv("widget-body").append(createDiv("widget-body-inner", "otherPaymentDiv")))));
        return [row1, row2, row3];
    }

    function drawBelong(conf) {
        var row = createDiv("row");
        var left = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h5></h5>").append($("<strong></strong>").text("归属设计信息"))), createDiv("widget-body").append(createDiv("widget-body-inner", "belongDesignInfo"))));
        var right = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h5></h5>").append($("<strong></strong>").text("归属业务信息"))), createDiv("widget-body").append(createDiv("widget-body-inner", "belongSalesmanInfo"))));
        row.append(left, right);
        return [row];
    }

    function drawAddreuce(conf) {
        return [createDiv("row", "resLists")];
    }

    function drawAccount(conf) {
        return [createDiv("row", "accountPayment")];
    }

    function drawService(conf) {

        var row = createDiv("row", "serviceInfo ");
        var left = createDiv("col-xs-12 col-md-12 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("服务信息"))), createDiv("widget-body").append(createDiv("widget-body-inner", "serviceInfo"))));
        row.append(left);

        return [row];

    }

    drawNode = {
        draw: function (nodes) {
            var dataPage = params.urlLoadParams.depage;
            var wizard = com.focusPage("#fuelux-wizard");
            var ul = createUl(null, "wizard-steps");
            var container = com.focusPage("#step-container");
            params.detail = [];

            var isdesignPictureUpload = false;
            var isprojectPictureUpload = false;
            var isCADUpload = false;
            var isContractUpload = false;
            var isOriginalUpload = false;

            var title = {
                "basic": "基本信息",
                "quotation": "报价信息",
                "picture": "图纸信息",
                "material": "主材信息",
                "activity": "活动信息",
                "payment": "款项信息",
                "belong": "归属信息",
                "addreduce": "增减项",
                "account": "决算信息",
                "service": "服务信息"
            };

            if ($.isEmptyObject(nodes)) return;
            $.each(nodes, function (i, v) {
                params.detail.push(i);
                ul.append(createWizardStep(i , title[v.type]));
                var stepPane = createStepPane(i);
                var rows = [];
                switch (v.type) {
                    case "basic":
                        rows = drawBasic(v);
                        break;
                    case "quotation":
                        rows = drawQuotaion(v);
                        break;
                    case "picture":
                        rows = drawPicture(v);
                        break;
                    case "material":
                        rows = drawMaterial(dataPage);
                        break;
                    case "activity":
                        rows = drawActivity(v);
                        break;
                    case "payment":
                        rows = drawPayment(v);
                        break;
                    case "belong":
                        rows = drawBelong(v);
                        break;
                    case "addreduce":
                        rows = drawAddreuce(v);
                        break;
                    case "account":
                        rows = drawAccount(v);
                        break;
                    case "service":
                        rows = drawService(v);
                        break;
                }
                $.each(rows, function (j, b) {
                    stepPane.append(b);
                });
                stepPane.appendTo(container);

                if ($.isEmptyObject(v.opt)) return;
                if ($.isEmptyObject(v.opt.show)) return;

                $.each(v.opt.show, function (j, x) {
                    var $Obj = com.focusPage("#" + x);
                    if ($Obj[0].tagName.toLowerCase() == "input") {
                        $Obj.removeAttr("readonly");
                    } else if ($Obj[0].tagName.toLowerCase() == "select") {
                        $Obj.prop("disabled", false);
                    } else if ($Obj[0].tagName.toLowerCase() == "textarea") {
                        $Obj.removeAttr("readonly");
                    }
                    if (v.type == "picture") {
                        switch (x) {
                            case "designPictureUpload":
                                isdesignPictureUpload = true;
                                break;
                            case "projectPictureUpload":
                                isprojectPictureUpload = true;
                                break;
                            case "OriginalUpload":
                                isOriginalUpload = true;
                                break;
                            case "CADUpload":
                                isCADUpload = true;
                                break;
                            case "ContractUpload":
                                isContractUpload = true;
                                break;
                        }
                    }
                    if (x == 'orderType') {
                        if (!(params.orederStatus == '初始' || params.orederStatus == '定金' || params.orederStatus == '重签')) {
                            $Obj.prop("disabled", true);
                        }
                    }
                });
            });
            ul.appendTo(wizard);
            if (isdesignPictureUpload) {
                decorationUtils.loadHuploadify("designPictureUpload", "上传效果图", "*.jpg;*.jpge;*.gif;*.png", true, function (data) {
                    decorationUtils.addDecorationPicture(data, 1, "designPictures");
                }, "btn btn-success");
            }
            if (isprojectPictureUpload) {
                decorationUtils.loadHuploadify("projectPictureUpload", "上传工程图", "*.jpg;*.jpge;*.gif;*.png", true, function (data) {
                    decorationUtils.addDecorationPicture(data, 2, "projectPictures");
                }, "btn btn-primary");
            }
            if (isOriginalUpload) {
                decorationUtils.loadHuploadify("OriginalUpload", "上传原始图片", "*.jpg;*.jpge;*.gif;*.png", true, function (data) {
                    decorationUtils.addDecorationPicture(data, 4, "OriginalPicture");
                }, "btn btn-purple");
            }
            if (isCADUpload) {
                decorationUtils.loadHuploadify("CADUpload", "上传工程文件", "*.dwg;*.dwt", false, function (data) {
                    decorationUtils.addDecorationPicture(data, 0, "CADProjectPicture");
                }, "btn btn-warning");
            }
            if (isContractUpload) {
                decorationUtils.loadHuploadify("ContractUpload", "上传合同图片", "*.jpg;*.jpge;*.gif;*.png", true, function (data) {
                    decorationUtils.addDecorationPicture(data, 3, "ContractPictures");
                }, "btn btn-inverse");
            }

        }, getConfig: function (page) {

            var pageConfig = {
                "apiPage": null,
                "pageBtn": [],
                "postDataName": page + "PostData",
                "nodes": {},
                "condArr": [],
                "propertyArr": [],
                "hasExport": null
            };

            function packageConfig(o, props, value, subtype){

                var prop = props.shift();
                if(props.length != 0){
                    if(!o[prop]) o[prop] = {};
                    packageConfig(o[prop], props, value, subtype);
                    return;
                }

                if(subtype == 0){
                    o[prop] = value;
                } else if(subtype == 1 && !o[prop]){
                    o[prop] = [value];
                } else if(subtype == 1 && o[prop]){
                    o[prop].push(value);
                }
            }

            function getApi(o, props){

                var prop = props.shift();

                if(props.length == 0){
                    return o[prop];
                } else if(o[prop]){
                    return getApi(o[prop], props);
                }
                return "";
            }

            com.post(api.right.queryDecorationFunctionRightByName, {"decorationFunctionRight.name": page}, function (res) {

                $.each(res.decorationFunctionRights, function (i, v) {

                    var data = v.decorationFunction;

                    if(data.type == 1) data.value = getApi({"api": api}, data.value.split("."));
                    
                    packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
                });
            }, null, false);

            if (page == "salesmanmanager") {
                pageConfig.condArr.push("selectCompany");
            }

            return pageConfig;
        },
    };

});