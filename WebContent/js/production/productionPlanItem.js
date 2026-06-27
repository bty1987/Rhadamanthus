$(function(){

    var productionPlanItem = {

        saveBtn: com.focusPage("#planItemSaveBtn"),
        cancelBtn : com.focusPage("#planItemCancelBtn"),

        modals: {
            productionPlanItemModal: com.focusPage("#productionPlanItemModal")
        },

        items: {
            name: com.focusPage("#itemName"),
            height: com.focusPage("#height"),
            width: com.focusPage("#width"),
            thick: com.focusPage("#thick"),
            num: com.focusPage("#itemNum"),
            color: com.focusPage("#color"),
            comment: com.focusPage("#comment"),
            measurementUnit: com.focusPage("#measurementUnit"),
            typeno: com.focusPage("#typeno"),
        },

        params: {
            ppid: params["productionPlan.ppid"],
            status: params["productionPlan.status"],
        },
        productionStatus: params.productionStatus
    };

    productionPlanItem.saveBtn.bindClick(saveData);

    productionPlanItem.modals.productionPlanItemModal.on("hide.bs.modal", function(){
        com.cleanItems(productionPlanItem.items);
        com.closeTip();
    });

    com.initTypeahead("#itemName",api.production.queryQuoteItemByPinyin, "quoteItem.pinyin","quoteItem.name", "quoteItems", "qiid", "name", function(list, k, v){

        $.each(list, function (index, val) {

            if (val.qiid == k) {
                productionPlanItem.items.measurementUnit.val(val.measurementunit);
                productionPlanItem.items.typeno.val(val.format);
                productionPlanItem.items.width.val(0);
                productionPlanItem.items.height.val(0);
                productionPlanItem.items.thick.val(0);
                productionPlanItem.items.num.val(1);
            }
        });
        return v;
    });

    var lineprops = (function() {

        return [{
            field: "typeno",
            name: "类型编号",
            prop: "typeno",
            clazz: "blue"
        }, {
            field: "height",
            name: "高",
            prop: "height",
            clazz: "blue"
        }, {
            field: "width",
            name: "宽",
            prop: "width",
            clazz: "blue"
        }, {
            field: "thick",
            name: "厚",
            prop: "thick",
            clazz: "blue"
        }, {
            field: "color",
            name: "颜色",
            prop: "color",
            clazz: "grey"
        }, {
            field: "num",
            name: "数量",
            prop: "num",
            clazz: "blue"
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            del: {
                name: "删除",
                clazz: "btn-danger",
                show: function(v) { return productionPlanItem.params.status == 0; },
                handle: function(v) {
                    com.showConfirm("确定删除吗?", function() {
                        com.post(api.production.deleteProductionPlanItem, { "productionPlanItem.ppiid": v.ppiid }, function() {
                            searcher.doSearch();
                            com.showAlert(com.info, "操作成功");
                        });
                    });
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addProductionPlanItem');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        hidBtn($adda, productionPlanItem.params.status);
        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set('condList', 'itemPagenation', 'itemResultList', api.production.pageProductionPlanItemByPpid, { "productionPlanItem.productionPlan.ppid": productionPlanItem.params.ppid }, [], "productionPlanItemPostData", null, false, buildProductionPlanItemButtons);
    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#addProductionPlanItem").click(function() {
        productionPlanItem.modals.productionPlanItemModal.modal("show");
    });

    function saveData() {

        if (com.validate('productionPlanItemModal')) {
            return false;
        }

        if (productionPlanItem.params.status != 0) {
            com.showAlert(com.warning, "计划单状态已完结不能添加子项");
            return false;
        }

        var option = {
            "productionPlanItem.productionPlan.ppid": productionPlanItem.params.ppid,
            "productionPlanItem.typeno": productionPlanItem.items.typeno.val(),
            "productionPlanItem.name": productionPlanItem.items.name.val(),
            "productionPlanItem.height": productionPlanItem.items.height.val(),
            "productionPlanItem.width": productionPlanItem.items.width.val(),
            "productionPlanItem.thick": productionPlanItem.items.thick.val(),
            "productionPlanItem.color": productionPlanItem.items.color.val(),
            "productionPlanItem.unitprice": 0,
            "productionPlanItem.num": productionPlanItem.items.num.val(),
            "productionPlanItem.total": 0,
            "productionPlanItem.comment": productionPlanItem.items.comment.val()
        }

        com.post(api.production.addProductionPlanItem,option,function () {
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        productionPlanItem.modals.productionPlanItemModal.modal("hide");
    }

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if (productionPlanItem.productionStatus == 3 || productionPlanItem.productionStatus == 4 ) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }
    }

});