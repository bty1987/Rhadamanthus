var drawNode = {};
$(function() {

    function createWizardStep(id, title) {

        var li = createLi("complete").attr("data-target", "#step" + id);

        if (id == 1)
            li.attr("class", "complete active");
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
        if (id)
            div.attr("id", id);
        if (css)
            div.attr("style", css);
        return div;
    }

    function createForm(classes) {

        return classes == null ? $('<form></form>').attr("class", "form-horizontal") : $('<form></form>').attr("class", classes);
    }

    function createLabel(classes, text, forId) {

        var label = $('<label></label>').attr("class", classes).text(text);
        if (forId)
            label.attr("for", forId);
        return label;
    }

    function createInput(id, classes, readonly, type, value) {

        var input = $('<input>').attr("id", id).attr("type", type == null ? "text" : type).attr("class", classes).attr("value", value == null ? "" : value);
        if (readonly)
            input.attr("readonly", "readonly");
        return input;
    }

    function createSelect(id, classes, options, css, placeholder, toggle, trigger) {

        var select = $('<select></select>').attr("id", id).attr("class", classes).prop("disabled", true);
        if (css)
            select.attr("style", css);
        if (placeholder)
            select.attr("data-placeholder", placeholder);
        if (toggle)
            select.attr("data-toggle", toggle);
        if (trigger)
            select.attr("data-trigger", trigger);
        if ($.isEmptyObject(options))
            return select;
        $.each(options, function(i, v) {

            select.append("<option value='" + v["value"] + "'>" + v["text"] + "</option>");
        });
        return select;
    }

    function createButton(conf, id, classes, text, type, icon) {

        var button = $('<button></button>').attr("id", id).attr("class", classes);
        if (text)
            button.text(text);
        if (type)
            button.attr("type", type);
        if (icon)
            button.prepend(icon);
        if (!checkButton(conf, button))
            return $('<button></button>').attr("class", "hidden");

        return button;
    }

    function createSpan(classes, css, text) {

        var span = $('<span></span>').attr("class", classes).text(text);
        if (css)
            span.attr("style", css);
        return span;
    }

    function createUl(id, classes, css) {

        var ul = $("<ul></ul>").attr("class", classes);
        if (css)
            ul.attr("style", css);
        if (id)
            ul.attr("id", id);
        return ul;
    }

    function createLi(classes) {

        var li = $('<li></li>');
        if (classes)
            li.attr("class", classes);
        return li;
    }

    function checkButton(conf, button) {

        if ($.isEmptyObject(conf.opt))
            return false;
        if ($.isEmptyObject(conf.opt.btn))
            return false;
        var flag = false;
        var id = button.attr("id");
        $.each(conf.opt.btn, function(i, v) {

            if (v == id) {
                flag = true;
                if (id == "houseType") {
                    var statuses = ["初始", "定金"];
                    if (statuses.indexOf(params.decoration.orederStatus)) {
                        button.prop("disabled", false);
                    } else {
                        params.decoration.orederStatus == "已签约" ? button.prop("disabled", true) : button.prop("disabled", false);
                    }
                }
            }
        });

        return flag;
    }

    function drawBasic(conf, stepPane) {

        var row1 = createDiv("row").appendTo(stepPane);
        var form1 = createForm();

        var left1 = createDiv("col-xs-12 col-sm-6");
        var leftgroup1 = createDiv("control-group").appendTo(left1);
        var leftitems1 = [];

        leftitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "装修单号", "orderId"), createDiv("col-sm-9").append(createInput("orderId", "col-xs-10 col-sm-5", true, "text"))));
        leftitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "客户名", "customer"), createDiv("col-sm-9").append(createInput("customer", "col-xs-10 col-sm-5", true, "text"))));
        leftitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "", "customerInfosBtn"), createDiv("col-sm-9").append(createButton(conf, "customerInfosBtn", "btn btn-xs btn-danger col-xs-10 col-sm-5", "客户信息", "button").css("padding", "5px 4px"), createButton(conf, "customerChangeBtn", "btn btn-xs btn-info", "修改客户信息", "button").css("margin", "2px 5px"))));
        leftitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "楼盘", "villageName"), createDiv("col-sm-9").append(createInput("villageName", "col-xs-10 col-sm-5", true), createButton(conf, "villageChangeBtn", "btn btn-xs btn-info", "修改房产信息", "button").css("margin", "2px 5px"))));
        leftitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "楼号", "houseNumber"), createDiv("col-sm-9").append(createInput("houseNumber", "col-xs-10 col-sm-5", true, "text"))));
        leftitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "设计部", "designDepartment"), createDiv("col-sm-9").append(createInput("designDepartment", "col-xs-10 col-sm-5", true, "text"))));
        leftitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "赠送面积", "freeArea"), createDiv("col-sm-9").append(createInput("freeArea", "col-xs-10 col-sm-5", true, "text", "0"))));
        leftitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "总面积", "totalArea"), createDiv("col-sm-9").append(createInput("totalArea", "col-xs-10 col-sm-5", true, "text", "0"))));
        leftitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "设计师", "designer"), createDiv("col-sm-9").append(createInput("designer", "col-xs-10 col-sm-5", true, "text"))));
        leftitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "业务部门", "businessDepartment"), createDiv("col-sm-9").append(createInput("businessDepartment", "col-xs-10 col-sm-5", true, "text"))));
        leftitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "业务员", "salesman"), createDiv("col-sm-9").append(createInput("salesman", "col-xs-10 col-sm-5", true, "text"))));
        leftitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "业务类型", "busitype"), createDiv("col-sm-9").append(createSelect("busitype", "col-xs-10 col-sm-5", [], null, null, "popover", "manual"))));

        leftgroup1.append(leftitems1);

        var right1 = createDiv("col-xs-12 col-sm-6");
        var rightgroup1 = createDiv("control-group").appendTo(right1);
        var rightitems1 = [];

        rightitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "等级", "grade"), createDiv("col-sm-9").append(createSelect("grade", "col-xs-10 col-sm-5", [], null, null, "popover", "manual"))));
        rightitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "订单类型", "orderType"), createDiv("col-sm-9").append(createSelect("orderType", "col-xs-10 col-sm-5", [], null, null, "popover", "manual"), $('<button></button>').attr("id", "typeChangeBtn").attr("class", "btn btn-xs btn-info").text("更新").attr("type", "button").css("margin", "2px 5px"))));
        rightitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "房屋类别", "houseType"), createDiv("col-sm-9").append(createSelect("houseType", "col-xs-10 col-sm-5", [], null, null, "popover", "manual"))));
        rightitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "房屋类型", "houseClass"), createDiv("col-sm-9").append(createSelect("houseClass", "col-xs-10 col-sm-5", [], null, null, "popover", "manual"))));
        rightitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "户型", "houseTypeClass"), createDiv("col-sm-9").append(createInput("houseTypeClass", "col-xs-10 col-sm-5", true, "text", "0"))));
        rightitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "派尺面积", "houseArea"), createDiv("col-sm-9").append(createInput("houseArea", "col-xs-10 col-sm-5", true, "text", "0"))));
        rightitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "计价面积", "innerArea"), createDiv("col-sm-9").append(createInput("innerArea", "col-xs-10 col-sm-5", true, "text", "0"))));
        rightitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "订单状态", "status"), createDiv("col-sm-9").append(createInput("status", "col-xs-10 col-sm-5", true, "text", "0"))));
        rightitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "量房时间", "measureTime"), createDiv("col-sm-9").append(createInput("measureTime", "col-xs-10 col-sm-5", true, "text", "0"))));
        rightitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "报价员", "quoterId"), createDiv("col-sm-9").append(createInput("quoterId", "col-xs-10 col-sm-5", [], null, null, "popover", "manual"))));
        rightitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "方案设计", "escorterId"), createDiv("col-sm-9").append(createInput("escorterId", "col-xs-10 col-sm-5", [], null, null, "popover", 'manual'))));
        rightitems1.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "跟单员", "materialerId"), createDiv("col-sm-9").append(createInput("materialerId", "col-xs-10 col-sm-5", [], null, null, "popover", 'manual'))));
        rightgroup1.append(rightitems1);
        form1.append(left1, right1).appendTo(row1);

        $('<hr>').appendTo(stepPane);

        var row2 = createDiv("row").appendTo(stepPane);
        var form2 = createForm();

        var left2 = createDiv("col-xs-12 col-sm-6");
        var leftgroup2 = createDiv("control-group").appendTo(left2);
        var leftitems2 = [];

        leftitems2.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "非业务人员名称", "notSalesmanName"), createDiv("col-sm-9").append(createInput("notSalesmanName", "col-xs-10 col-sm-5 v_name", true, "text").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("maxlength", "8"))));
        leftitems2.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "非业务提点", "notSalesmanRate"), createDiv("col-sm-9").append(createInput("notSalesmanRate", "col-xs-10 col-sm-5 v_required v_float_3", true, "text").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("maxlength", "11").attr("value", "0")).append($('<button></button>').attr("id", "notSalesmanRateChangeBtn").attr("class", "btn btn-xs btn-info").text("更新").attr("type", "button").css("margin", "2px 5px"))));
        leftitems2.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "非业务人员手机", "notSalesmanPhone"), createDiv("col-sm-9").append(createInput("notSalesmanPhone", "col-xs-10 col-sm-5 v_phone", true, "text").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("maxlength", "11"))));
        leftitems2.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "非业务备注", "notSalesmanContent"), createDiv("col-sm-9").append('<textarea id="notSalesmanContent" class="col-xs-10 col-sm-5"rows="3" data-toggle="popover"data-trigger="manual" maxlength="128"readonly="readonly"></textarea>')));

        leftgroup2.append(leftitems2);

        var right2 = createDiv("col-xs-12 col-sm-6");
        var rightgroup2 = createDiv("control-group").appendTo(right2);
        var rightitems2 = [];

        rightitems2.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "返单人员名称", "backOrderName"), createDiv("col-sm-9").append(createInput("backOrderName", "col-xs-10 col-sm-5 v_name", true, "text").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("maxlength", "8"))));
        rightitems2.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "返单人员电话", "backOrderPhone"), createDiv("col-sm-9").append(createInput("backOrderPhone", "col-xs-10 col-sm-5 v_phone", true, "text").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("maxlength", "11"))));
        rightitems2.push(createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right", "返单人员备注", "backOrderContent"), createDiv("col-sm-9").append('<textarea id="backOrderContent" class="col-xs-10 col-sm-5"rows="3" data-toggle="popover"data-trigger="manual" maxlength="128"readonly="readonly"></textarea>')));

        rightgroup2.append(rightitems2);

        form2.append(left2, right2).appendTo(row2);

        var $show = conf.opt == null ? [] : conf.opt.show == null ? [] : conf.opt.show;

        $.each($show, function(j, x) {

            var $obj = com.focusPage("#" + x);
            if ($obj[0].tagName.toLowerCase() == "input") {
                $obj.removeAttr("readonly");
            } else if ($obj[0].tagName.toLowerCase() == "select") {
                $obj.prop("disabled", false);
            } else if ($obj[0].tagName.toLowerCase() == "textarea") {
                $obj.removeAttr("readonly");
            }
        });

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": "notSalesmanRate"
        }, function(res) {

            if (!res.systemConfig.value)
                return false;

            var data = [];

            $.each(res.systemConfig.value.split(","), function(i, v) {

                data.push({
                    "k": v,
                    "v": v
                });
            });

            var item = com.focusPage("#notSalesmanRate", leftgroup2);
            var tmp = createSelect("notSalesmanRate", "col-xs-10 col-sm-5", [], null, null, "popover", "manual").prop("disabled", item.prop("disabled")).bindData(data, "k", "v").insertAfter(item);

            item.remove();
        }, null, false);

        return [row1, $('<hr>'), row2];
    }

    function drawPresign(conf) {

        var row = createDiv("row").append($("<div></div>").addClass("col-sm-4").append($("<h3></h3>").append($('<strong></strong>').addClass("blue").attr("id", "product")))).append(createDiv("pull-right").append(createButton(conf, "btnPrintPresignInfo", "btn btn-xs btn-primary", "打印预签", null, '<i class="icon-print bigger-120"></i>')), createDiv("col-md-12", "presignItemListDiv"));

        return [row];
    }

    function drawQuotaion(conf) {

        var row = createDiv("row");

        row.append(createDiv("row").append($("<div></div>").addClass("col-sm-4").append($("<h3></h3>").append($('<strong></strong>').addClass("blue").attr("id", "quotationVersion")))).append(createDiv("pull-right").append(createButton(conf, "preferBtn", "btn btn-xs btn-primary", "优惠", null, '<i class="bigger-120"></i>')), createDiv("col-md-12", "quotationSummary")));

        var $sortable = createDiv("widget-container-span ui-sortable");
        var $tabbable = createDiv("tabbable").appendTo($sortable);
        var $myTab = createUl("myTab", "nav nav-tabs", "margin-top: 7px;").appendTo($tabbable);

        var quotationFunctionAreaDetail = createLi("active").append($("<a></a>").attr("data-toggle", "tab").attr("href", "#ribbonSubset").css("color", "#4383b4").append($("<strong></strong>").text("功能区分组")));
        var quotationWorkerTypeDetail = createLi().append($("<a></a>").attr("data-toggle", "tab").attr("href", "#workTypeSubset").css("color", "#4383b4").append($("<strong></strong>").text("工种分组")));
        var quotationSelectionCategoryDetail = createLi().append($("<a></a>").attr("data-toggle", "tab").attr("href", "#selectionCategory").css("color", "#4383b4").append($("<strong></strong>").text("选材品类")));
        var quotationButtonsDetail = createDiv("pull-right action-buttons").append(createButton(conf, "btnPrintDefaultQuotationInfo", "btn btn-xs btn-primary", "打印报价", null, '<i class="icon-print bigger-120"></i>'), createButton(conf, "btnPrintQuotationCN", "btn btn-xs btn-info", "打印定额", null, '<i class="icon-print bigger-120"></i>'));

        $myTab.append(quotationFunctionAreaDetail);
        $myTab.append(quotationWorkerTypeDetail);
        $myTab.append(quotationSelectionCategoryDetail);
        $myTab.append(quotationButtonsDetail);

        var $tabContent = createDiv("tab-content").append(createDiv("tab-pane  in active", "ribbonSubset"), createDiv("tab-pane", "workTypeSubset"), createDiv("tab-pane", "selectionCategory"));
        $tabbable.append($tabContent);
        $sortable.appendTo(row);

        if (!checkButton(conf, com.focusPage("#quotationType"))) {
            com.focusPage("#quotationType").hide();
        }

        return [row];
    }

    function drawSelect(conf) {

        var row = createDiv("row");

        var selectButtonsDetail = createDiv("pull-right action-buttons").append(createButton(conf, "btnPrintDefaultSelectInfo", "btn btn-xs btn-primary", "打印选材", null, '<i class="icon-print bigger-120"></i>'));
        var selectItemListDiv = createDiv("tab-pane in active", "selectItemListDiv", "margin-top: 26px;");

        selectButtonsDetail.appendTo(row);
        selectItemListDiv.appendTo(row);

        return [row];
    }

    function drawPicture(conf, stepPane) {

        var row1 = createDiv("row").css("min-height", "150px").append(createDiv("col-md-12 widget-container-span ui-sortable").append(createDiv("widget-box transparent", "basePaymentWidget").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("方案状态")))))).appendTo(stepPane);
        createDiv("col-md-12").append($('<h5></h5>').attr("id", "pictureStatusRow").append($('<strong></strong>').addClass('clearfix col-md-3').html("合同方案: ").append($('<span></span>').attr('id', 'designStatus').addClass("label label-danger arrowed"))).append($('<strong></strong>').addClass('clearfix col-md-3').html("放线方案: ").append($('<span></span>').attr('id', 'prictureStatus').addClass("label label-danger arrowed")))).appendTo(row1);

        var $confirmDesign = $('<button></button>').attr("id", "confirmDesign").addClass('btn btn-minier btn-success pull-right').css("margin-left", "3px").html("确认合同方案");
        var $confirmDesignQRCode = $('<button></button>').attr("id", "confirmDesignQRCode").addClass('btn btn-minier btn-success pull-right icon-qrcode');
        var $confirmPricture = $('<button></button>').attr("id", "confirmPricture").addClass('btn btn-minier btn-yellow pull-right').css("margin-left", "3px").html("确认放线方案");
        var $confirmPrictureQRCode = $('<button></button>').attr("id", "confirmPrictureQRCode").addClass('btn btn-minier btn-yellow pull-right icon-qrcode');

        var $checkOriginal = $('<button></button>').attr("id", "checkOriginalBtn").addClass('btn btn-minier btn-yellow pull-right').css("margin-left", "3px").html("量房验证");

        var $handoverBtn = $('<button></button>').attr("id", "handoverProfileBtn").addClass('btn btn-minier btn-primary').css("margin-left", "3px").html("交接单");

        var $quotationTagBtn = $('<button></button>').attr("id", "quotationTagProfileBtn").addClass('btn btn-minier btn-purple').css("margin-left", "3px").html("报价标签");

        var $drawlineTagBtn = $('<button></button>').attr("id", "drawlineTagProfileBtn").addClass('btn btn-minier btn-pink').css("margin-left", "3px").html("放线标签");

        var $assignTalkBtn = $('<button></button>').attr("id", "assignTalkBtn").addClass('btn btn-minier btn-info').css("margin-left", "3px").html("分配沟通");

        var $show = conf.opt == null ? [] : conf.opt.show == null ? [] : conf.opt.show;

        var $OriginalPicture = $show.includes("OriginalPicture") ? createDiv().append(createDiv("col-xs-12 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("现场图")), createDiv("inline pull-right", "checkOriginal").css("text-align", "right"), createDiv("inline pull-right", "OriginalUpload").css("text-align", "right")), createDiv().css("min-height", "150px").append(createUl("OriginalPicture", "ace-thumbnails"))))) : null;
        var $designPictures = $show.includes("designPictures") ? createDiv().append(createDiv("col-xs-12 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("合同方案")).append($('<a class="btn btn-minier btn-success" id="detailBatchShow">批量显示</a>')).append(' ').append($('<a class="btn btn-minier btn-info" id="detailBatchConfirm">批量确认</a>')).append(' ').append($('<a class="btn btn-minier btn-danger" id="detailBatchHide">批量隐藏</a>')), createDiv("inline pull-right", "designPictureUpload_a").css("text-align", "right").append(createDiv("pull-left", "designPictureUpload_b"))), createDiv().css("min-height", "150px").append(createUl("designPictures", "ace-thumbnails"))))) : null;
        var $projectPictures = $show.includes("projectPictures") ? createDiv().append(createDiv("col-xs-12 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h4></h4>").attr("id", "projectPictureTitle").append($("<strong></strong>").text("放线方案")), createDiv("inline pull-right", "projectPictureUpload_a").css("text-align", "right").append(createDiv("pull-left", "projectPictureUpload_b"))), createDiv().css("min-height", "150px").append(createUl("projectPictures", "ace-thumbnails"))))) : null;
        var $contractMap = $show.includes("contractMap") ? createDiv().append(createDiv("col-xs-12 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("合同备档")), createDiv("inline pull-right", "ContractUpload").css("text-align", "right")), createDiv().css("min-height", "150px").append(createUl("ContractPictures", "ace-thumbnails"))))) : null;
        var $CADProjectPicture = $show.includes("CADProjectPicture") ? createDiv().append(createDiv("col-xs-12 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h4></h4>").attr("id", "CADProjectTitle").append($("<strong></strong>").text("工程文件CAD")), createDiv("inline pull-right", "CADUpload").css("text-align", "right")), createDiv().css("min-height", "150px").append(createDiv("infobox-container", "CADProjectPicture"))))) : null;
        var $contractFile = $show.includes("contractFiles") ? createDiv().append(createDiv("col-xs-12 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("合同文件"))), createDiv().css("min-height", "150px").append(createDiv("infobox-container", "contractFiles"))))) : null;
        var $designContractPicture = $show.includes("designContractPicture") ? createDiv().append(createDiv("col-xs-12 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("合同方案2")), createDiv("inline pull-right", "designContractPictureUpload_a").css("text-align", "right").append(createDiv("pull-left", "designContractPictureUpload_b"))), createDiv().css("min-height", "150px").append(createUl("designContractPicture", "ace-thumbnails"))))) : null;

        var $liveShot = createDiv("col-md-12 liveShot").css({"border-top": "1px solid #dce8f1"});

        // 创建内部容器
        var $innerContainer = createDiv("block clearfix form-group");

        // 创建各个上传区块
        var $selfieBlock = createImageUploadBlock("量房员自拍", "selfieBlock", "selfiePicture");
        var $drawingBlock = createImageUploadBlock("现场测绘图", "drawingBlock", "drawingPicture");
        var $photoBlock = createImageUploadBlock("现场照片", "photoBlock", "livePicture");
        var $file720Block = createImageUploadBlock("720°文件", "file720Block", "720Files");

        // 组装所有区块
        $innerContainer.append($selfieBlock).append($drawingBlock).append($photoBlock).append($file720Block);

        // 最终组装
        $liveShot.append($innerContainer);

        var row2 = createDiv("row").append($liveShot).append($OriginalPicture).append($designPictures).append($designContractPicture).append($projectPictures).append($contractMap).append($CADProjectPicture).append($contractFile).appendTo(stepPane);

        var $btns = conf.opt == null ? [] : conf.opt.btn == null ? [] : conf.opt.btn;

        if ($btns.includes("selfieUpload")) {

            decorationUtils.loadHuploadify("selfieBlock", "上传图片", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                decorationUtils.addDecorationPicture(data, 11, "selfiePicture");
            }, "btn btn-minier btn-primary");
        }

        if ($btns.includes("drawingUpload")) {

            decorationUtils.loadHuploadify("drawingBlock", "上传图片", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                decorationUtils.addDecorationPicture(data, 21, "drawingPicture");
            }, "btn btn-minier btn-primary");
        }

        if ($btns.includes("photoUpload")) {

            decorationUtils.loadHuploadify("photoBlock", "上传图片", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                decorationUtils.addDecorationPicture(data, 31, "livePicture");
            }, "btn btn-minier btn-primary");
        }

        if ($btns.includes("file720Upload")) {

            decorationUtils.loadHuploadify("file720Block", "上传文件", "*.pdf", false, function(data) {

                decorationUtils.addDecorationPicture(data, 41, "720Files");
            }, "btn btn-minier btn-primary");
        }

        if ($btns.includes("designPictureUpload")) {

            decorationUtils.loadHuploadify("designPictureUpload_b", "上传合同方案", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                decorationUtils.addDecorationPicture(data, 1, "designPictures");
            }, "btn btn-minier btn-primary");

        }

        if ($btns.includes("projectPictureUpload")) {
            decorationUtils.loadHuploadify("projectPictureUpload_b", "上传放线方案", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                decorationUtils.addDecorationPicture(data, 2, "projectPictures");
            }, "btn btn-minier btn-primary");
        }

        if ($btns.includes("designContractPictureUpload")) {
            decorationUtils.loadHuploadify("designContractPictureUpload_b", "上传合同方案2", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                decorationUtils.addDecorationPicture(data, 5, "designContractPicture");
            }, "btn btn-minier btn-primary");
        }

        if ($btns.includes("OriginalUpload")) {
            decorationUtils.loadHuploadify("OriginalUpload", "上传现场图", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                decorationUtils.addDecorationPicture(data, 4, "OriginalPicture");
            }, "btn btn-minier btn-primary");
        }

        if ($btns.includes("CADUpload")) {
            decorationUtils.loadHuploadify("CADUpload", "上传工程文件CAD", "*.dwg;*.dwt", false, function(data) {

                decorationUtils.addDecorationPicture(data, 0, "CADProjectPicture");
            }, "btn btn-minier btn-primary");
        }

        if ($btns.includes("ContractUpload")) {
            decorationUtils.loadHuploadify("ContractUpload", "上传合同备档", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                decorationUtils.addDecorationPicture(data, 3, "ContractPictures");
            }, "btn btn-minier btn-primary");
        }

        if ($btns.includes("confirmDesign") && $designPictures) {
            com.focusPage("#designPictureUpload_a").append($confirmDesignQRCode).append($confirmDesign);
        }

        if ($btns.includes("confirmPicture") && $projectPictures) {
            com.focusPage("#projectPictureUpload_a").append($confirmPrictureQRCode).append($confirmPricture);
        }

        com.focusPage("#checkOriginal").append($checkOriginal);

        // 放线标签按钮挂在放线方案标题旁
        com.focusPage("#projectPictureTitle").append($drawlineTagBtn);

        com.focusPage("#CADProjectTitle").append($handoverBtn).append($quotationTagBtn).append($assignTalkBtn);

        return [row1, row2];
    }

    function drawMaterial(conf) {

        var row = createDiv("row");
        var left1 = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable ");
        var left2 = createDiv("tabbable").appendTo(left1);
        var leftul = createUl("myTab", "nav nav-tabs", "margin-top: 7px;").appendTo(left2);
        var leftli = [];

        leftli.push(createLi("active").append($("<a></a>").attr("data-toggle", "tab").attr("href", "#salesResultList" + conf).css("color", "#4383b4").append($("<strong></strong>").text("销售单"))));
        leftli.push(createLi().append($("<a></a>").attr("data-toggle", "tab").attr("href", "#oalesResultList" + conf).css("color", "#4383b4").append($("<strong></strong>").text("外销单"))));
        leftli.push(createLi().append($("<a></a>").attr("data-toggle", "tab").attr("href", "#salesMaterialPayments" + conf).css("color", "#4383b4").append($("<strong></strong>").text("销售款项"))));
        leftli.push(createLi().append($("<a></a>").attr("data-toggle", "tab").attr("href", "#fanglinMaterialPayments" + conf).css("color", "#4383b4").append($("<strong></strong>").text("主材款项"))));
        leftli.push(createDiv("pull-right action-buttons").append($("<a></a>").attr("class", "btn btn-minier btn-info").attr("name", "consumptionDetailsPrint").text("消费明细打印")));
        leftul.append(leftli);

        var left3 = createDiv("tab-content").append(createDiv("tab-pane in active", "salesResultList" + conf, "margin-left: -12px;"), createDiv("tab-pane", "oalesResultList" + conf, "margin-left: -12px;"), createDiv("tab-pane", "salesMaterialPayments" + conf, "margin-left: -12px;"), createDiv("tab-pane", "fanglinMaterialPayments" + conf, "margin-left: -12px;")).append(createDiv("fl-page-wrap clearfix hidden", "pagenation"));
        left2.append(left3);

        var right1 = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable ");
        var right2 = createDiv("tabbable").appendTo(right1);
        var rightul = createUl("myTab", "nav nav-tabs", "margin-top: 7px;").appendTo(right2);
        var rightli = [];

        rightli.push(createLi("active").append($("<a></a>").attr("data-toggle", "tab").attr("href", "#materialPaymentBrands" + conf).css("color", "#4383b4").append($("<strong></strong>").text("品牌汇总"))));
        rightli.push(createLi().append($("<a></a>").attr("data-toggle", "tab").attr("href", "#oalesPaymentBrands" + conf).css("color", "#4383b4").append($("<strong></strong>").text("外销品牌"))));
        rightli.push(createLi().append($("<a></a>").attr("data-toggle", "tab").attr("href", "#materialPurchasedCategory" + conf).css("color", "#4383b4").append($("<strong></strong>").text("已购品类"))));
        rightli.push(createLi().append($("<a></a>").attr("data-toggle", "tab").attr("href", "#materialUnpurchasedCategory" + conf).css("color", "#4383b4").append($("<strong></strong>").text("未购品类"))));
        rightul.append(rightli);

        var right3 = createDiv("tab-content").append(createDiv("tab-pane in active", "materialPaymentBrands" + conf, "margin-left: -12px;"), createDiv("tab-pane", "oalesPaymentBrands" + conf, "margin-left: -12px;"), createDiv("tab-pane", "materialPurchasedCategory" + conf, "margin-left: -12px;"), createDiv("tab-pane", "materialUnpurchasedCategory" + conf, "margin-left: -12px;"));
        right2.append(right3);

        var layerPopUp = createDiv("portlet box page-content").attr("id", "layerPopUp");
        row.append(left1, right1, layerPopUp);
        return [row];
    }

    function drawActivity(conf) {

        // 积分块:装修/冻结装修/主材/运营 四列,位于销售活动物品之后、会员活动物品之前
        var integralRow = createDiv("col-md-12").append(createDiv("col-md-3", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("装修积分"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "decorationIntegral").text(0)), $("<a></a>").attr("id", "decorationIntegralDetailBtn").attr("href", "#").css("font-size", "12px").text("明细")), createDiv("col-md-3", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("冻结装修积分"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "freezeDecorationIntegral").text(0))), createDiv("col-md-3", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("主材积分"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "materialIntegral").text(0)), $("<a></a>").attr("id", "materialIntegralDetailBtn").attr("href", "#").css("font-size", "12px").text("明细")), createDiv("col-md-3", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("运营积分"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "operateIntegral").text(0))));

        var row = createDiv("row").append(createDiv("col-md-12").append(createButton(conf, "joinActivityBtn", "btn btn-xs btn-info", "参加活动", "button", '<i class="icon-cog bigger-110"></i>'), createButton(conf, "applyActivityItemBtn", "btn btn-xs btn-info", "申领活动物品", "button", '<i class="icon-cog bigger-110"></i>').attr("style", "margin: 0 6px"), createDiv("col-sm-12", "activityPriceInfo").attr("style", "padding:0px;")), createDiv("col-md-12 hr"), createDiv("col-md-12", null, "padding: 0;margin: 0 8px;font-size: 24px;color: #2679b5;").html("装修活动"), createDiv("col-md-12", "activitys"), createDiv("col-md-12 hr"), createDiv("col-md-12", null, "padding: 0;margin: 0 8px;font-size: 24px;color: #2679b5;").html("装修活动物品"), createDiv("col-md-12", "activityItems"), createDiv("col-md-12 hr"), createDiv("col-md-12", null, "padding: 0;margin: 0 8px;font-size: 24px;color: #2679b5;").html("销售活动物品"), createDiv("col-md-12", "salesActivityItems"), createDiv("col-md-12 hr"), integralRow, createDiv("col-md-12 hr"), createDiv("col-md-12", null, "padding: 0;margin: 0 8px;font-size: 24px;color: #2679b5;").html("会员活动物品"), createDiv("col-md-12", "memberActivityItems"));

        return [row];
    }

    function drawPayment(conf, stepPane) {

        var row1 = createDiv("row", "advancePayment").append(createDiv("widget-container-span")).appendTo(stepPane);
        var top = createDiv("widget-box transparent").appendTo(row1);

        var topHeader = createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("预付款项信息"))).appendTo(top);
        var topBody = createDiv("widget-body").append(createDiv("widget-body-inner")).appendTo(top);
        var topBody2 = createDiv("clearfix", null, "margin-top: 15px; margin-bottom: 15px;").appendTo(topBody);

        var topitems = [];

        topitems.push(createDiv("col-md-6", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("合同预付款"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "balanceAdvance").text(0))));
        topitems.push(createDiv("col-md-6", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("主材预付款"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "materialAdvance").text(0))));

        topBody2.append(topitems);

        var row2 = createDiv("row").append(createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent", "basePaymentWidget").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("基本款项信息")), createButton(conf, "btnCreateService", "btn btn-xs btn-success btn-info pull-right", "服务款", "button", '<i class="icon-cog bigger-110">').css("margin", "0px 3px"), createButton(conf, "btnSetDecorationPaymentInfo", "btn btn-xs btn-info pull-right", "装修款", "button", '<i class="icon-cog bigger-110">')), createDiv("widget-body").append(createDiv("widget-body-inner", "basePaymentDiv")))),
                                           createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent", "otherPaymentWidget").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("其他项信息")), createButton(conf, "btnOtherPayment", "btn btn-xs btn-warning pull-right", "其他款项", "button", '<i class="icon-cog bigger-110">')), createDiv("widget-body").append(createDiv("widget-body-inner", "otherPaymentDiv"))))).appendTo(stepPane);

        var row3 = createDiv("row", "").append(createDiv("widget-container-span")).appendTo(stepPane);
        var low = createDiv("widget-box transparent").appendTo(row3);

        var lowHeader = createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("已收款项信息"))).appendTo(low);
        var lowBody = createDiv("widget-body").append(createDiv("widget-body-inner")).appendTo(low);
        var lowBody2 = createDiv("clearfix", null, "margin-top: 15px; margin-bottom: 15px;").appendTo(lowBody);

        var lowitems = [];

        lowitems.push(createDiv("col-md-2", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("已收工程款总额"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "projectTotal").text(0))));
        lowitems.push(createDiv("col-md-2", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("已收工程款百分比"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "projectPercent").text(0))));
        lowitems.push(createDiv("col-md-2", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("增项款总额"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "addTotal").text(0))));
        lowitems.push(createDiv("col-md-2", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("减项款总额"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "reduceTotal").text(0))));
        lowitems.push(createDiv("col-md-2", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("主材额"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "materialAmount").text(0))));
        lowitems.push(createDiv("col-md-2", null, "border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class", "bigger-110 center").text("主基比"), $("<h2></h2>").attr("class", "oid bigger center").append($("<b></b>").attr("class", "blue").attr("id", "materialRate").text(0))));

        lowBody2.append(lowitems);

        var row4 = createDiv("row", "preparePayment").append(createDiv("widget-container-span")).appendTo(stepPane);

        return [row1, row2, row3, row4];
    }

    function drawBelong(conf) {

        var row = createDiv("row");
        var left = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h5></h5>").append($("<strong></strong>").text("归属设计信息"))), createDiv("widget-body").append(createDiv("widget-body-inner", "belongDesignInfo"))));
        var right = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h5></h5>").append($("<strong></strong>").text("归属业务信息"))), createDiv("widget-body").append(createDiv("widget-body-inner", "belongSalesmanInfo"))));
        var rowleft = createDiv("row");
        var leftDown = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h5></h5>").append($("<strong></strong>").text("失效归属设计信息"))), createDiv("widget-body").append(createDiv("widget-body-inner", "loseBelongDesignInfo"))));
        var rightDown = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h5></h5>").append($("<strong></strong>").text("失效归属业务信息"))), createDiv("widget-body").append(createDiv("widget-body-inner", "loseBelongSalesmanInfo"))));
        row.append(left, right);
        rowleft.append(leftDown, rightDown);

        return [row, rowleft];
    }

    function drawAddreuce(conf) {

        return [createDiv("row", "resLists")];
    }

    function drawAccount(conf) {

        return [createDiv("row", "accountPayment")];
    }

    function drawService(conf) {

        var row = createDiv("row", "serviceInfo");
        var left = createDiv("col-xs-12 col-md-12 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("服务信息"))), createDiv("widget-body").append(createDiv("widget-body-inner", "serviceInfo"))));
        row.append(left);

        return [row];

    }

    function drawUsers(conf) {

        var row = createDiv("row").append(createDiv("pull-right").append(createButton(conf, "btnDecorationUser", "btn btn-xs btn-primary", "添加", null, '<i class="icon-plus bigger-120"></i>')), createDiv("col-md-12 hr"), createDiv("row-fluid").append(createUl("usersInfo", "ace-thumbnails")));

        return [row];

    }

    // 创建图片上传区块的函数
    function createImageUploadBlock(title, btnName, codeName) {

        var $col = createDiv("col-md-3").css({"text-align": "center"});

        // 创建标题
        var $title = $('<h5></h5>').append($('<strong></strong>').addClass('clearfix').css({"text-align": "center"}).html(title));

        var $div = createDiv("col-md-12").css({"margin-bottom": "5px"});

        // 创建缩略图容器
        var $thumbnailList = null;

        if (btnName == "file720Block") {
            $thumbnailList = createDiv("col-md-12").attr('id', codeName);
        } else {
            $thumbnailList = $('<ul></ul>').addClass('ace-thumbnails').attr('id', codeName).css({"margin": "auto", "display": "flex", "justify-content": "center"});
        }

        var $btn = createDiv("inline", btnName);

        $div.append($thumbnailList);

        // 组装完整区块
        $col.append($title).append($div).append($btn);

        return $col;
    }

    drawNode = {
        draw: function(nodes) {

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
            var isdesignContractPictureUpload = false;

            var title = {
                "basic": "基本信息",
                "presign": "预签信息",
                "quotation": "报价信息",
                "select": "选材信息",
                "picture": "图纸信息",
                "material": "主材信息",
                "activity": "活动信息",
                "payment": "款项信息",
                "belong": "归属信息",
                "addreduce": "增减项",
                "account": "决算信息",
                "service": "服务信息",
                "users": "人员信息"
            };

            if ($.isEmptyObject(nodes))
                return;
            $.each(nodes, function(i, v) {

                params.detail.push(i);
                ul.append(createWizardStep(i, title[v.type]));
                var stepPane = createStepPane(i).appendTo(container);
                var rows = [];
                switch (v.type) {
                    case "basic":
                        drawBasic(v, stepPane);
                        break;
                    case "presign":
                        rows = drawPresign(v);
                        break;
                    case "quotation":
                        rows = drawQuotaion(v);
                        break;
                    case "select":
                        rows = drawSelect(v);
                        break;
                    case "picture":
                        drawPicture(v, stepPane);
                        break;
                    case "material":
                        rows = drawMaterial(dataPage);
                        break;
                    case "activity":
                        rows = drawActivity(v);
                        break;
                    case "payment":
                        drawPayment(v, stepPane);
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
                    case "users":
                        rows = drawUsers(v);
                        break;
                }

                $.each(rows, function(j, b) {

                    stepPane.append(b);
                });

            });

            ul.appendTo(wizard);

            if (isdesignPictureUpload) {
                decorationUtils.loadHuploadify("designPictureUpload", "上传合同方案", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                    decorationUtils.addDecorationPicture(data, 1, "designPictures");
                }, "btn btn-success");
            }

            if (isprojectPictureUpload) {
                decorationUtils.loadHuploadify("projectPictureUpload", "上传放线方案", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                    decorationUtils.addDecorationPicture(data, 2, "projectPictures");
                }, "btn btn-primary");
            }

            if (isOriginalUpload) {
                decorationUtils.loadHuploadify("OriginalUpload", "上传现场图", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                    decorationUtils.addDecorationPicture(data, 4, "OriginalPicture");
                }, "btn btn-purple");
            }

            if (isCADUpload) {
                decorationUtils.loadHuploadify("CADUpload", "上传工程文件CAD", "*.dwg;*.dwt", false, function(data) {

                    decorationUtils.addDecorationPicture(data, 0, "CADProjectPicture");
                }, "btn btn-warning");
            }

            if (isContractUpload) {
                decorationUtils.loadHuploadify("ContractUpload", "上传合同备档", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                    decorationUtils.addDecorationPicture(data, 3, "ContractPictures");
                }, "btn btn-inverse");
            }

            if (isdesignContractPictureUpload) {
                decorationUtils.loadHuploadify("designContractPictureUpload", "上传合同2", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {

                    decorationUtils.addDecorationPicture(data, 5, "designContractPictureUpload");
                }, "btn btn-inverse");
            }

        },
        getConfig: function(page) {

            var pageConfig = {
                "apiPage": null,
                "pageBtn": [],
                "postDataName": page + "PostData",
                "nodes": {},
                "condArr": [],
                "extraParam": [],
                "propertyArr": [],
                "hasExport": null
            };

            function packageConfig(o, props, value, subtype) {

                var prop = props.shift();
                if (props.length != 0) {
                    if (!o[prop])
                        o[prop] = {};
                    packageConfig(o[prop], props, value, subtype);
                    return;
                }

                if (subtype == 0) {
                    o[prop] = value;
                } else if (subtype == 1 && !o[prop]) {
                    o[prop] = [value];
                } else if (subtype == 1 && o[prop]) {
                    o[prop].push(value);
                }
            }

            function getApi(o, props) {

                var prop = props.shift();

                if (props.length == 0) {
                    return o[prop];
                } else if (o[prop]) {
                    return getApi(o[prop], props);
                }
                return "";
            }

            com.post(api.right.queryDecorationFunctionRightByName, {
                "decorationFunctionRight.name": page
            }, function(res) {

                var rights = res.decorationFunctionRights.sort(function(a, b) {

                    return a.decorationFunction.sort - b.decorationFunction.sort;
                });

                $.each(rights, function(i, v) {

                    var data = v.decorationFunction;

                    if (data.type == 1)
                        data.value = getApi({
                            "api": api
                        }, data.value.split("."));

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
var decorationPage = {};

$(function () {

    decorationPage = {
        // 依据页面名(及当前公司)返回前端页面配置对象, 与 constructionPageUtils.constructionPage.getConfig 同构
        // 配置源: decoration.decorationfunctionright(name=页面名) 挂 decorationfunction(key/value/type/subtype/sort)
        // 返回: { apiPage, pageBtn[], condArr[], propertyArr[] }; 无配置时各数组为空 = 页面默认全展示
        getConfig: function (page) {

            var pageConfig = {
                "apiPage": null,
                "pageBtn": [],
                "condArr": [],
                "propertyArr": []
            };

            function packageConfig(o, props, value, subtype) {

                var prop = props.shift();

                if (props.length != 0) {
                    if (!o[prop]) o[prop] = {};
                    packageConfig(o[prop], props, value, subtype);
                    return;
                }

                if (subtype == 0) {
                    o[prop] = value;
                } else if (subtype == 1 && !o[prop]) {
                    o[prop] = [value];
                } else if (subtype == 1 && o[prop]) {
                    o[prop].push(value);
                }
            }

            function getApi(o, props) {

                var prop = props.shift();

                if (props.length == 0) {
                    return o[prop];
                } else if (o[prop]) {
                    return getApi(o[prop], props);
                }
                return "";
            }

            com.post(api.right.queryDecorationFunctionRightByName, { "decorationFunctionRight.name": page }, function (res) {

                var rights = (res.decorationFunctionRights || []).sort(function (a, b) { return a.decorationFunction.sort - b.decorationFunction.sort; });

                $.each(rights, function (i, v) {

                    var data = v.decorationFunction;

                    if (data.type == 1) data.value = getApi({ "api": api }, data.value.split("."));

                    packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
                });
            }, null, false);

            return pageConfig;

        }
    };
});
