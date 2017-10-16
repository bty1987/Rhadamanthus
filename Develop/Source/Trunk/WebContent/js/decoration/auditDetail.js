var decorationOrderDetail = {
    decorationOrderId:null,
    orderType:"",
    items: {},

    type:{
        "半包":0,
        "全包":1,
        "半价":2,
    },

    decorationOrder: {},
    customer:{},
    village:{},
    materialPaymentListGrid: null,
    materialPaymentGridPager: null,

    quotations:null,
    quotationDetail:{},

    reloadFlag:0,
    decorationOrderQuotationItemData:[]
};

var decorationPayment = {
    postParam:{},

    items:{},
    basePaymentGrid:null,
    otherPaymentGrid:null,
    otherPaymentPager:null,

    editFlag:0,
};

jQuery(function($) {

    decorationUtils.init();

    decorationOrderDetail.decorationOrderId = params.decorationOrderId;
    decorationOrderDetail.orderType = params.type;

    decorationPayment.postParam.decorationOrderId = decorationOrderDetail.decorationOrderId;
    decorationPayment.postParam["decorationPayment.orderId"] = decorationOrderDetail.decorationOrderId;

    decorationOrderDetail.materialPaymentListGrid = $("#materialPaymentListGrid");
    decorationOrderDetail.materialPaymentGridPager = "#materialPaymentGridPager";

    decorationPayment.otherPaymentGrid=$("#otherPaymentTable");
    decorationPayment.otherPaymentPager="#otherPaymentGridPager";
    decorationPayment.basePaymentGrid = $("#basePaymentTable");

    decorationOrderDetail.printQuotationModal = $("#printQuotationModal");
    decorationOrderDetail.activitys = $("#activitys");
    decorationOrderDetail.activityItems = $("#activityItems");

    decorationOrderDetail.items.houseType = $('#houseType');
    decorationOrderDetail.items.houseClass = $('#houseClass');

    com.post(api.ds.decoration, {}, function(res){
        decorationOrderDetail.items.houseType.bindData(res.houseType, 'key', 'value');
        decorationOrderDetail.items.houseClass.bindData(res.houseClass, 'key', 'value');
    }, null, false);

    $('#customerInfosBtn').on(ace.click_event, function(){
        $.gritter.add({
            title: '客户敏感信息',
            text: '邮箱 :'+decorationOrderDetail.customer.email+'<br /> QQ:'+decorationOrderDetail.customer.qq+'<br /> 微信:'+decorationOrderDetail.customer.wechat+'<br />  电话 :'+decorationOrderDetail.customer.phone+'<br />  客户类型:'+decorationOrderDetail.customer.relationshipType+'<br /> ',
            class_name: 'gritter-info gritter-center gritter-light'
        });

        return false;
    });

    $('#btnBack').on(ace.click_event, function(){
        com.switchPage(api.index.auditIndex.url);
    });

    initWizard();

    if(decorationOrderDetail.orderType == decorationOrderDetail.type["半价"]){
        decorationUtils.initDecorationHolonomy('step6',decorationOrderDetail.decorationOrderId);
    }

    $("#btnPrintDefaultQuotationInfo").on('click', function(res) {
        decorationOrderDetail.printQuotationModal.modal("show");
    });

    decorationUtils.initBaseInfo(decorationOrderDetail.decorationOrderId, api.decoration.queryDecorationOrderForCommonByOrderId, function(decorationOrder){

        var statuses = ["咨询", "量房", "已报价", "定金"];

        if(statuses.indexOf(decorationOrder.status)){
            $("#houseType").prop("disabled", false);
        }else{
            decorationOrder.status == "已签约" ? $("#houseType").prop("disabled", true) : $("#houseType").prop("disabled", false);
        }
        $("#orderId").val(decorationOrder.orderId).attr("disabled", true);
        $("#customer").val(decorationOrder.customer.customerName).attr("disabled", true);
        $("#houseAddr").val(decorationOrder.village.villageName + decorationOrder.houseNumber).attr("disabled",true);
        $("#designDepartment").val(decorationOrder.designDepartment).attr("disabled", true);
        $("#designer").val(decorationOrder.designer).attr("disabled", true);
        $("#businessDepartment").val(decorationOrder.businessDepartment).attr("disabled", true);
        $("#salesman").val(decorationOrder.salesman).attr("disabled", true);
        $("#houseType").val(decorationOrder.houseType).attr("disabled", true);
        $("#houseClass").val(decorationOrder.houseClass).attr("disabled", true);
        $("#houseArea").val(decorationOrder.houseArea).attr("disabled", true);
        $("#freeArea").val(decorationOrder.freeArea).attr("disabled", true);
        $("#status").val(decorationOrder.status).attr("disabled", true);
        $("#createTime").val(decorationOrder.createTime).attr("disabled", true);

        $("#backOrderName").val(decorationOrder.backOrderName);
        $("#backOrderPhone").val(decorationOrder.backOrderPhone);
        $("#backOrderContent").val(decorationOrder.backOrderContent);

        $("#notSalesmanName").val(decorationOrder.notSalesmanName);
        $("#notSalesmanPhone").val(decorationOrder.notSalesmanPhone);
        $("#notSalesmanRate").val(decorationOrder.notSalesmanRate);
        $("#notSalesmanContent").val(decorationOrder.notSalesmanContent);

        $("#salesmanType").val(decorationOrder.salesmanType);

        decorationOrderDetail.customer.id = decorationOrder.customer.id;
        decorationOrderDetail.customer.phone = decorationOrder.customer.phone;
        decorationOrderDetail.customer.qq = decorationOrder.customer.qq;
        decorationOrderDetail.customer.wechat = decorationOrder.customer.wechat;
        decorationOrderDetail.customer.email = decorationOrder.customer.email;
        decorationOrderDetail.customer.relationshipType = decorationOrder.customer.relationshipType;
        decorationOrderDetail.customer.approveStatus = decorationOrder.customer.approveStatus;

        decorationOrderDetail.decorationOrder.type = decorationOrder.type;
    });

    decorationUtils.initPayment(decorationOrderDetail.decorationOrderId, false);

});

