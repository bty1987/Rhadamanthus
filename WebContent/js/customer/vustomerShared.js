$(function(){

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerOriginPage.getConfig("vustomerShared");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var lineprops = (function() {

        var propertyMap = {
            "name": {
                field: "name",
                name: "客户名称",
                prop: "name",
                clazz: "grey"
            },
            "address": {
                field: "address",
                name: "客户地址",
                prop: "address",
                clazz: "grey"
            },
            "orderId": {
                field: "orderId",
                name: "装修单号",
                prop: "orderId",
                clazz: "grey"
            },
            "referrer": {
                field: "referrer",
                name: "推荐人",
                prop: "referrer",
                clazz: "grey"
            },
            "referphone": {
                field: "referphone",
                name: "推荐人电话",
                prop: "referphone",
                clazz: "blue"
            },
            "createTime": {
                field: "createTime",
                name: "创建时间",
                prop: "createTime",
                clazz: "grey"
            },
            "contractPrice": {
                field: "contractPrice",
                name: "合同额",
                prop: "contractPrice",
                clazz: "blue"
            },
            "status": {
                field: "status",
                name: "状态",
                prop: function(v) { return constant.customer().vustomerShared.status.keys[v.status]; },
                clazz: "red"
            },
            "comment": {
                field: "comment",
                name: "说明",
                prop: "comment",
                clazz: "grey"
            }
        };

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    var linebtns = (function() {

        return {
            claim: {
                name: "认领",
                clazz: "btn-yellow",
                handle: function(v) {

                    btnclaim(v);
                },
                show: function() { return btnVisible("claim"); }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageVustomerForCommunion, null, pageConfig.condArr.length > 0 ? pageConfig.condArr : ["customer-v-name"], "vustomerSharedPostData", null, false, null);
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
