jQuery(function ($) {
	
    var brandContract = {

            btns: {
               
            },

            modals: {
            	addSupplierAddBrandModal: com.focusPage("#addSupplierAddBrandModal"),

            },

            items: {
            	ctype: com.focusPage("#ctype", "#addSupplierAddBrandModal"),
            	cvalue: com.focusPage("#cvalue", "#addSupplierAddBrandModal"),
            	breakpay: com.focusPage("#breakpay", "#addSupplierAddBrandModal"),
                brandName: com.focusPage("#brandName", "#addSupplierAddBrandModal"),

            },
            bid: null,
            ucid:params.ucid,
            scid:params.scid,
            
        };
    
    
   var conditions = [];
    
    var searcher = new Searcher();
    
    searcher.base("condList", "pagenation", "resultList", api.personel.pageSupplierContractBrand);
    searcher.condition(conditions);
    searcher.history("refundsPostData");
    searcher.param({
        "supplierContractBrand.scid": brandContract.scid
    });
    searcher.button([{
        id: "addBrandInfo",
        name: "添加",
        clazz: "btn btn-minier btn-primary pull-left",
        icon: "icon-plus bigger-110"
    }])

    var lineprops = [{
        field: "ctype",
        name: "结算类型",
        prop: "ctype",
        clazz: "grey",
        dataset: constant.sales().refunds.type.keys,
    }, {
        field: "cvalue",
        name: "结算值ֵ",
        prop: "cvalue",
        clazz: "red",
    }, {
        field: "breakpay",
        name: "违约金",
        prop: "breakpay",
        clazz: "red",
    }];
    var linebtns = [ {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            delBrand(v.scbid);

        },
    }];

    searcher.line("brand.name", lineprops, linebtns).render();
    
    

    
    brandContract.modals.addSupplierAddBrandModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanTypeahead('brandName');
        com.closeTip();
        com.cleanItems(brandContract.items);
    });

    
    com.focusPage('#addBrandInfo', '#pagenation').on("click", function() {

    	brandContract.modals.addSupplierAddBrandModal.modal("show");
    });
    
    com.initTypeahead('brandName', api.data.queryBrandByPinyin, "brand.pinyin", {
        "brand.atttype": 0
    }, 'brands', 'bid', 'name', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.bid == k) {
            	//console.log(val.name);
            	brandContract.bid = val.bid;
            	brandContract.items.brandName.val(val.name);
            }
        });
        return v
    });
    
    com.focusPage("#ctype").bindData(constant.personel().supplierContractBrand.ctype.datas, "key", "value");

    
    
    com.focusPage('#submitBtn').on("click", function() {

        console.log(brandContract.bid);
        console.log(brandContract.items.ctype.val());
        
        var options = {
        		"supplierContractBrand.scid":brandContract.scid,
        		"supplierContractBrand.ctype": brandContract.items.ctype.val(),
        		"supplierContractBrand.cvalue": brandContract.items.cvalue.val(),
        		"supplierContractBrand.breakpay": brandContract.items.breakpay.val(),
        		"supplierContractBrand.brand.bid": brandContract.bid,
            };
        
       com.post(api.personel.addSupplierContractBrand, options, function(res){  
    	   brandContract.modals.addSupplierAddBrandModal.modal("hide");
    	   com.closePopup();
       });
       
       

    });
    
    function delBrand(scbid) {

        var options = {
            "supplierContractBrand.scbid": scbid
        };
        com.post(api.personel.deleteSupplierContractBrand, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });

    }
    
});