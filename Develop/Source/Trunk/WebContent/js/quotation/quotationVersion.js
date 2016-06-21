$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
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
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.versionName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html('编辑');
            var $btnCopy = $('<a></a>').addClass('btn btn-minier btn-success').html('复制报价');

            var propertyArr = [
                ["编号:", v.versionId, "grey"],
                ["信息:", v.versionDes ? v.versionDes : '--', "grey"],
                ["默认版本:", v.defaultFlag == 0 ? '否' : v.defaultFlag == 1 ?  '是' : '--', "red"],
            ];


            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).append($btnCopy).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
                editLine(v);
            });

            $btnCopy.click(function(){
                copyVersion(v.versionId);
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var _condArr = ['versionName'];

    var quotationVersionSeacher = new Searcher();
    quotationVersionSeacher.init( _condArr, "condList", api.quotation.pageQuotationVersion, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "quotationVersionPostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css('margin-top', '7px');
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
    });

    var quotationVersion = {
        saveBtn: $("#saveBtn").on("click", saveData),
        cancellBtn: $("#cancelBtn"),
        modal: $("#qtModal").on("show.bs.modal", function(a) {
            com.clearValidator();
            com.clearValidator("#versionId", !0)
        }),
        saveCopyVersionBtn : $("#saveCopyVersionBtn").on("click", saveCopyVersionData),
        cancelCopyVersionBtn : $("#cancelCopyVersionBtn"),
        modalCopyVersion : $("#copyVersionModal").on("show.bs.modal", function(a) {
            com.clearValidator();
            com.clearValidator("#copyVersionId", !0)
        }),
        quotationVersionItems: {
            copyVersionId: $("#copyVersionId").on("blur", function () {
                $this = $(this);
                var b = {
                    "quotationVersion.versionId": $this.val()
                };
                com.post(api.quotation.queryQuotationVersionByVersionId, b, function (a) {
                    a.quotationVersion && a.quotationVersion.qvId ? (com.showTips($this, "\u8be5\u7248\u672c\u7f16\u53f7\u5df2\u5b58\u5728", !0), quotationVersion.repeatFlg = !0) : (com.clearValidator("#copyVersionId", !0), quotationVersion.repeatFlg = !1)
                })
            }),
            copyVersionName: $("#copyVersionName"),
            copyVersionDes: $("#copyVersionDes"),
            versionId: $("#versionId").on("blur", function () {
                $this = $(this);
                var b = {
                    "quotationVersion.versionId": $this.val()
                };
                com.post(api.quotation.queryQuotationVersionByVersionId, b, function (a) {
                    a.quotationVersion && a.quotationVersion.qvId ? (com.showTips($this, "\u8be5\u7248\u672c\u7f16\u53f7\u5df2\u5b58\u5728", !0), quotationVersion.repeatFlg = !0) : (com.clearValidator("#versionId", !0), quotationVersion.repeatFlg = !1)
                })
            }),
            versionName: $("#versionName"),
            versionDes: $("#versionDes"),
            defaultFlag : $("#defaultFlag").switchBtn().on("click", function(a) {
                quotationVersion.quotationVersionItems.defaultFlag.value = 0 == quotationVersion.quotationVersionItems.defaultFlag.value ? 1 : 0
            })
        },
        validator: {
            roleId: {
                type: "v_versionId",
                regex: /^QV_\d{3}$/,
                errorMsg: "\u8bf7\u8f93\u5165QV_\u6570\u5b57,\u5982QV_001."
            }
        },
        repeatFlg: !1,
        editFlag: !1
    };

    $.extend(com.validator, quotationVersion.validator);

    $('a[name="addQuotationVersion"]','#pagenation').click(function(){
        quotationVersion.quotationVersionItems.versionId.css("display", "none");
        quotationVersion.editFlag = !1;
        com.cleanItems(quotationVersion.quotationVersionItems);
        quotationVersion.quotationVersionItems.versionId.prop("disabled", !1);
        quotationVersion.modal.modal("show")
    });

    function editLine(b){

        quotationVersion.editFlag = !0;
        quotationVersion.quotationVersionItems.versionId.val(b.versionId);
        quotationVersion.quotationVersionItems.versionName.val(b.versionName);
        quotationVersion.quotationVersionItems.versionDes.val(b.versionDes);
        quotationVersion.quotationVersionItems.versionId.prop("disabled", !0).css("display", "block");
        void 0 == quotationVersion.quotationVersionItems.defaultFlag.value ? 1 == b.defaultFlag && quotationVersion.quotationVersionItems.defaultFlag.click() : quotationVersion.quotationVersionItems.defaultFlag.value != b.defaultFlag && quotationVersion.quotationVersionItems.defaultFlag.click();
        quotationVersion.quotationVersionItems.defaultFlag.value = b.defaultFlag;
        quotationVersion.modal.modal("show");
    }

    function copyVersion(a){
        $("#copySourceVersionId").val(a);
        quotationVersion.modalCopyVersion.modal("show")
    }

    function saveData() {
        com.clearValidator();
        com.clearValidator("#versionId", !0);
        if (!com.validate("qtModal") && !quotationVersion.repeatFlg) {
            var a = {
                "quotationVersion.versionId": quotationVersion.quotationVersionItems.versionId.val(),
                "quotationVersion.versionName": quotationVersion.quotationVersionItems.versionName.val(),
                "quotationVersion.defaultFlag": quotationVersion.quotationVersionItems.defaultFlag.prop("checked") ? 1 : 0,
                "quotationVersion.versionDes": quotationVersion.quotationVersionItems.versionDes.val()
            };
            com.post(quotationVersion.editFlag ? api.quotation.updateQuotationVersion: api.quotation.addQuotationVersion, a, successCallback, failCallback);
            quotationVersion.modal.modal("hide")
        }
    }

    function saveCopyVersionData() {
        com.clearValidator();
        com.clearValidator("#copyVersionId", !0);
        if (!com.validate("copyVersionModal") && !quotationVersion.repeatFlg) {
            var a = quotationVersion.quotationVersionItems,
                a = {
                    versionId: $("#copySourceVersionId").val(),
                    "quotationVersion.versionId": a.copyVersionId.val(),
                    "quotationVersion.versionName": a.copyVersionName.val(),
                    "quotationVersion.defaultFlag": 0,
                    "quotationVersion.versionDes": a.copyVersionDes.val()
                };
            com.post(api.quotation.copyQuotationVersion, a, successCallback, failCallback);
            quotationVersion.modalCopyVersion.modal("hide")
        }
    }

    function successCallback() {
        com.showAlert(com.info, "\u64cd\u4f5c\u6210\u529f");
        $('#condList button.btn-search').click();

    }
    function failCallback() {}

});
