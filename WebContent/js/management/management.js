
jQuery(function($) {
    
    var management = {
        
        items: {},
            
        decorationTimeTypeMap: [{"key":"1", "value":"录入时间"}, {"key":"2", "value":"签单时间"}, {"key": 3, "value": "预签时间"}],
        decorationStatusMap: [],
        decorationPaymentTypeMap: [{"key":"首付款", "value":"首付款"}, {"key":"首付二期款", "value":"首付二期款"}, {"key":"二期款", "value":"二期款"}, {"key":"尾款", "value":"尾款"}, ],
        decorationPaymentRefundMap: [{"key":"设计费", "value":"设计费"}, {"key":"定金", "value":"定金"}, ],
        materialPaymentTypeMap: [{"key":"2", "value":"定金"}, {"key":"3", "value":"补款"},{"key":"4", "value":"退款"}, {"key":"5", "value":"补款退款"},{"key":"6", "value":"券退款"},],
        
        constructionSchedule: {}
    };
    
    management.items.oldOrderId = com.focusPage("#oldOrderId");
    management.items.newOrderId = com.focusPage("#newOrderId");
    
    management.items.orderIdForTime = com.focusPage("#orderIdForTime");
    management.items.orderDate = com.focusPage("#orderDate");
    management.items.orderTime = com.focusPage("#orderTime");
    
    management.items.orderIdForVersionId = com.focusPage("#orderIdForVersionId");
    management.items.versionId = com.focusPage("#versionId");
    
    management.items.orderIdOfDecorationGrade = com.focusPage("#orderIdOfDecorationGrade");
    
    management.items.orderIdForStatus = com.focusPage("#orderIdForStatus");
    
    management.items.orderIdPaymentForTime = com.focusPage("#orderIdPaymentForTime");
    management.items.orderPaymentDate = com.focusPage("#orderPaymentDate");
    management.items.orderPaymentTime = com.focusPage("#orderPaymentTime");
    
    management.items.refundOrderId = com.focusPage("#refundOrderId");
    
    management.items.msoNo = com.focusPage("#msoNo");
    management.items.orderIdForOrderId = com.focusPage("#orderIdForOrderId");
    
    management.items.msoNoForTime = com.focusPage("#msoNoForTime");
    management.items.materialPaymentDate = com.focusPage("#materialPaymentDate");
    management.items.materialPaymentTime = com.focusPage("#materialPaymentTime");
    
    management.items.orderIdForQuotationTime = com.focusPage("#orderIdForQuotationTime");
    
    management.items.quotationFunctionItemForManageRate = com.focusPage("#quotationFunctionItemForManageRate");
    management.items.quotationNames = com.focusPage("#quotationNames");
    management.items.manageRate = com.focusPage("#manageRate");
    
    management.items.quotationOfOrderId = com.focusPage("#quotationOfOrderId");
    management.items.quotationFunctionArea = com.focusPage("#quotationFunctionArea");
    management.items.quotationFunctionAreaName = com.focusPage("#quotationFunctionAreaName");
    
    management.items.dateRange = com.focusPage("#dateRange");
    
    management.items.contractTimeRange = com.focusPage("#contractTimeRange");

    management.items.paymentTimeRange = com.focusPage("#paymentTimeRange");

    management.items.quotationForOrderId = com.focusPage("#quotationForOrderId");
    management.items.quotationData = com.focusPage("#quotationData");
    management.items.quotationStatus = com.focusPage("#quotationStatus");
    
    management.items.changeSalesNo = com.focusPage("#changeSalesNo");
    
    management.items.orderId4decorationActivityItem = com.focusPage("#orderId4decorationActivityItem");
    
    management.items.orderId4decorationHolonomy = com.focusPage("#orderId4decorationHolonomy");
    management.items.materialPrice = com.focusPage("#materialPrice");
    
    management.items.orderId4constructionschedule = com.focusPage("#orderId4constructionschedule");
    management.items.csid4constructionschedule = com.focusPage("#csid4constructionschedule");
    management.items.check4constructionschedule = com.focusPage("#check4constructionschedule");

    management.decorationForOrderIdModal = com.focusPage("#decorationForOrderIdModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.decorationForTimeModal = com.focusPage("#decorationForTimeModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.decorationForVersionIdModal = com.focusPage("#decorationForVersionIdModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.decorationForStatusModal = com.focusPage("#decorationForStatusModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.decorationPaymentForTimeModal = com.focusPage("#decorationPaymentForTimeModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.amountDecorationActivityItemModal = com.focusPage("#amountDecorationActivityItemModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.updateDecorationHolonomyModal = com.focusPage("#updateDecorationHolonomyModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.refundOrderPaymentByOrderModal = com.focusPage("#refundOrderPaymentByOrderModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.MaterialForOrderIdModal = com.focusPage("#MaterialForOrderIdModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.materialPaymentForTimeModal = com.focusPage("#materialPaymentForTimeModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.subDecorationForQuotationTimeModal = com.focusPage("#subDecorationForQuotationTimeModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.updateQuotationFunctionItemForManageRateModal = com.focusPage("#updateQuotationFunctionItemForManageRateModal").on('hide.bs.modal', function(e){
        management.items.quotationNames.bindData([], 'qid', 'quotationName');

        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.exportMaterialPaymentModal = com.focusPage("#exportMaterialPaymentModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.exportDecorationForContractTimeModal = com.focusPage("#exportDecorationForContractTimeModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });

    management.exportDecorationPaymentForContractTimeModal = com.focusPage("#exportDecorationPaymentForContractTimeModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });

    management.updateQuotationForStatusModal = com.focusPage("#updateQuotationForStatusModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.addQuotationFunctionAreaModal = com.focusPage("#addQuotationFunctionAreaModal").on('hide.bs.modal', function(e){
        management.items.quotationFunctionArea.html("");

        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.changeDecorationForGradeModal = com.focusPage("#changeDecorationForGradeModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.changeSalesForGradeModal = com.focusPage("#changeSalesForGradeModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.changeSalesForStatusModal = com.focusPage("#changeSalesForStatusModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    management.checkoutConstructionScheduleModal = com.focusPage("#checkoutConstructionScheduleModal").on('hide.bs.modal', function(e){
        com.cleanItems(management.items);
        com.clearValidator();
    });
    
    com.datetime(com.focusPage(".date-picker-date"), "date");
    com.datetime(com.focusPage(".maskInput"), "time");
    
    com.focusPage('#quotationFunctionItemForManageRate').on("blur", function(){
        
        var options = {
            "quotation.orderId": $(this).val(),
        }
        
        com.post(api.quotation.queryQuotationByOrderId, options, function(res){
            com.focusPage("#quotationNames").bindData(res.quotations, 'qid', 'quotationName');
        });
    });

    com.focusPage('#quotationForOrderId').on("blur", function(){

        var options = {
            "quotation.orderId": $(this).val(),
        }

        com.post(api.quotation.queryQuotationByOrderId, options, function(res){
            com.focusPage("#quotationData").bindData(res.quotations, 'qid', 'quotationName');
        });
    });
    
    management.items.orderId4constructionschedule.on("blur", function(){
        
        var orderId = $(this).val();
        
        var constructionNodes = [];
        
        com.post(api.data.queryConstructionNodeByOrderId, {"orderId": orderId}, function(res){
            constructionNodes = res.constructionNodes.split("sort", "name");
        }, null, false);
        
        com.post(api.construction.queryConstructionScheduleByOrderId, {"constructionSchedule.orderId": orderId}, function(res){
            
            var constructionSchedules = res.constructionSchedules;
            
            $.each(constructionSchedules, function(i, v){
                v["name"] = constructionNodes[v["schedule"]];
            });
            
            management.items.csid4constructionschedule.bindData(constructionSchedules, 'csid', 'name');
        }, null, false);
    });
    
    management.items.quotationOfOrderId.on("blur", function() {

        var orderId = $(this).val();
        if (orderId) {
            com.post(api.decoration.queryDecorationByOrderId, {"decorationOrderId": orderId}, function (res){
                var versionId = res.decoration.version.no;

                com.post(api.quotation.queryFunctionAreaByVersionId, {"functionArea.version.no" : versionId}, function(data) {
                    var functionAreas = [];

                    $.each(data.functionAreas, function(i, v) {
                        if (v.type == 1) {
                            functionAreas.push(v);
                        }
                    });

                    management.items.quotationFunctionArea.bindData(functionAreas, 'faid', 'name', "请选择");
                }, null, false);

            }, function (res) {
                com.showAlert(com.error, res.errorMsg);
                management.items.quotationFunctionArea.html("");
            }, false);
        }
    }).on('focus', function(){
        management.items.quotationFunctionArea.html("");
    });
    
    management.items.quotationFunctionArea.on("change", function(){
        management.items.quotationFunctionAreaName.val($(this).find("option:selected").text())
    });
    
    com.focusPage("#changeDecorationForOrderId").click(function(){
        management.decorationForOrderIdModal.modal("show");
    });
    
    com.focusPage("#changeDecorationForGrade").click(function(){
        management.changeDecorationForGradeModal.modal("show");
    });
    
    com.focusPage("#changeDecorationForTime").click(function(){
        
        com.focusPage("#timeType").bindData(management.decorationTimeTypeMap, 'key', 'value');
        
        management.decorationForTimeModal.modal("show");
    });
    
    com.focusPage("#changeDecorationForVersionId").click(function(){
        
        com.post(api.quotation.queryQuotationVersion, {}, function(res){
            com.focusPage("#versionId").bindData(res.quotationVersions, 'no', 'name');
        });
        
        management.decorationForVersionIdModal.modal("show");
    });
    
    com.focusPage("#changeDecorationForStatus").click(function(){
        
        com.post(api.ds.decoration,{},function (res) {
            com.focusPage("#orderStatus").bindData(res.decorationOrderStatus, 'key', 'value');
        });
        
        management.decorationForStatusModal.modal("show");
    });
    
    com.focusPage("#changeDecorationPyamentForTime").click(function(){
        
        com.focusPage("#orderPaymentType").bindData(management.decorationPaymentTypeMap, 'key', 'value');
        
        management.decorationPaymentForTimeModal.modal("show");
    });
    
    com.focusPage("#amountDecorationActivityItem").click(function(){
        management.amountDecorationActivityItemModal.modal("show");
    });

    com.focusPage("#updateDecorationHolonomy").click(function(){
        management.updateDecorationHolonomyModal.modal("show");
    });
    
    // com.focusPage("#refundOrderForOrderId").click(function(){
    //
    //     com.focusPage("#refundOrderPaymentType").bindData(management.decorationPaymentRefundMap, 'key', 'value');
    //
    //     management.refundOrderPaymentByOrderModal.modal("show");
    // });
    
    com.focusPage("#changeMaterialForOrderId").click(function(){
        
        management.MaterialForOrderIdModal.modal("show");
    });
    
    com.focusPage("#changeMaterialPyamentForTime").click(function(){
        
        com.focusPage("#materialPaymentType").bindData(management.materialPaymentTypeMap, 'key', 'value');
        
        management.materialPaymentForTimeModal.modal("show");
    });
    
    com.focusPage("#subDecorationForQuotationTime").click(function(){
        
        management.subDecorationForQuotationTimeModal.modal("show");
    });
    
    com.focusPage("#updateQuotationFunctionItemForManageRate").click(function(){
        
        management.updateQuotationFunctionItemForManageRateModal.modal("show");
    });
    
    com.focusPage("#changeSalesForGrade").click(function(){
        
        management.changeSalesForGradeModal.modal("show");
    });
    
    com.focusPage("#changeSalesForStatus").click(function(){
        management.changeSalesForStatusModal.modal("show");
    });
    
    com.focusPage("#exportMaterialPayment").click(function(){
        
        management.exportMaterialPaymentModal.modal("show");
    });
    
    com.focusPage("#exportDecorationForContractTime").click(function(){
        
        management.exportDecorationForContractTimeModal.modal("show");
    });

    com.focusPage("#exportDecorationPaymentForContractTime").click(function(){

        management.exportDecorationPaymentForContractTimeModal.modal("show");
    });

    com.focusPage("#updateQuotationForStatus").click(function(){

        management.updateQuotationForStatusModal.modal("show");
    });
    
    com.focusPage("#addQuotationFunctionArea").click(function(){

        management.addQuotationFunctionAreaModal.modal("show");
    });
    
    com.focusPage("#checkoutConstructionSchedule").click(function(){
        
        management.checkoutConstructionScheduleModal.modal("show");
    });
    
    com.focusPage("#saveOrderIdBtn").click(function(){

        if(com.validate("decorationForOrderIdModal")){
            return false;
        }

        var options = {
            "decoration.orderId": com.focusPage("#oldOrderId").val(),
            "decorationOrderId": com.focusPage("#newOrderId").val(),
        };

        com.post(api.decoration.changeDecorationForOrderId, options, function(res){
            com.showAlert(com.info, "操作成功");
        });

        management.decorationForOrderIdModal.modal("hide");
    });
    
    com.focusPage("#saveOrderDateBtn").click(function(){
        
        if(com.validate("decorationForTimeModal")){
            return false;
        }
        
        var options = {
            "decoration.orderId": com.focusPage("#orderIdForTime").val(),
            "timeType": com.focusPage("#timeType").val(),
            "dateTime": com.focusPage("#orderDate").val() + " " + com.focusPage("#orderTime").val(),
        };
        
        com.post(api.decoration.changeDecorationForTime, options, function(res){
            com.showAlert(com.info, "操作成功");
        });
        
        management.decorationForTimeModal.modal("hide");
    });
    
    com.focusPage("#saveVersionIdBtn").click(function(){
        
        if(com.validate("decorationForVersionIdModal")){
            return false;
        }
        
        var options = {
            "decoration.orderId": com.focusPage("#orderIdForVersionId").val(),
            "decoration.version.no": com.focusPage("#versionId").val(),
        };
        
        com.post(api.decoration.changeDecorationForVersionId, options, function(res){
            com.showAlert(com.info, "操作成功");
        });
        
        management.decorationForVersionIdModal.modal("hide");
    });
    
    com.focusPage("#saveOrderPaymentDateBtn").click(function(){
        
        if(com.validate("decorationPaymentForTimeModal")){
            return false;
        }
        
        var options = {
            "decorationPayment.decoration.orderId": com.focusPage("#orderIdPaymentForTime").val(),
            "decorationPayment.paymentType": com.focusPage("#orderPaymentType").val(),
            "dateTime": com.focusPage("#orderPaymentDate").val() + " " + com.focusPage("#orderPaymentTime").val(),
        };
        
        com.post(api.common.changeDecorationPaymentForTime, options, function(res){
            com.showAlert(com.info, "操作成功");
        });
        
        management.decorationPaymentForTimeModal.modal("hide");
    });
    
    com.focusPage("#refundOrderPaymentBtn").click(function(){
        
        if(com.validate("refundOrderPaymentByOrderModal")){
            return false;
        }
        
        var options = {
            "decorationPayment.decortion.orderId": com.focusPage("#refundOrderId").val(),
            "decorationPayment.paymentType": com.focusPage("#refundOrderPaymentType").val(),
        };
        
        com.post(api.payment.refundDecorationPayment, options, function(res){
            com.showAlert(com.info, "操作成功");
        });
        
        management.refundOrderPaymentByOrderModal.modal("hide");
    });
    
    com.focusPage("#saveMaterialOrderIdBtn").click(function(){
        
        if(com.validate("MaterialForOrderIdModal")){
            return false;
        }
        
        var options = {
            "material.no": com.focusPage("#msoNo").val(),
            "material.orderId": com.focusPage("#orderIdForOrderId").val(),
        };
        
        com.post(api.common.changeMaterialForOrderId, options, function(res){
            com.showAlert(com.info, "操作成功");
        });
        
        management.MaterialForOrderIdModal.modal("hide");
    });
    
    com.focusPage("#changeDecorationGradeBtn").click(function(){
        
        if(com.validate("orderIdOfDecorationGrade")){
            return false;
        }
        
        var options = {
            "decoration.orderId": com.focusPage("#orderIdOfDecorationGrade").val(),
            "decoration.grade": com.focusPage("#decorationGrade").val()
        }
        
        var decoration = null;
        
        com.post(api.decoration.queryDecorationForCommonByOrderId, options, function(res){
            decoration = res.decoration;
        }, null, false);
        
        if(decoration != null){
            
            options["decoration.houseType"] = decoration.houseType;
            options["decoration.houseClass"] = decoration.houseClass;
            options["decoration.type"] = decoration.type;
            
            com.post(api.decoration.changeDecorationForAdvance, options, function(res){
                com.showAlert(com.info, "操作成功");
            }, null, false);
        }else{
            com.showAlert(com.warning, "装修单不存在");
        }
        
        management.changeDecorationForGradeModal.modal("hide");
    });
    
    com.focusPage("#saveBtn", "#amountDecorationActivityItemModal").click(function(){
        
        if(com.validate("amountDecorationActivityItemModal")){
            return false;
        }
        
        var options = {
            "decoration.orderId": com.focusPage("#orderId4decorationActivityItem").val(),
        };
        
        com.post(api.decoration.amountDecorationActivityItem, options, function(res){
            com.showAlert(com.info, "操作成功");
        });
        
        management.amountDecorationActivityItemModal.modal("hide");
    });
    
    com.focusPage("#saveBtn", "#updateDecorationHolonomyModal").click(function(){
        
        if(com.validate("updateDecorationHolonomyModal")){
            return false;
        }
        
        var options = {
            "decorationHolonomy.decoration.orderId": com.focusPage("#orderId4decorationHolonomy").val(),
            "decorationHolonomy.materialPrice": com.focusPage("#materialPrice").val()
        };
        
        com.post(api.decoration.updateDecorationHolonomy, options, function(res){
            com.showAlert(com.info, "操作成功");
        });
        
        management.updateDecorationHolonomyModal.modal("hide");
    });
    
    com.focusPage("#saveStatusBtn").click(function(){
        
        if(com.validate("decorationForStatusModal")){
            return false;
        }
        
        var options = {
            "decoration.orderId": com.focusPage("#orderIdForStatus").val(),
            "decoration.status": com.focusPage("#orderStatus").val(),
        };
        
        com.post(api.decoration.changeDecorationForStatus, options, function(res){
            com.showAlert(com.info, "操作成功");
        });
        
        management.decorationForStatusModal.modal("hide");
    });
    
    com.focusPage("#saveMaterialPaymentDateBtn").click(function(){
        
        if(com.validate("materialPaymentForTimeModal")){
            return false;
        }
        
        var options = {
            "materialPayment.material.no": com.focusPage("#msoNoForTime").val(),
            "materialPayment.paymentType": com.focusPage("#materialPaymentType").val(),
            "dateTime": com.focusPage("#materialPaymentDate").val() + " " + com.focusPage("#materialPaymentTime").val(),
        };
        
        com.post(api.common.changeMaterialPaymentForTime, options, function(res){
            com.showAlert(com.info, "操作成功");
        });
        
        management.materialPaymentForTimeModal.modal("hide");
    });
    
    com.focusPage("#saveDecorationForQuotationTimeBtn").click(function(){
        
        if(com.validate("subDecorationForQuotationTimeModal")){
            return false;
        }
        
        var options = {
            "decoration.orderId": com.focusPage("#orderIdForQuotationTime").val(),
        };
        
        com.post(api.decoration.subDecorationForQuotationTime, options, function(res){
            com.showAlert(com.info, "操作成功");
        });
        
        management.subDecorationForQuotationTimeModal.modal("hide");
    });
    
    com.focusPage("#saveQuotationFunctionItemForManageRateBtn").click(function(){
        
        if(com.validate("updateQuotationFunctionItemForManageRateModal")){
            return false;
        }
        
        var options = {
            "quotation.qid": management.items.quotationNames.val(),
            "quotationFunctionAreaItem.type": 3,
            "quotationFunctionAreaItem.unitPrice": management.items.manageRate.val(),
        };
        
        com.post(api.quotation.updateQuotationFunctionAreaItemByQuotationIdAType, options, function(res){
            com.showAlert(com.info, "操作成功");
        });

        management.updateQuotationFunctionItemForManageRateModal.modal("hide");
    });

    com.focusPage("#saveQuotationStatusBtn").click(function(){
        
        if(com.validate("updateQuotationForStatusModal")){
            return false;
        }

        var options = {
            "quotation.qid": management.items.quotationData.val(),
            "quotation.status":management.items.quotationStatus.val(),
        };

        com.post(api.quotation.updateQuotationForStatus, options, function(res){
            com.showAlert(com.info, "操作成功");
        });
        management.items.quotationData.html("");
        management.updateQuotationForStatusModal.modal("hide");

    });
    
    com.focusPage("#saveQuotationFunctionBtn").click(function() {

        if(com.validate("addQuotationFunctionAreaModal")){
            return false;
        }

        com.showConfirm("你确认添加此功能区么", function() {

            var orderId = management.items.quotationOfOrderId.val();
            var functionAreaId = management.items.quotationFunctionArea.val();
            var functionAreaName = management.items.quotationFunctionAreaName.val();
            
            var option = {
                "quotation.orderId": orderId,
                "quotationFunctionArea.id": functionAreaId,
                "quotationFunctionArea.functionAreaName": functionAreaName,
            };

            com.post(api.quotation.addQuotationFunctionArea, option, function () {
                com.showAlert(com.info, "操作成功");
                management.addQuotationFunctionAreaModal.modal("hide");
            });
        }, function() {
            management.addQuotationFunctionAreaModal.modal("hide");
        });

    });
    
    com.focusPage("#changeSalesGradeBtn").click(function(){
        
        if(com.validate("changeSalesNo")){
            return false;
        }
        
        var options = {
            "sales.no": com.focusPage("#changeSalesNo").val(),
            "sales.grade": com.focusPage("#salesGrade").val()
        }
        
        var sales = null;
        
        com.post(api.inventory.querySalesByNo, options, function(res){
            sales = res.sales;
        }, null, false);
        
        if(sales != null){
            
            options["sales.sid"] = sales.sid;
            
            com.post(api.inventory.updateSales, options, function(res){
                com.showAlert(com.info, "操作成功");
            }, null, false);
        }else{
            com.showAlert(com.warning, "销售单不存在");
        }
        
        management.changeSalesForGradeModal.modal("hide");
    });
    
    com.focusPage("#changeSalesStatusBtn").click(function(){

        if(com.validate("changeSalesForStatusModal")){
            return false;
        }

        var options = {
            "sales.no": com.focusPage("#salesNo").val()
        }

        var sales = null;

        com.post(api.sales.querySalesByNo, options, function(res){
            sales = res.sales;
        }, null, false);

        if(sales != null){

            options["sales.sid"] = sales.sid;

            com.post(api.sales.updateSalesForAdvance, options, function(res){
                com.showAlert(com.info, "操作成功");
            }, null, false);
        }else{
            com.showAlert(com.warning, "销售单不存在");
        }

        management.changeSalesForStatusModal.modal("hide");
    });
    
    com.focusPage("#save2checkconstructionschedule").click(function(){
        
        if(com.validate("checkoutConstructionScheduleModal")){
            return false;
        }
        
        var options = {
            "constructionSchedule.csid": management.items.csid4constructionschedule.val(),
            "constructionSchedule.checkout": management.items.check4constructionschedule.val()
        }
        
        com.post(api.construction.checkoutConstructionSchedule, options, function(res){
            com.showAlert(com.info, "操作成功");
        });
        
        management.checkoutConstructionScheduleModal.modal("hide");
    });
    
    com.focusPage("#exportMaterialPaymentBtn").click(function(){
        
        if(com.validate("exportMaterialPaymentModal")){
            return false;
        }
        
        var url = api.common.exportMaterialPayment.url + "?filters[0].data=" + com.focusPage("#dateRange").val() + "&filters[0].field=collectTime&filters[0].op=between&filters[1].field=paymentStatus&filters[1].data=0&filters[1].op=ne";
        
        window.open(decodeURI(url));
    });
    
    com.focusPage("#exportDecorationForContractTimeBtn").click(function(){
        
        if(com.validate("exportDecorationForContractTimeModal")){
            return false;
        }
        
        var url = api.decoration.exportDecorationByContractTime.url + "?filters[0].data=" + com.focusPage("#contractTimeRange").val() + "&filters[0].field=signTimeDateRange&filters[0].op=between&filters[1].field=status&filters[1].data=已签约&filters[1].op=eq";
        
        window.open(decodeURI(url));
    });

    com.focusPage("#exportDecorationPaymentForContractTimeBtn").click(function(){
        
        if(com.validate("exportDecorationPaymentForContractTimeModal")){
            return false;
        }

        var url = api.payment.exportDecorationPayment.url + "?filters[0].data=" + com.focusPage("#paymentTimeRange").val() + "&filters[0].field=collectTime&filters[0].op=between";

        window.open(decodeURI(url));
    });
    
    com.focusPage("#updateFR").bindClick(function(){
        
        if(params.userInfo.user.userId != 'FL-06189'){
            com.showAlert(com.error, "无操作权限");
            
            return false;
        }

        com.post({url: "HASIPHXW.do", server: "communion"}, {});
    });
    
    com.focusPage("#zentao").bindClick(function(){
        
        var account = params.userInfo.user.loginId;
        var code = "platform";
        var keyse = "kwz84soes3m3tqmsnvgmmmlrbfzofgt9";
        
        var time = parseInt(new Date().getTime() / 1000);
        
        var url = window.location.href.indexOf("192.168") != -1 ? "http://192.168.5.27/" : "http://223.100.27.233:30082/";
        
        window.open(url + "zentao/api.php?m=user&f=apilogin&account=" + account + "&code=" + code + "&time=" + time + "&token=" + utils.md5(code+keyse+time, 32));
    });
    
    com.focusPage("#platformdocument").bindClick(function(){
        
        var url = window.location.href.indexOf("192.168") != -1 ? "http://192.168.5.21/" : "http://223.100.27.233:30080/";
        
        com.popup("平台文档", url + "/sphinx/index.html", null, null, false);
    });
});
