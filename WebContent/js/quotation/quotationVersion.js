$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ,用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');


            var propertyArr = [
                ["编号:", v.no, "blue"],
                ["车运费比例:", v.trafficRate, "blue"],
                ["车运费折扣:", v.trafficDiscount == 0 ? '不打折' : v.trafficDiscount == 1 ?  '打折' : '-', "red"],
                ["管理费比例:", v.manageRate, "blue"],
                ["管理费比例:", v.manageDiscount == 0 ? '不打折' : v.manageDiscount == 1 ?  '打折' : '-', "red"],
                ["信息:", v.comment ? v.comment : '-', "grey"],
                ["默认版本:", v.defaultFlag == 0 ? '否' : v.defaultFlag == 1 ?  '是' : '-', "red"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
                editLine(v);
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    var _condArr = ['versionName'];

    var searcher = new Searcher();
    searcher.init( _condArr, "condList", api.quotation.pageQuotationVersion, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "quotationVersionPostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addQuotationVersion').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
    });

    var quotationVersion = {
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        cancellBtn: com.focusPage("#cancelBtn"),
        modal: com.focusPage("#qtModal").on("show.bs.modal", function(a) {
            com.clearValidator();
            com.clearValidator("#no", true);
        }),

        cancelCopyVersionBtn : com.focusPage("#cancelCopyVersionBtn"),
        modalCopyVersion : com.focusPage("#copyVersionModal").on("show.bs.modal", function(a) {
            com.clearValidator();
            com.clearValidator("#copyNo", true);
        }),
        quotationVersionItems: {
            copyNo: com.focusPage("#copyNo").on("blur", function () {
                $this = com.focusPage(this);
                var b = {
                    "quotationVersion.no": $this.val()
                };
                com.post(api.quotation.queryQuotationVersionByVersionId, b, function (a) {
                    a.quotationVersion && a.quotationVersion.qvId ? (com.showTips($this, "该版本编号已存在", true), quotationVersion.repeatFlg = true) : (com.clearValidator("#copyNo", true), quotationVersion.repeatFlg = false);
                });
            }),
            copyName: com.focusPage("#copyName"),
            copyTrafficRate: com.focusPage("#copyTrafficRate"),
            copyManageRate: com.focusPage("#copyManageRate"),
            copyComment: com.focusPage("#copyComment"),
            no: com.focusPage("#no").on("blur", function () {
                $this = $(this);
                var b = {
                    "quotationVersion.no": $this.val()
                };
                com.post(api.quotation.queryQuotationVersionByVersionId, b, function (a) {
                    a.quotationVersion && a.quotationVersion.qvId ? (com.showTips($this, "该版本编号已存在", true), quotationVersion.repeatFlg = true) : (com.clearValidator("#no", true), quotationVersion.repeatFlg = false);
                });
            }),
            name: com.focusPage("#name"),
            trafficRate: com.focusPage("#trafficRate"),
            trafficDiscount : com.focusPage("#trafficDiscount").switchBtn("discount-lbl").on("click", function(a) {
                quotationVersion.quotationVersionItems.trafficDiscount.value = 0 == quotationVersion.quotationVersionItems.trafficDiscount.value ? 1 : 0;
            }),
            manageRate: com.focusPage("#manageRate"),
            manageDiscount : com.focusPage("#manageDiscount").switchBtn("discount-lbl").on("click", function(a) {
                quotationVersion.quotationVersionItems.manageDiscount.value = 0 == quotationVersion.quotationVersionItems.manageDiscount.value ? 1 : 0;
            }),
            comment: com.focusPage("#comment"),
            defaultFlag : com.focusPage("#defaultFlag").switchBtn().on("click", function(a) {
                quotationVersion.quotationVersionItems.defaultFlag.value = 0 == quotationVersion.quotationVersionItems.defaultFlag.value ? 1 : 0;
            })
        },
        validator: {
            roleId: {
                type: "v_versionId",
                regex: /^QV_\d{3}$/,
                errorMsg: "\u8bf7\u8f93\u5165QV_\u6570\u5b57,\u5982QV_001."
            }
        },
        repeatFlg: false,
        editFlag: false
    };

    $.extend(com.validator, quotationVersion.validator);

    com.focusPage('a[name="addQuotationVersion"]','#pagenation').click(function(){
        quotationVersion.quotationVersionItems.no.css("display", "none");
        quotationVersion.editFlag = false;
        com.cleanItems(quotationVersion.quotationVersionItems);
        quotationVersion.quotationVersionItems.no.prop("disabled", false);
        quotationVersion.modal.modal("show");
    });

    function editLine(b){

        quotationVersion.editFlag = true;
        quotationVersion.quotationVersionItems.no.val(b.no);
        quotationVersion.quotationVersionItems.trafficRate.val(b.trafficRate);
        quotationVersion.quotationVersionItems.manageRate.val(b.manageRate);
        quotationVersion.quotationVersionItems.name.val(b.name);
        quotationVersion.quotationVersionItems.comment.val(b.comment);
        quotationVersion.quotationVersionItems.no.prop("disabled", true).css("display", "block");
        
        void 0 == quotationVersion.quotationVersionItems.trafficDiscount.value ? 1 == b.trafficDiscount && quotationVersion.quotationVersionItems.trafficDiscount.click() : quotationVersion.quotationVersionItems.trafficDiscount.value != b.trafficDiscount && quotationVersion.quotationVersionItems.trafficDiscount.click();
        quotationVersion.quotationVersionItems.trafficDiscount.value = b.trafficDiscount;
        
        void 0 == quotationVersion.quotationVersionItems.manageDiscount.value ? 1 == b.manageDiscount && quotationVersion.quotationVersionItems.manageDiscount.click() : quotationVersion.quotationVersionItems.manageDiscount.value != b.manageDiscount && quotationVersion.quotationVersionItems.manageDiscount.click();
        quotationVersion.quotationVersionItems.manageDiscount.value = b.manageDiscount;
        
        void 0 == quotationVersion.quotationVersionItems.defaultFlag.value ? 1 == b.defaultFlag && quotationVersion.quotationVersionItems.defaultFlag.click() : quotationVersion.quotationVersionItems.defaultFlag.value != b.defaultFlag && quotationVersion.quotationVersionItems.defaultFlag.click();
        quotationVersion.quotationVersionItems.defaultFlag.value = b.defaultFlag;
        
        quotationVersion.modal.modal("show");
    }



    function saveData() {
        com.clearValidator();
        com.clearValidator("#no", true);
        if (!com.validate("qtModal") && !quotationVersion.repeatFlg) {
            var options = {
                "quotationVersion.no": quotationVersion.quotationVersionItems.no.val(),
                "quotationVersion.name": quotationVersion.quotationVersionItems.name.val(),
                "quotationVersion.trafficRate": quotationVersion.quotationVersionItems.trafficRate.val(),
                "quotationVersion.trafficDiscount": quotationVersion.quotationVersionItems.trafficDiscount.prop("checked") ? 1 : 0,
                "quotationVersion.manageRate": quotationVersion.quotationVersionItems.manageRate.val(),
                "quotationVersion.manageDiscount": quotationVersion.quotationVersionItems.manageDiscount.prop("checked") ? 1 : 0,
                "quotationVersion.defaultFlag": quotationVersion.quotationVersionItems.defaultFlag.prop("checked") ? 1 : 0,
                "quotationVersion.comment": quotationVersion.quotationVersionItems.comment.val()
            };
            com.post(quotationVersion.editFlag ? api.quotation.updateQuotationVersion: api.quotation.addQuotationVersion, options, successCallback);
            quotationVersion.modal.modal("hide");
        }
    }



    function successCallback() {
        com.showAlert(com.info, "操作成功");
        searcher.doSearch();
    }
    
});