function initWizard(){
    $('#fuelux-wizard').ace_wizard({"status":true}).on('change' , function(e, info){

        var curstep = 0;

        info.direction === "previous" ? curstep = info.step - 1 : curstep = info.step;

        if(curstep == 2){
            quotationUtils.loadQuotationDetail();
        }else if(curstep == 3){
            decorationUtils.initDecorationPicture("designPictures", "projectPictures", "CADProjectPicture", decorationOrderDetail.decorationOrderId);
        }else if(curstep == 4){
            decorationUtils.initMaterial(decorationOrderDetail.decorationOrderId);
        }else if(curstep == 5){
            decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, null, decorationOrderDetail.decorationOrderId);
            decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, null, decorationOrderDetail.decorationOrderId);
        }else if(curstep == 7){
            decorationUtils.initDecorationBelong(decorationOrderDetail.decorationOrderId);
        }else if(curstep == 8){
            addReduce(params.decorationOrderId);
        }
    }).on('finished', function(e) {
        com.switchPage(api.index.auditIndex.url);
    }).on('stepclick', function(e,info){

        if(info.step == 2){
            quotationUtils.loadQuotationDetail();
        }else if(info.step == 3){
            decorationUtils.initDecorationPicture("designPictures", "projectPictures", "CADProjectPicture", decorationOrderDetail.decorationOrderId);
        }else if(info.step == 4){
            decorationUtils.initMaterial(decorationOrderDetail.decorationOrderId);
        }else if(info.step == 5){
            decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, null, decorationOrderDetail.decorationOrderId);
            decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, null, decorationOrderDetail.decorationOrderId);
        }else if(info.step == 7){
            decorationUtils.initDecorationBelong(decorationOrderDetail.decorationOrderId);
        }else if(info.step == 8){
            addReduce(params.decorationOrderId);
        }
    });
}

