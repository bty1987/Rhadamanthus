$(function(){

    var lineprops = (function() {

        return [{
            field: "name",
            name: "客户名称",
            prop: "name",
            clazz: "grey"
        }, {
            field: "address",
            name: "客户地址",
            prop: "address",
            clazz: "grey"
        }, {
            field: "orderId",
            name: "装修单号",
            prop: "orderId",
            clazz: "grey"
        }, {
            field: "referrer",
            name: "推荐人",
            prop: "referrer",
            clazz: "grey"
        }, {
            field: "referphone",
            name: "推荐人电话",
            prop: "referphone",
            clazz: "blue"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "grey"
        }, {
            field: "contractPrice",
            name: "合同额",
            prop: "contractPrice",
            clazz: "blue"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.customer().vustomerShared.status.keys[v.status]; },
            clazz: "red"
        }, {
            field: "comment",
            name: "说明",
            prop: "comment",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            claim: {
                name: "认领",
                clazz: "btn-yellow",
                handle: function(v) {

                    btnclaim(v);
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.customer.pageVustomerForCommunion, null, ["customer-v-name"], "vustomerSharedPostData", null, false, null);
    searcher.line("phone", lineprops, linebtns).render();

    function btnclaim(v) {
        com.showConfirm("是否确认领取客户", function(){
            com.post(api.customer.takeVustomer, {"vustomer.vid": v.vid}, function (res) {
                searcher.doSearch();
                com.showAlert(com.info,'领取成功');
            });
        });
    }

});
