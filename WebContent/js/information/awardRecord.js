
$(function(){

    var awardRecord = {
        type : {},
        subtype : {},
        onetype : {},

        awardRecordItems:{},
        editFlg: false,
        repeatFlg: false
    };

    com.post(api.ds.information, {}, function(res){

        awardRecord.type = res.StockType.split("key" ,"value");
        awardRecord.onetype = res.awardStockOneType.split("key" ,"value");
        awardRecord.subtype = res.awardRecordSubtype.split("key" ,"value");

    }, null, false);
    
    var searcher = new Searcher();
    
    searcher.base("condList", "pagenation", "resultList", api.information.pageAwardRecord);
    
    searcher.param({"awardRecord.awardStock.asid":""});
    
    searcher.condition(["information-awardRecord-orderId", "information-awardRecord-name", "information-awardRecord-type", "information-awardRecord-subtype", "information-awardRecord-onetype", "information-awardRecord-recordTime"]);
    
    var lineprops = [
        {"field": "index", "name": "", prop: "", type: "numbers", fixed: "left"},
        {"field": "asid", "name": "ID", prop: "awardStock.asId", hide: true},
        {"field": "name", "name": "奖品", prop: "awardStock.name", width: 200, fixed: "left"},
        {"field": "orderId", "name": "装修单号", prop: "orderId", width: 200},
        {"field": "type", "name": "类型", prop: "type", dataset: awardRecord.type},
        {"field": "subtype", "name": "子类", prop: "subtype", dataset: awardRecord.subtype},
        {"field": "onetype", "name": "一类", prop: "onetype", dataset: awardRecord.onetype},
        {"field": "num", "name": "数量", prop: "num", style: "color: blue;"},
        {"field": "totalPrice", "name": "总价", prop: "totalPrice", style: "color: blue;"},
        {"field": "unitPrice", "name": "单价", prop: "unitPrice", style: "color: blue;"},
        {"field": "creater", "name": "提交人", prop: "creater.currentName"},
        {"field": "operateTime", "name": "时间", prop: "operateTime", width: 200, style: "color: green;"},
        {"field": "comment", "name": "说明", prop: "content", width: 300},
        {"field": "buttons", "name": "操作", prop: "1", width: 150, fixed: "right", toolbar: true},
    ];
    
    var linebtns = {
        "detail": {
            "name": "查看",
            "handle": function(data){
                com.showAlert(com.info, data.name);
            }
        }
    }
    
    searcher.table(lineprops, linebtns)
    
    searcher.render();

});


