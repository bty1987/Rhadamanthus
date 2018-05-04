var drawNode = {};

$(function(){
    function createWizardStep(id,title) {
        var li = createLi("complete").attr("data-target","#step" + id);

        if(id == 1) li.attr("class","complete active")

        var setpSpan = $('<span></span>').attr("class","step").text(id);
        var titleSpan = $('<span></span>').attr("class","title").text(title);

        li.append(setpSpan).append(titleSpan);
        return li;
    }
    function createStepPane(id) {
        return $('<div></div>').attr("class","step-pane active").attr("id","step" + id);
    }
    function createDiv(classes,id,css) {
        var div = $('<div></div>').attr("class",classes);
        if(id) div.attr("id",id);
        if(css) div.attr("style",css);
        return div;
    }
    function createForm(classes) {
        return classes == null ? $('<form></form>').attr("class","form-horizontal"):$('<form></form>').attr("class",classes);
    }
    function createLabel(classes,text,forId) {
        var label = $('<label></label>').attr("class",classes).text(text);
        if(forId) label.attr("for",forId);
        return label;
    }
    function createInput(id,classes,readonly,type,value) {
        var input = $('<input>').attr("id",id).attr("type",type == null ? "text":type).attr("class",classes).attr("value",value == null ? "":value);
        if(readonly)  input.attr("readonly","readonly");
        return input;
    }
    function createSelect(id,classes,options,css,placeholder,toggle,trigger){
        var select = $('<select></select>').attr("id",id).attr("class",classes).prop("disabled", true);
        if(css) select.attr("style",css);
        if(placeholder) select.attr("data-placeholder",placeholder);
        if(toggle) select.attr("data-toggle",toggle);
        if(trigger) select.attr("data-trigger",trigger);
        if($.isEmptyObject(options)) return select;
        $.each(options,function (i,v) {
            select.append("<option value='" + v["value"] + "'>" + v["text"] + "</option>");
        });
        return select;
    }
    function createButton(conf,id,classes,text,type,icon){
        var button = $('<button></button>').attr("id",id).attr("class",classes);
        if(text) button.text(text);
        if(type) button.attr("type",type);
        if(icon) button.prepend(icon);
        if(!checkButton(conf,button)) return $('<button></button>').attr("class","hidden");
        return button;
    }
    function createSpan(classes,css,text){
        var span = $('<span></span>').attr("class",classes).text(text);
        if(css) span.attr("style",css);
        return span;
    }
    function createUl(id,classes,css){
        var ul = $("<ul></ul>").attr("class",classes);
        if(css) ul.attr("style",css);
        if(id) ul.attr("id",id);
        return ul
    }
    function createLi(classes) {
        var li = $('<li></li>');
        if(classes) li.attr("class",classes);
        return li;
    }
    function checkButton(conf,button) {
        if($.isEmptyObject(conf.opt)) return false;
        if($.isEmptyObject(conf.opt.btn)) return false;
        var flag = false;
        var id = button.attr("id")
        $.each(conf.opt.btn,function(i,v){
            if(v == id) {
                flag = true;
                if(id = "houseType"){
                    var statuses = ["初始", "已报价", "定金"];

                    if(statuses.indexOf(params.orederStatus)){
                        button.prop("disabled", false);
                    }else{
                        params.orederStatus == "已签约" ? button.prop("disabled", true) : button.prop("disabled", false);
                    }
                }
            }

        });

        return flag;
    }
    function drawBasic(conf){
        var row1 = createDiv("row");
        var form1 = createForm();
        var left1 = createDiv("col-xs-12 col-sm-5").append(createDiv("control-group").append(
            createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","订单号","orderId"),createDiv("col-sm-9").append(createInput("orderId","col-xs-10 col-sm-5",true,"text")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","客户名","customer"),createDiv("col-sm-9").append(createInput("customer","col-xs-10 col-sm-5",true,"text")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","","customerInfosBtn"),createDiv("col-sm-9").append(createButton(conf,"customerInfosBtn","btn btn-xs btn-danger col-xs-10 col-sm-5","客户信息","button"),createButton(conf,"customerChangeBtn","btn btn-xs btn-info","修改客户信息","button")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","楼盘地址","houseAddr"),createDiv("col-sm-9").append(createInput("houseAddr","col-xs-10 col-sm-5",true),createButton(conf,"villageChangeBtn","btn btn-xs btn-info","修改房产信息","button")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","设计部","designDepartment"),createDiv("col-sm-9").append(createInput("designDepartment","col-xs-10 col-sm-5",true,"text")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","设计师","designer"),createDiv("col-sm-9").append(createInput("designer","col-xs-10 col-sm-5",true,"text")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","业务部门","businessDepartment"),createDiv("col-sm-9").append(createInput("businessDepartment","col-xs-10 col-sm-5",true,"text")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","业务员","salesman"),createDiv("col-sm-9").append(createInput("salesman","col-xs-10 col-sm-5",true,"text")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","业务人员类型","salesmanType"),createDiv("col-sm-9").append(createInput("salesmanType","col-xs-10 col-sm-5",true,"text")))
        ));
        var right1 = createDiv("col-xs-12 col-sm-5").append(createDiv("control-group").append(
            createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","订单类型","orderType"),createDiv("col-sm-9").append(createSelect("orderType","col-xs-10 col-sm-5",[],null,null,"popover","manual")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","房屋类别","houseType"),createDiv("col-sm-9").append(createSelect("houseType","col-xs-10 col-sm-5",[],null,null,"popover","manual")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","房屋类型","houseClass"),createDiv("col-sm-9").append(createSelect("houseClass","col-xs-10 col-sm-5",[],null,null,"popover","manual")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","建筑面积","houseArea"),createDiv("col-sm-9").append(createInput("houseArea","col-xs-10 col-sm-5 v_float v_required",true,"text","0")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","赠送面积","freeArea"),createDiv("col-sm-9").append(createInput("freeArea","col-xs-10 col-sm-5 v_float v_required",true,"text","0")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","订单状态","status"),createDiv("col-sm-9").append(createInput("status","col-xs-10 col-sm-5",true,"text","0")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","量房时间","measureTime"),createDiv("col-sm-9").append(createInput("measureTime","col-xs-10 col-sm-5",true,"text","0")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","报价员","quoterId"),createDiv("col-sm-9").append(createSelect("quoterId","chosen-select col-md-4",[{"text":"","value":""}],"display: none;","请输入报价员","popover","manual")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","跟单员","escorterId"),createDiv("col-sm-9").append(createSelect("escorterId","chosen-select col-md-4",[{"text":"","value":""}],"display: none;","请输入跟单员","popover",'manual')))
        ));
        form1.append(left1,right1).appendTo(row1);

        var row2 = createDiv("row");
        var form2 = createForm();
        var left2 = createDiv("col-xs-12 col-sm-5").append(
            createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","非业务人员名称","notSalesmanName"),createDiv("col-sm-9").append(createInput("notSalesmanName","col-xs-10 col-sm-5 v_name",true,"text").attr("data-toggle","popover").attr("data-trigger","manual").attr("maxlength","8")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","非业务提点","notSalesmanRate"),createDiv("col-sm-9").append(createInput("notSalesmanRate","col-xs-10 col-sm-5  v_required v_float",true,"text").attr("data-toggle","popover").attr("data-trigger","manual").attr("maxlength","11").attr("value","0"),$("<i></i>").attr("class","icon-asterisk")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","非业务人员手机","notSalesmanPhone"),createDiv("col-sm-9").append(createInput("notSalesmanPhone","col-xs-10 col-sm-5  v_phone",true,"text").attr("data-toggle","popover").attr("data-trigger","manual").attr("maxlength","11")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","非业务备注","notSalesmanContent"),createDiv("col-sm-9").append('<textarea id="notSalesmanContent" class="col-xs-10 col-sm-5"rows="3" data-toggle="popover"data-trigger="manual" maxlength="128"readonly="readonly"></textarea>'))
        );
        var right2 = createDiv("col-xs-12 col-sm-5").append(
            createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","返单人员名称","backOrderName"),createDiv("col-sm-9").append(createInput("backOrderName","col-xs-10 col-sm-5 v_name",true,"text").attr("data-toggle","popover").attr("data-trigger","manual").attr("maxlength","8")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","返单人员电话","backOrderPhone"),createDiv("col-sm-9").append(createInput("backOrderPhone","col-xs-10 col-sm-5 v_phone",true,"text").attr("data-toggle","popover").attr("data-trigger","manual").attr("maxlength","11")))
            ,createDiv("form-group").append(createLabel("col-sm-3 control-label no-padding-right","返单人员备注","backOrderContent"),createDiv("col-sm-9").append('<textarea id="backOrderContent" class="col-xs-10 col-sm-5"rows="3" data-toggle="popover"data-trigger="manual" maxlength="128"readonly="readonly"></textarea>'))
        );
        form2.append(left2,right2).appendTo(row2);
        return [row1,$('<hr>'),row2]
    }
    function drawQuotaion(conf){
        var row = createDiv("row").append(
            createDiv("col-md-8").append(
                createDiv("form-group").append(createLabel("col-md-2 control-label no-padding-right","显示方式","showWay")
                    ,createDiv("col-md-6").append(createSelect("showWay","col-md-6",[{"text":"功能区分组","value":0},{"text":"工种分组","value":1}]).prop("disabled", false))
                )
            )
            ,createDiv("col-md-4 text-right").append(
                createDiv("form-group").append(
                    createDiv("col-md-12").append(createButton(conf,"btnPrintDefaultQuotationInfo","btn btn-info","打印报价",null,'<i class="icon-print bigger-120"></i>'))
                )
            )
            ,createDiv("col-md-12","quotationItemListDiv"));

        return [row];
    }
    function drawPicture(conf) {
        var row1 = createDiv("row").append(createDiv("col-md-12").append(createDiv("col-md-1","designPictureUpload"),createDiv("col-md-1","projectPictureUpload"),createDiv("col-md-1","CADUpload"),createDiv("col-md-1","ContractUpload")));
        var row2 = createDiv("row").append(
            createDiv("col-xs-12").append(createLabel("control-label","效果图:").attr("style","margin-left: 20px;margin-top: 20px;"),createDiv("col-md-12 hr"),createDiv("row-fluid").append(createUl("designPictures","ace-thumbnails")))
            ,createDiv("col-xs-12").append(createLabel("control-label","工程图:").attr("style","margin-left: 20px;margin-top: 20px;"),createDiv("col-md-12 hr"),createDiv("row-fluid").append(createUl("projectPictures","ace-thumbnails")))
            ,createDiv("col-xs-12").append(createLabel("control-label","工程文件:").attr("style","margin-left: 20px;margin-top: 20px;"),createDiv("col-md-12 hr"),createDiv("row-fluid").append(createDiv("col-sm-7 infobox-container","CADProjectPicture")))
            ,createDiv("col-xs-12").append(createLabel("control-label","合同图:").attr("style","margin-left: 20px;margin-top: 20px;"),createDiv("col-md-12 hr"),createDiv("row-fluid").append(createUl("ContractPictures","ace-thumbnails")))
        );
        return [row1,row2]
    }
    function drawMaterial(conf) {
        var row = createDiv("row");
        var left = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable ").append(createDiv("tabbable").append(
            createUl("myTab","nav nav-tabs","margin-top: 7px;").append(
                createLi("active").append($("<a></a>").attr("data-toggle","tab").attr("href","#fanglinMaterialPayment").css("color","#4383b4").append($("<strong></strong>").text("主材款项")))
                ,createLi().append($("<a></a>").attr("data-toggle","tab").attr("href","#salesMaterialPayment").css("color","#4383b4").append($("<strong></strong>").text("销售款项")))

            )
            ,createDiv("tab-content").append(createDiv("tab-pane in active","fanglinMaterialPayment","margin-left: -12px;"),createDiv("tab-pane","salesMaterialPayment","margin-left: -12px;"))
        ));
        var right = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable ").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h5></h5>").append($("<strong></strong>").text("品牌汇总"))),createDiv("widget-body").append(createDiv("widget-body-inner","materialPaymentBrand"))));
        row.append(left,right);
        return [row];
    }
    function drawActivity(conf){
        var row = createDiv("row").append(
            createDiv("col-md-12").append(createButton(conf,"joinActivityBtn","btn btn-info","参加活动","button",'<i class="icon-cog bigger-110"></i>'),createButton(conf,"applyActivityItemBtn","btn btn-info","申领活动物品","button",'<i class="icon-cog bigger-110"></i>'), createButton(conf,"applySpecialActivityItemBtn","btn btn-info","特批活动物品","button",'<i class="icon-cog bigger-110"></i>'))
            ,createDiv("col-md-12 hr"),createDiv("col-md-12","activitys"),createDiv("col-md-12 hr"),createDiv("col-md-12","activityItems")
        );

        return [row]
    }
    function drawPayment(conf) {
        var row1 = createDiv("row","preparePayment");
        row1.append(createDiv("widget-container-span").append(
            createDiv("widget-box transparent").append(
                createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("预付款项信息")))
                ,createDiv("widget-body").append(createDiv("widget-body-inner").append(createDiv("clearfix",null,"margin-top: 15px; margin-bottom: 15px;").append(
                    createDiv("col-md-3",null,"border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class","bigger-110 center").text("合同预付款"),$("<h2></h2>").attr("class","oid bigger center").append($("<b></b>").attr("class","blue").attr("id","balanceAdvance").text(0)))
                    ,createDiv("col-md-3",null,"border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class","bigger-110 center").text("工程预付款"),$("<h2></h2>").attr("class","oid bigger center").append($("<b></b>").attr("class","blue").attr("id","projectAdvance").text(0)))
                    ,createDiv("col-md-3",null,"border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class","bigger-110 center").text("主材预付款"),$("<h2></h2>").attr("class","oid bigger center").append($("<b></b>").attr("class","blue").attr("id","materialAdvance").text(0)))
                    ,createDiv("col-md-3",null,"border-left: 1px solid rgb(227, 227, 227);").append($("<h5></h5>").attr("class","bigger-110 center").text("正林预付款"),$("<h2></h2>").attr("class","oid bigger center").append($("<b></b>").attr("class","blue").attr("id","zaterialAdvance").text(0)))
                )))
            )
            ,createDiv("hr col-md-12")
            )
        );
        var row2 = createDiv("row").append(createDiv("col-md-6").append(createButton(conf,"btnSetDecorationPaymentInfo","btn btn-info","生成款项","button",'<i class="icon-cog bigger-110">'),createButton(conf,"btnOtherPayment","btn btn-info","其他款项","button",'<i class="icon-cog bigger-110">').attr("style","margin-left: 5px")));
        var row3 = createDiv("row");
        row3.append(createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent","basePaymentWidget").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("基本款项信息"))),createDiv("widget-body").append(createDiv("widget-body-inner","basePaymentDiv")))),createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent","otherPaymentWidget").append(createDiv("widget-header").append($("<h4></h4>").append($("<strong></strong>").text("其他项信息"))),createDiv("widget-body").append(createDiv("widget-body-inner","otherPaymentDiv")))));
        return [row1,row2,row3];
    }
    function drawBelong(conf) {
        var row = createDiv("row");
        var left = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h5></h5>").append($("<strong></strong>").text("归属设计信息"))),createDiv("widget-body").append(createDiv("widget-body-inner","belongDesignInfo"))));
        var right = createDiv("col-xs-6 col-md-6 widget-container-span ui-sortable").append(createDiv("widget-box transparent").append(createDiv("widget-header").append($("<h5></h5>").append($("<strong></strong>").text("归属业务信息"))),createDiv("widget-body").append(createDiv("widget-body-inner","belongSalesmanInfo"))));
        row.append(left,right);
        return [row];
    }
    function drawAddreuce(conf) {
        return [createDiv("row", "resLists")];
    }

    var _propertyArr = ["楼盘地址","客户名","设计部","设计师","业务部","业务员","面积","签单额","报价金额","量房时间","签单时间","定金时间","创建时间","类型","状态","工程状态","折扣"];

    var decorationPage = {
        "activity": {
            "apiPage":api.decoration.pageDecorationForCommon,
            "pageBtn":["activity"],
            "postDataName": "decorationActivityPostData",
            "hasExport":false
        },
        "common": {
            "apiPage":api.decoration.pageDecorationForCommon,
            "pageBtn":["view","revie","line"],
            "postDataName": "commonPostData",
            "nodes":[{type:"basic",opt:{btn:["customerInfosBtn"],show:["orderType","houseType","houseClass"]}},{type:"quotaion"},{type:"picture"},{type:"material"},{type:"activity"},{type:"payment"},{type:"belong"}, {type: "addreduce"}],
            "propertyArr": _propertyArr,
            "hasExport":false
        },
        "designer": {
            "apiPage":api.decoration.pageDecorationForDesigner,
            "pageBtn":["view","revie","line","price","scal","contract","extension","addminus","cal"],
            "postDataName": "designerPostData",
            "nodes":[{type:"basic",opt:{btn:["customerInfosBtn"],show:["houseType","houseClass"]}},{type:"quotaion",opt:{btn:["btnPrintDefaultQuotationInfo"]}},{type:"picture",opt:{show:["designPictureUpload","projectPictureUpload","CADUpload","ContractUpload"]}},{type:"material"},{type:"activity",opt:{btn:["joinActivityBtn","applyActivityItemBtn","applySpecialActivityItemBtn"]},wizard:{"activityBtnMethod":activityBtnMethod,"uiBtnMethod":uiBtnMethod} },{type:"payment",opt:{btn:["btnSetDecorationPaymentInfo","btnOtherPayment"]},wizard:{"isDesign":true}},{type:"belong"}, {type: "addreduce"}],
            "hasExport":true
        },
        "designermanager": {
            "apiPage":api.decoration.pageDecorationForDesignerManager,
            "pageBtn":["view","revie","line","price","scal","contract","extension","addminus","cal"],
            "postDataName": "designermanagerPostData",
            "nodes":[{type:"basic",opt:{btn:["customerInfosBtn"],show:["houseType","houseClass","quoterId"]}},{type:"quotaion",opt:{btn:["btnPrintDefaultQuotationInfo"]}},{type:"picture",opt:{show:["designPictureUpload","projectPictureUpload","CADUpload","ContractUpload"]}},{type:"material"},{type:"activity",opt:{btn:["joinActivityBtn","applyActivityItemBtn","applySpecialActivityItemBtn"]},wizard:{"activityBtnMethod":activityBtnMethod,"uiBtnMethod":uiBtnMethod} },{type:"payment",opt:{btn:["btnSetDecorationPaymentInfo","btnOtherPayment"]},wizard:{"isDesign":true}},{type:"belong"}, {type: "addreduce"}],
            "hasExport":true
        },
        "directer": {
            "apiPage":api.decoration.pageDecorationForDesignerManager,
            "pageBtn":["view","revie","contract"],
            "postDataName": "directerPostData",
            "nodes":[{type:"basic",opt:{btn:["customerInfosBtn","customerChangeBtn","villageChangeBtn"],show:["orderType","houseType","houseClass","notSalesmanRate","notSalesmanName","notSalesmanPhone","notSalesmanContent","quoterId","escorterId"]}},{type:"quotaion"},{type:"picture"},{type:"material"},{type:"activity"},{type:"payment",opt:{btn:["btnSetDecorationPaymentInfo","btnOtherPayment"]}},{type:"belong"}, {type: "addreduce"}],
            "propertyArr": _propertyArr,
            "hasExport":false
        },
        "quoter": {
            "apiPage":api.decoration.pageDecorationForQuoter,
            "pageBtn":["view","revie","price","scal","addminus","extension"],
            "postDataName": "quoterPostData",
            "nodes":[{type:"basic",opt:{btn:["customerInfosBtn","customerChangeBtn","villageChangeBtn"],show:["orderType","houseType","houseClass"]}},{type:"quotaion",opt:{btn:["btnPrintDefaultQuotationInfo"]}},{type:"picture"},{type:"material"},{type:"activity",wizard:{"activityBtnMethod":activityBtnMethod,"uiBtnMethod":uiBtnMethod}},{type:"payment"},{type:"addreduce"}],
            "propertyArr": _propertyArr,
            "hasExport":false
        },
        "finance": {
            "apiPage":api.decoration.pageDecorationForCommon,
            "pageBtn":["view","delete","sign","terminal","resign"],
            "postDataName": "financePostData",
            "nodes":[{type:"basic",opt:{btn:["customerInfosBtn",],show:["orderType","houseType","houseClass"]}},{type:"quotaion"},{type:"picture"},{type:"material"},{type:"activity"},{type:"payment"},{type:"belong"}, {type: "addreduce"}],
            "propertyArr": _propertyArr,
            "hasExport":true
        },
        "salesmanmanager": {
            "apiPage":api.decoration.pageDecorationForSalesmanManager,
            "pageBtn":["revie"],
            "postDataName": "salesmanmanagerPostData",
            "hasExport":true
        },
        "stage": {
            "apiPage":api.decoration.pageDecorationForCommon,
            "pageBtn":["view"],
            "postDataName": "stagePostData",
            "nodes":[{type:"basic",opt:{btn:["customerInfosBtn"]}},{type:"activity"},{type:"belong"}],
            "hasExport":false
        },
        "construction": {
            "apiPage":api.decoration.pageDecorationForCommon,
            "pageBtn":["view"],
            "postDataName": "constructionPostData",
            "nodes":[{type:"basic",opt:{btn:["customerInfosBtn"],show:["orderType","houseType","houseClass"]}},{type:"quotaion"},{type:"material"},{type:"payment",opt:{btn:["btnSetDecorationPaymentInfo","btnOtherPayment"]}}],
            "propertyArr": _propertyArr,
            "hasExport":false
        },
        "material": {
            "apiPage":api.decoration.pageDecorationForCommon,
            "pageBtn":["view"],
            "postDataName": "materialPostData",
            "nodes":[{type:"basic",opt:{btn:["customerInfosBtn"],show:["orderType","houseType","houseClass"]}},{type:"material"},{type:"activity"},{type:"belong"}]
        },
        "plan": {
            "apiPage":api.decoration.pageDecorationForDesigner,
            "pageBtn":["view","revie"],
            "postDataName": "planPostData",
            "nodes":[{type:"basic",opt:{btn:["customerInfosBtn","customerChangeBtn","villageChangeBtn"],show:["orderType","houseType","houseClass"]}},{type:"quotaion",opt:{btn:["btnPrintDefaultQuotationInfo"]}},{type:"picture",opt:{show:["designPictureUpload","projectPictureUpload","CADUpload","ContractUpload"]}},{type:"material"},{type:"activity",opt:{btn:["joinActivityBtn","applyActivityItemBtn","applySpecialActivityItemBtn"]},wizard:{"activityBtnMethod":activityBtnMethod,"uiBtnMethod":uiBtnMethod} },{type:"payment",opt:{btn:["btnSetDecorationPaymentInfo","btnOtherPayment"]}},{type:"belong"}, {type: "addreduce"}],
            "hasExport":false
        },
        "escorter": {
            "apiPage":api.decoration.pageDecorationForEscorter,
            "pageBtn":["view","revie"],
            "postDataName": "escorterPostData",
            "nodes":[{type:"basic",opt:{btn:["customerInfosBtn","customerChangeBtn","villageChangeBtn"],show:["orderType","houseType","houseClass"]}},{type:"quotaion",opt:{btn:["btnPrintDefaultQuotationInfo"]}},{type:"picture",opt:{show:["designPictureUpload","projectPictureUpload","CADUpload","ContractUpload"]}},{type:"material"},{type:"activity",opt:{btn:["joinActivityBtn","applyActivityItemBtn","applySpecialActivityItemBtn"]},wizard:{"activityBtnMethod":activityBtnMethod,"uiBtnMethod":uiBtnMethod} },{type:"payment",opt:{btn:["btnSetDecorationPaymentInfo","btnOtherPayment"]}},{type:"belong"}, {type: "addreduce"}],
            "propertyArr": _propertyArr,
            "hasExport":false
        },
        "customerPhone": {
            "apiPage":api.decoration.checkDecoration,
            "pageBtn":[],
            "postDataName": "customerPhonePostData",
            "condArr":["customerPhone"],
            "propertyArr":["设计部","设计师","业务部","业务员"],
            "hasExport":false
        }
    }
    function activityBtnMethod(uiPgDiv, decorationActivity){

        var deleteBtn = $("<span></span>").addClass("ui-icon icon-ban-circle red").attr("id", "delete_" + decorationActivity.daId).appendTo(uiPgDiv);

        deleteBtn.on("click", function(){
            deleteDecorationActivity(decorationActivity.daId);
        });
    }

    function uiBtnMethod(uiPgDiv, activityItem){

        if(activityItem.type == 1){
            var convertBtn = $("<span></span>").addClass("ui-icon icon-exchange").attr("id", "convert_" + activityItem.daiId).appendTo(uiPgDiv);
        }
        var abateBtn = $("<span></span>").addClass("ui-icon icon-ban-circle red").attr("id", "abate_" + activityItem.daiId).appendTo(uiPgDiv);

        if(activityItem.state == 0){
            if(activityItem.type == 1){
                convertBtn.on("click", function(){
                    convertDecorationActivityItem(activityItem);
                });
            }

            abateBtn.on("click", function(){
                abateDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
            });
        }
    }
    function deleteDecorationActivity(daId){

        var options = {
            "decorationActivity.daId": daId,
        }

        com.post(api.decoration.deleteDecorationActivity, options, function(res){
            $("#dactivity_" + res.decorationActivity.daId).remove();
        });
    }

    function convertDecorationActivityItem(activityItem){

        params.convertActivityItemId = activityItem.daiId;

        params.activity.convertActivityItemName.val(activityItem.activityItemName);
        params.activity.convertActivityItemMoney.val(0);

        $("#convertDecorationActivityItemModal").modal("show");
    }

    function abateDecorationActivityItem(daiId, activityItemName){

        bootbox.confirm("是否确认失效" + activityItemName + "活动物品?", function(result) {
            if(result){

                var options = {
                    "decorationActivityItem.daiId": daiId,
                }

                com.post(api.decoration.abateDecorationActivityItem, options, function(res){

                    var daiId = res.decorationActivityItem.daiId;

                    $("#convert_" + daiId).unbind();
                    $("#abate_" + daiId).unbind();
                    $("#widgetHeader_" + daiId).addClass("header-color-grey");
                })
            }
        });
    }

    drawNode = {
        draw: function (nodes) {
            var wizard = $("#fuelux-wizard");
            var ul = createUl(null,"wizard-steps");
            var container = $("#step-container");

            var isdesignPictureUpload = false;
            var isprojectPictureUpload = false;
            var isCADUpload = false;
            var isContractUpload = false;

            var title = {"basic":"基本信息","quotaion":"报价信息","picture":"图纸信息","material":"主材信息","activity":"活动信息","payment":"款项信息","belong":"归属信息","addreduce":"增减项"};

            if($.isEmptyObject(nodes)) return;

            $.each(nodes,function (i,v) {
                ul.append(createWizardStep(i + 1,title[v.type]));
                var stepPane = createStepPane(i + 1);
                var rows = [];
                switch(v.type){
                    case "basic":
                        rows = drawBasic(v);
                        break;
                    case "quotaion":
                        rows = drawQuotaion(v);
                        break;
                    case "picture":
                        rows = drawPicture(v);
                        break;
                    case "material":
                        rows = drawMaterial(v);
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
                }
                $.each(rows,function (j,b) {
                    stepPane.append(b)
                });
                stepPane.appendTo(container);

                if($.isEmptyObject(v.opt)) return;
                if($.isEmptyObject(v.opt.show)) return;

                $.each(v.opt.show,function (j,x) {
                    var $Obj = $("#" + x);
                    if($Obj[0].tagName.toLowerCase() == "input"){
                        $Obj.removeAttr("readonly");
                    }else if($Obj[0].tagName.toLowerCase() == "select"){
                        $Obj.prop("disabled", false);
                    }else if($Obj[0].tagName.toLowerCase() == "textarea"){
                        $Obj.removeAttr("readonly");
                    }
                    if(v.type == "picture"){
                        switch(x){
                            case "designPictureUpload":
                                isdesignPictureUpload = true;
                                break;
                            case "projectPictureUpload":
                                isprojectPictureUpload = true;
                                break;
                            case "CADUpload":
                                isCADUpload = true;
                                break;
                            case "ContractUpload":
                                isContractUpload = true;
                                break;

                        }
                    }
                })
            });
            ul.appendTo(wizard);
            if(isdesignPictureUpload){
                decorationUtils.loadHuploadify("designPictureUpload", "上传效果图", "*.jpg;*.jpge;*.gif;*.png", true, function(data){
                    decorationUtils.addDecorationPicture(data, 1, "designPictures");
                }, "btn btn-success");
            }
            if(isprojectPictureUpload){
                decorationUtils.loadHuploadify("projectPictureUpload", "上传工程图", "*.jpg;*.jpge;*.gif;*.png", true, function(data){
                    decorationUtils.addDecorationPicture(data, 2, "projectPictures");
                }, "btn btn-primary");
            }
            if(isCADUpload){
                decorationUtils.loadHuploadify("CADUpload", "上传工程文件", "*.dwg;*.dwt", false, function(data){
                    decorationUtils.addDecorationPicture(data, 0, "CADProjectPicture");
                }, "btn btn-warning");
            }
            if(isContractUpload){
                decorationUtils.loadHuploadify("ContractUpload", "上传合同图片", "*.jpg;*.jpge;*.gif;*.png", true, function(data){
                    decorationUtils.addDecorationPicture(data, 3, "ContractPictures");
                }, "btn btn-inverse");
            }
        },getConfig:function (page) {
            var pageConfig = {};
            pageConfig.condArr = ['orderId', 'village', 'houseNumber', 'houseArea', 'designer', 'salesman','orderType','salesmanType','quoter','escorter','designerRegionId','designerDepartmentId','salesmanRegionId','salesmanDepartmentId','measureTimeDateRange','depositTimeDateRange','signTimeDateRange','createTimeDateRange','houseClass','status'];

            pageConfig.postDataName = "";

            pageConfig.column = [
                ["订单编号","orderId"],
                ['楼盘地址',['house.village.name', 'house.houseNumber']],
                ['客户名','customer.name'],
                ['设计部','designer.dept.deptName'],
                ['设计师', 'designer.currentName'],
                ['业务部', 'salesman.dept.deptName'],
                ['业务员', 'salesman.currentName'],
                ['面积', 'house.buildArea'],
                ['合同报价', 'orderTotalPrice'],
                ['量房时间', 'measureTime'],
                ['签单时间', 'contractTime'],
                ['状态', 'status']
            ];

            pageConfig.propertyArr = ["楼盘地址","客户名","设计部","设计师","业务部","业务员","面积","签单额","报价金额","量房时间","签单时间","定金时间","创建时间","类型","状态","工程状态"];

            pageConfig.apiPage = decorationPage[page]["apiPage"];
            pageConfig.pageBtn = decorationPage[page]["pageBtn"];
            pageConfig.postDataName = decorationPage[page]["postDataName"];

            if(!$.isEmptyObject(decorationPage[page]["nodes"]))  pageConfig.nodes = decorationPage[page]["nodes"];
            if(!$.isEmptyObject(decorationPage[page]["condArr"]))  pageConfig.condArr = decorationPage[page]["condArr"];
            if(!$.isEmptyObject(decorationPage[page]["propertyArr"]))  pageConfig.propertyArr = decorationPage[page]["propertyArr"];
            pageConfig.hasExport = decorationPage[page]["hasExport"];

            return pageConfig;

        }

    };

})