function downloadFile(picturePath,uploadFileName){
    window.open(config.media + api.common.downloadFile.url + "?downloadFilePath="+picturePath+"&fileName="+uploadFileName);
}

function quotationItemDesFormatter(cellvalue, options, rowObject){
    var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="right" title="'+rowObject.quotationItemDes+'">工艺</span>';
    html += "<input type='text' class='hide' value='"+rowObject.quotationItemDes+"' />";
    return html;
}

function quotationItemDesUnformat(cellvalue, options, cell){
    return $('input', cell).val();
}
function addReduce(orderId) {
    var $resList = $('#resLists').html('');
    var $table = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable ');

    $resList.append($table);
    var discount = null;
    var qid = null;
    var versionid = null;

    com.post(api.addReduce.queryAddReduceByOrderId, {'addReduce.orderId': orderId}, function (data) {
        com.post(api.quotation.queryQuotationForDefaultByOrderId,
            {
                "quotation.orderId": params.decorationOrderId,
                "quotation.type": params.orderType
            }, function (res) {
                discount = res.quotation.discount;
                qid = res.quotation.qid;
                versionid = res.quotation.versionId;
            }, null, false);

        if (data.addReduces && data.addReduces.length) {
            $.each(data.addReduces, function (i, v) {
                var typeDict = {"0": "增项", "1": "减项", "2": "漏项"};
                var statusDict = {"0": "未提交", "1": "未付款", "2": "已付款", "3": "已确认"};
                var type = {"0": "普通", "1": "系统", "2": "自定义", "3": "报价中", "4": "增项"};
                var $div = $('<li style="margin-bottom: 0px;"></li>').addClass('widget-box  collapsed item-orange clearfix');


                var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.content));
                var $ulProperty = $('<ul style="margin-bottom: 10px;"></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons widget-toolbar no-border');

                var $a = $('<a href="#" data-action="collapse"></a>').append($('<i class="icon-chevron-down"></i>'));

                var $divv = $('<div style="border: 0px solid transparent;"></div>').addClass('widget-body');
                var $divvv = $('<div style="display: block;"></div>').addClass('widget-body-inner');

                var propertyArr = [
                    ["总价:", v.total, "red"],
                    ["类别:", typeDict[v.type + ''], "red"],
                    ["状态:", statusDict[v.status], "red"],
                    ["添加时间:", v.createTime, "red"],
                    ["折扣:", discount, "red"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });
                var $uul = $('<table></table>').addClass('table').appendTo($divvv).appendTo($divv);
                var $thead = $('<thead><tr><th>序号</th><th>工程预算量</th><th>名称</th><th>类型</th><th>工种</th><th>功能区</th><th>单位</th><th>' +
                    '单价</th><th>总价</th></tr></thead>')

                var $tbody = $('<tbody></tbody>');
                $uul.append($thead).append($tbody);

                com.post(api.addReduce.queryAddReduceItemByAddReduceId, {"addReduce.arId": v.arId}, function (ress) {

                    if (ress.addReduceItems && ress.addReduceItems.length) {
                        $.each(ress.addReduceItems, function (j, r) {
                            var index = j + 1;
                            var $tr = $('<tr><th scope="row">' + index + '</th><th>' + r.num + '</th><th>' + r.itemName + '</th><th>' + (type[r.type]) + '</th>' +
                                '<th>' + r.workType + '</th><th>' + (r.quotationFunctionAreaName ? r.quotationFunctionAreaName : "---") + '</th>' +
                                '<th>' + r.measurementUnit + '</th><th>' + r.unitPrice + '</th><th>'
                                + (Math.round((r.unitPrice)*(r.num))) + '</th></tr>');

                            $tbody.append($tr);
                        });
                    }
                })
                $divBtnWrap.append($a).appendTo($h3);

                $div.append($h3).append($ulProperty).append($divv);

                $table.append($div);
            });
        } else {
            $resList.html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            $mesg.append($('<span></span>').text('无可用数据提供'));
        }
    })
}