jQuery(function ($) {

    var wizardSept = {
        "1": false,
        "2": false,
        "3": false,
        "4": false,
        "5": false,
        "6": false
    };

    com.focusPage('#fl-statement').statement("配置公司", "当前公司为:" + params.company.name);

    com.focusPage('#fuelux-wizard').ace_wizard({"status": true}).on('change', function(e, info) {

    }).on('stepclick', function(e,info){

        wizardSept[info.step] = true;

    }).on('finished', function(e) {
    	// com.switchPage("/views/system/company.html");
    });

    // 1.报价版本
    showModal(['quotationVersionModal','添加报价版本'],
        [
            ['versionId','编号','hide col-xs-10 col-sm-5 v_required v_versionId','text'],
            ['versionName','名称','col-xs-10 col-sm-7 v_name v_required','text'],
            ['trafficRate','车运费比例','col-xs-10 col-sm-7 v_float v_required','text'],
            ['trafficDiscount','车运费折扣','ace col-xs-10 col-sm-7','checkbox'],
            ['manageRate','管理费比例','col-xs-10 col-sm-7 v_float v_required','text'],
            ['manageDiscount','管理费折扣','ace col-xs-10 col-sm-7','checkbox'],
            ['versionDes','信息','col-xs-10 col-sm-7 v_name','textarea'],
            ['defaultFlag','默认','ace','checkbox']
        ],['saveQuotationBtn','cancelQuotationBtn']
    );
    // 3.款项
    showModal(['paymentScaleModal','款项比例','myModalLabel'],
        [
            ['names','款项','col-xs-10 col-sm-6 v_required','text'],
            ['comment','备注','col-xs-10 col-sm-6','textarea']
        ],['savePaymentScale','cancelPaymentScale']
    );
    // 5.放线小组
    showModal(['drawLineModal','放线小组'],
        [
            ['drawLineGroup','放线小组','col-xs-10 col-sm-6 span6 m-wrap popovers v_drawlingroup','text'],
            ['contentadd','说明','col-xs-10 col-sm-6','textarea']
        ],['saveDrawLineBtn','cancelDrawLineBtn']
    );
    // 6.收据类型
    showModal(['receiptTypeModal','收据类型','rtId'],
        [
            ['name','收据类型','col-xs-10 col-sm-6 v_required','text'],
            ['no','键值','col-xs-10 col-sm-6 v_required','text'],
            ['type','类型','col-xs-10 col-sm-6 v_required','select',{"1":"现金","2":"银行","3":"转账","4":"对公账户","5":"券"}]
        ],['saveReceiptTypeBtn','cancelReceiptTypeBtn']
    );

    var companyConfig = {
        /* 1. */
        quotationVersion: {
            saveQuotation: com.focusPage("#saveQuotationBtn").on("click", saveQuotation),
            cancelQuotation: com.focusPage("#cancelQuotationBtn"),
            modal: com.focusPage("#quotationVersionModal").on("show.bs.modal", function (e) {
                com.clearValidator();
                com.clearValidator("#versionId", true)
            }),
            items: {
                versionId: com.focusPage("#versionId").on("blur", function () {
                    $this = $(this);
                    var b = {
                        "quotationVersion.versionId": $this.val()
                    };
                    com.post(api.quotation.queryQuotationVersionByVersionId, b, function (a) {
                        a.quotationVersion && a.quotationVersion.qvId ? (com.showTips($this, "该版本编号已存在", true), companyConfig.quotationVersion.repeatFlg = true) : (com.clearValidator("#versionId", true), companyConfig.quotationVersion.repeatFlg = false)
                    })
                }),
                versionName: com.focusPage("#versionName"),
                trafficRate: com.focusPage("#trafficRate"),
                trafficDiscount : com.focusPage("#trafficDiscount").switchBtn("discount-lbl").on("click", function(a) {
                    companyConfig.quotationVersion.items.trafficDiscount.value = 0 == companyConfig.quotationVersion.items.trafficDiscount.value ? 1 : 0
                }),
                manageRate: com.focusPage("#manageRate"),
                manageDiscount : com.focusPage("#manageDiscount").switchBtn("discount-lbl").on("click", function(a) {
                    companyConfig.quotationVersion.items.manageDiscount.value = 0 == companyConfig.quotationVersion.items.manageDiscount.value ? 1 : 0
                }),
                versionDes: com.focusPage("#versionDes"),
                defaultFlag : com.focusPage("#defaultFlag").switchBtn().on("click", function(a) {
                    companyConfig.quotationVersion.items.defaultFlag.value = 0 == companyConfig.quotationVersion.items.defaultFlag.value ? 1 : 0
                })
            },
            validator: {
                roleId: {
                    type: "v_versionId",
                    regex: /^QV_\d{3}$/,
                    errorMsg: "请输入QV_数字,如QV_001"
                }
            },
            repeatFlg: false,
            editFlag: false
        },
        /* 3. */
        paymentScale: {
            saveBtn: com.focusPage("#savePaymentScale").on("click", savePaymentScale),
            cancelBtn: null,
            items: {
                cid : params.company.cid,
                names: com.focusPage("#names"),
                comment: com.focusPage("#comment")
            },
            list:[],
            psid:null
        },
        /* 5. */
        drawLine: {
            addmodal : com.focusPage("#drawLineModal"),
            groupadd : {
                drawLineGroup: com.focusPage("#drawLineGroup"),
                contentadd: com.focusPage("#contentadd"),
                gid: com.focusPage("#drawLineGroup").parent()
            },
            cancelBtn :com.focusPage("#cancelDrawLineBtn"),
            savebtn : com.focusPage("#saveDrawLineBtn").on("click", saveDrawLine),
            editFlg : false,
            validator: {
                drawlingroup: {
                    type: "v_drawlingroup",
                    regex: /^([\u4e00-\u9fa5][\u4e00-\u9fa5][\u653e][\u7ebf][\u5c0f][\u7ec4])|([\u653e][\u7ebf][\u4e00|\u4e8c|\u4e09|\u56db|\u4e94|\u516d|\u4e03|\u516b|\u4e5d|\u5341]{1,2}[\u7ec4])$/,
                    errorMsg: "放线小组不能重复且为中文 例 放线x组,放线x-xx组"
                }
            }
        },
        /* 6. */
        receiptType: {
            saveBtn: com.focusPage("#saveReceiptTypeBtn").on("click", saveReceiptType),
            cancelBtn: null,
            modal: com.focusPage("#receiptTypeModal"),
            items: {
                rtId: com.focusPage("#rtId"),
                name: com.focusPage("#name"),
                no: com.focusPage("#no")
            },
            editFlg: false
        }
    };

    $.extend(com.validator, companyConfig.quotationVersion.validator);
    $.extend(com.validator, companyConfig.drawLine.validator);

    var displayFunc = (function () {

        var renderTable = function (aimsId, title, listData, typeArr) {
            var $tableWrap = com.focusPage('#' + aimsId);
            var $table = $('<table class="table table-striped table-bordered table-hover"></table>');

            var $thead = $('<thead></thead>').appendTo($table);
            var $trTitle = $('<tr></tr>').appendTo($thead);
            $.each(title,function (i, v) {
                var thTitle = $('<th>'+ v +'</th>').appendTo($trTitle);
            });

            var $tbody = $('<tbody></tbody>').appendTo($table);

            if(listData && listData.length) {
                $.each(listData, function (a, o) {
                   var $tdLine = createTable(o, typeArr);

                    $tdLine.appendTo($tbody);
                });

                $table.appendTo($tableWrap);
            }
        };

        var createTable = function(data, typeArr) {

            var propertyArr;
            switch (typeArr) {

                case 'quotationVersion':
                    propertyArr = [
                        [data.no],
                        [data.trafficRate],
                        [data.trafficDiscount == 0 ? '不打折' : data.trafficDiscount == 1 ? '打折' : '-'],
                        [data.manageRate],
                        [data.manageDiscount == 0 ? '不打折' : data.manageDiscount == 1 ? '打折' : '-'],
                        [data.versionDes ? data.versionDes : '-'],
                        [data.defaultFlag == 0 ? '否' : data.defaultFlag == 1 ? '是' : '-']
                    ];
                    break;
                case 'paymentScale':
                    propertyArr = [
                        [data.name],
                        [data.comment]
                    ];
                    break;
                case 'constructionNode':
                    propertyArr = [
                        [params.company.name], // 公司名称为当前公司
                        [data.name]
                    ];
                    break;
                case 'drawlineGroup':
                    propertyArr = [
                        [data.name]
                    ];
                    break;
                case 'receiptType':
                    switch (data.type){
                        case 1: data.type = "现金"; break;
                        case 2: data.type = "银行"; break;
                        case 3: data.type = "转账"; break;
                        case 4: data.type = "对公账户";break;
                        case 5: data.type = "券";break;
                    }
                    propertyArr = [
                        [data.name],
                        [data.no],
                        [data.type],
                        [data.status == 1 ? "启用" : "禁用"]
                    ];
                    break;
                case 'systemConfig':
                    propertyArr = [
                        [data.comment],
                        [data.value],
                        [data.createName],
                        [data.createTime],
                    ];
                    break;
            }

            var $trCont = $('<tr></tr>');
            $.each(propertyArr, function (index,value) {
                var $tdCont = $('<td></td>').html(value[0]).appendTo($trCont);
            });

            return $trCont;
        };

        return {
            init : function (aimsId, title, listData, typeArr) {
                com.focusPage('#' + aimsId).html(null);
                renderTable(aimsId, title, listData, typeArr);
            },
            drawLine : function (v) {
                return createTable(v);
            }
        }

    })();

    var quotationSearcher = new Searcher();
    quotationSearcher.init(null, null, api.quotation.pageQuotationVersion, function (data) {
        displayFunc.init('quotationVersion', ["编号","车运费比例","车运费折扣","管理费比例","管理费折扣","信息","默认版本"], data, 'quotationVersion');
    }, "quotationPagenation");

    var drawLineSearcher = new Searcher();
    drawLineSearcher.init(null, null, api.data.pageDrawlineGroup, function(data){
        displayFunc.init('drawlineGroup', ["名称"], data, 'drawlineGroup');
    }, "drawlineGroupPagenation");

    var receiptTypeSearcher = new Searcher();
    receiptTypeSearcher.init(null, null, api.data.pageReceiptType, function (data) {
        displayFunc.init('receiptType', ["名称","键值","类型","状态"], data, 'receiptType');
    }, "receiptTypePagenation");
    
    com.post(api.system.querySystemConfigByCid, {}, function (data) {
        displayFunc.init("systemConfig", ["说明","信息","创建人","创建时间"], data.systemConfigVOs,  "systemConfig");
    }, null, false);

    showPaymentScale();

    function showPaymentScale() {
        com.post(api.data.queryPaymentScale, {}, function (v) {
            displayFunc.init("paymentScale", ["款型名称","说明"], v.paymentScales,  "paymentScale");
        }, null, false);
    }

    com.post(api.data.queryConstructionNode, {}, function(res){
        displayFunc.init("constructionNode", ["公司名称","节点名称"], res.constructionNodes,  "constructionNode");
    }, null, false);


    com.focusPage('#addQuotationVersion').click(function(){
        companyConfig.quotationVersion.editFlag = false;
        com.cleanItems(companyConfig.quotationVersion.items);
        companyConfig.quotationVersion.items.versionId.prop("disabled", false);
        companyConfig.quotationVersion.modal.modal("show")
    });
    com.focusPage('#addPaymentScale').click(function(){
        com.cleanItems(companyConfig.paymentScale.items);
        com.focusPage("#paymentScaleModal").modal("show");
    });
    com.focusPage('#addLineGroup').click(function(){
        companyConfig.drawLine.editFlg = true;
        com.cleanItems(companyConfig.drawLine.groupadd);
        companyConfig.drawLine.addmodal.modal("show");
        popoverInitDrawLine();
    });
    com.focusPage('#addReceiptType').click(function(){
        com.cleanItems(companyConfig.receiptType.items);
        companyConfig.receiptType.editFlg = true;
        companyConfig.receiptType.modal.modal("show")
    });

    // 1.
    function saveQuotation() {
        com.clearValidator();
        com.clearValidator("#versionId", true);
        if (!com.validate("quotationVersionModal") && !companyConfig.quotationVersion.repeatFlg) {
            var options = {
                "quotationVersion.no": companyConfig.quotationVersion.items.versionId.val(),
                "quotationVersion.name": companyConfig.quotationVersion.items.versionName.val(),
                "quotationVersion.trafficRate": companyConfig.quotationVersion.items.trafficRate.val(),
                "quotationVersion.trafficDiscount": companyConfig.quotationVersion.items.trafficDiscount.prop("checked") ? 1 : 0,
                "quotationVersion.manageRate": companyConfig.quotationVersion.items.manageRate.val(),
                "quotationVersion.manageDiscount": companyConfig.quotationVersion.items.manageDiscount.prop("checked") ? 1 : 0,
                "quotationVersion.defaultFlag": companyConfig.quotationVersion.items.defaultFlag.prop("checked") ? 1 : 0,
                "quotationVersion.versionDes": companyConfig.quotationVersion.items.versionDes.val()
            };
            com.post(companyConfig.quotationVersion.editFlag ? api.quotation.updateQuotationVersion: api.quotation.addQuotationVersion, options, successCallbackQuotationVersion);
            companyConfig.quotationVersion.modal.modal("hide")
        }
    }
    function successCallbackQuotationVersion() {
        com.showAlert(com.info, "操作成功");
        quotationSearcher.doSearch();
    }
    // 3.
    function savePaymentScale() {
        if (!com.validate("paymentScaleModal")) {
            com.post(api.data.addPaymentScale, {
                "paymentScale.cid": companyConfig.paymentScale.items.cid,
                "paymentScale.name": companyConfig.paymentScale.items.names.val(),
                "paymentScale.comment": companyConfig.paymentScale.items.comment.val()
            }, function () {
                com.showAlert(com.info, "操作成功");
                showPaymentScale();
            });
            com.focusPage("#paymentScaleModal").modal("hide");
        }
    }
    // 5.
    function saveDrawLine(){
        if( !com.validate("drawLineModal")) {
            var url;
            var options = {
                "drawLineGroup.gid" : companyConfig.drawLine.groupadd.gid.val(),
                "drawLineGroup.name": companyConfig.drawLine.groupadd.drawLineGroup.val(),
                "drawLineGroup.content": companyConfig.drawLine.groupadd.contentadd.val()
            };
            if(companyConfig.drawLine.editFlg){
                url = api.data.addDrawlineGroup;
            }else{
                url = api.data.updateDrawlineGroup;
            }

            com.post(url, options, function (res) {
                // 刷新页面所有条件,点击保存之后 刷新页面条件 重新载入
                com.showAlert(com.info, "操作成功");
                drawLineSearcher.doSearch();
            },function(){
                com.showAlert(com.error, "放线小组已存在");
            });
            // 隐藏动态框
            companyConfig.drawLine.addmodal.modal("hide");
        }

    }
    function popoverInitDrawLine(){
        com.focusPage("[data-toggle='popover']").popover({
            html : true,
            trigger:'blur'
        });
        com.focusPage('#drawLineGroup').css('border-color', '');
    }
    // 6.
    function saveReceiptType() {
        var options = {
            "receiptType.name" : com.focusPage("#name").val(),
            "receiptType.no" : com.focusPage("#no").val(),
            "receiptType.type" : com.focusPage("#type").val()
        };
        if(com.validate("receiptTypeModal")){
            return;
        }
        if(companyConfig.receiptType.editFlg){
            com.post(api.data.addReceiptType,options,function () {
                receiptTypeSearcher.doSearch();
                com.showAlert(com.info, "添加成功");
                companyConfig.receiptType.modal.modal("hide")
            })
        }else{
            options["receiptType.rtId"] = companyConfig.receiptType.items.rtId.val();
            com.post(api.data.updateReceiptType,options,function () {
                receiptTypeSearcher.doSearch();
                com.showAlert(com.info, "修改成功");
                companyConfig.receiptType.modal.modal("hide")
            })

        }

    }


    // 生成模态框
    function showModal(modal, cont, btn) {
        var $modal = $('<div class="modal fade" id="'+ modal[0] +'" tabindex="-1"></div>').appendTo(com.focusPage("#companyConfig")); // 模态框id

        var $modalDialog = $('<div class="modal-dialog"></div>').appendTo($modal);

        var $modalContent = $('<div class="modal-content"></div>').appendTo($modalDialog);

        var $modalHeader = $('<div class="modal-header"></div>').appendTo($modalContent);
        var $headerBtn = $('<button type="button" class="close" data-dismiss="modal"><span>×</span><span class="sr-only">Close</span></button>').appendTo($modalHeader);
        var $headerTitle = $('<h4 class="modal-title" id="'+ modal[2] +'">'+ modal[1] +'</h4>').appendTo($modalHeader);

        var $modalBody = $('<div class="modal-body"></div>').appendTo($modalContent);
        var $form = $('<form class="form-horizontal"></form>').appendTo($modalBody);

        $.each(cont, function (i, v) {
            // form-group input
            var $formGroup = $('<div class="form-group"></div>').appendTo($form);
            var $label = $('<label class="col-sm-4 control-label no-padding-right" for="'+ v[0] +'">'+ v[1] +'</label>').appendTo($formGroup);
            var $col = $('<div class="col-sm-8"></div>').appendTo($formGroup);
            var $input;
            switch (v[3]){
                case 'text':
                    $input = $('<input type="text" id="'+ v[0] +'" data-toggle="popover" data-trigger="manual"/>').addClass(v[2]).appendTo($col);
                    break;
                case 'checkbox':
                    $input = $('<input type="checkbox" id="'+ v[0] +'" />').addClass(v[2]).appendTo($col);
                    $span = $('<span class="lbl"></span>').appendTo($col);
                    break;
                case 'textarea':
                    $input = $('<textarea id="'+ v[0] +'" data-toggle="popover" data-trigger="manual" ></textarea>').addClass(v[2]).appendTo($col);
                    break;
                case 'select':
                    $input = $('<select id="'+ v[0] +'" data-toggle="popover" data-trigger="manual" ></select>').addClass(v[2]).appendTo($col);
                    var $option;
                    $.each(v[4], function (i, o) {
                        $option = $('<option value="'+ i +'">'+ o +'</option>').appendTo($input);
                    });
                    break;
            }

        });

        var $modalFooter = $('<div class="modal-footer"></div>').appendTo($modalContent);

        var $saveBtn = $('<button type="button" id="'+ btn[0] +'" class="btn btn-primary">保存</button>').appendTo($modalFooter);
        var $cancelBtn = $('<button type="button" id="'+ btn[1] +'" class="btn btn-default" data-dismiss="modal">取消</button>').appendTo($modalFooter);

    }
});
