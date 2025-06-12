jQuery(function ($) {
	
    var goodsContract = {

            btns: {
               
            },

            modals: {
            	addSupplierAddBrandModal: com.focusPage("#addSupplierAddBrandModal"),

            },

            items: {
            	balance: com.focusPage("#balance", "#addSupplierAddBrandModal"),
            	price: com.focusPage("#price", "#addSupplierAddBrandModal"),
            	goodsName: com.focusPage("#goodsName", "#addSupplierAddBrandModal"),

            },
            gid: null,
            ucid:params.ucid,
            scid:params.scid,
            
        };
    
    
   var conditions = [];
    
    var searcher = new Searcher();
    
    searcher.base("condList", "pagenation", "resultList", api.personel.pageSupplierContractGoods);
    searcher.condition(conditions);
    searcher.history("refundsPostData");
    searcher.param({
        "supplierContractGoods.scid": goodsContract.scid
    });
    searcher.button([{
        id: "addGoodsInfo",
        name: "添加",
        clazz: "btn btn-minier btn-primary pull-left",
        icon: "icon-plus bigger-110"
    }])

    var lineprops = [{
        field: "price",
        name: "价格",
        prop: "price",
        clazz: "grey",
    }, {
        field: "balance",
        name: "结算价",
        prop: "balance",
        clazz: "red",
    }];
    var linebtns = [ {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            delBrand(v.scgid);

        },
    }];

    searcher.line("goods.name", lineprops, linebtns).render();
    
    goodsContract.modals.addSupplierAddBrandModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanTypeahead('goodsName');
        com.closeTip();
        com.cleanItems(goodsContract.items);
    });
    
    com.focusPage('#addGoodsInfo', '#pagenation').on("click", function() {

    	goodsContract.modals.addSupplierAddBrandModal.modal("show");
    });
    // api.data.queryGoodsByPinyin api.communion.queryGoodsPoolByName
    com.initTypeahead('goodsName', api.communion.queryGoodsPoolByName, "goodsPool.name", {
        "goodsPool.status": 0
    }, 'goodsPools', 'gpid', 'name', function(list, k, v) {

        $.each(list, function(index, val) {
            if (val.gpid == k) {
            	goodsContract.gid = val.gpid;
            	goodsContract.items.goodsName.val(val.name);
            }
        });
        return v
    });
    
    com.focusPage('#submitBtn').on("click", function() {
        var options = {
        		"supplierContractGoods.scid":goodsContract.scid,
        		"supplierContractGoods.price": goodsContract.items.price.val(),
        		"supplierContractGoods.balance": goodsContract.items.balance.val(),
        		"supplierContractGoods.goods.gid": com.typeahead("goodsName"),
            };
        
       com.post(api.personel.addSupplierContractGoods, options, function(res){  
    	   goodsContract.modals.addSupplierAddBrandModal.modal("hide");
    	   com.closePopup();
       });
           
    });
    
    function delBrand(scgid) {

        var options = {
            "supplierContractGoods.scgid": scgid
        };
        com.post(api.personel.deleteSupplierContractGoods, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });

    }
    
});