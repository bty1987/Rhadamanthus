jQuery(function($) {

    var morder = {

        items: {
            no: com.focusPage("#no"),
            user: com.focusPage("#user"),
            address: com.focusPage("#address"),
            total: com.focusPage("#total"),
            status: com.focusPage("#status"),
        },

        btns: {},

        status: [],
    };

    com.post(api.ds.store, {}, function(res) {

        morder.items.status.bindData(res.status, "key", "value");
        morder.status = res.status.split("key", "value");
    }, null, false);

    var lineprops = (function() {

        return [{
            field: "address.name",
            name: "用户",
            prop: function(v) { return JSON.parse(v.address).name; },
            clazz: "grey"
        }, {
            field: "address",
            name: "地址",
            prop: function(v) {
                var a = JSON.parse(v.address);
                return a.province + a.city + a.proper + a.address;
            },
            clazz: "grey"
        }, {
            field: "total",
            name: "总价",
            prop: "total",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "paymentTime",
            name: "支付时间",
            prop: "paymentTime",
            clazz: "green"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return morder.status[v.status]; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            deliver: {
                name: "发货",
                clazz: "btn-yellow",
                show: function(v) { return v.status == "1"; },
                handle: function(v) {
                    com.showConfirm("是否确认发货", function() {
                        updateStatus(v.oid, 2);
                    });
                }
            },
            collect: {
                name: "收货",
                clazz: "btn-yellow",
                show: function(v) { return v.status == "2"; },
                handle: function(v) {
                    com.showConfirm("是否确认收货", function() {
                        updateStatus(v.oid, 3);
                    });
                }
            },
            morderItem: {
                name: "订单项",
                clazz: "btn-success",
                handle: function(v) {
                    params.store.morder = v;
                    com.popup4page('#morderPopUp', "/views/store/morderitem.html", '订单项');
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.store.pageMorder, null, ['store-morder-no', "store-morder-status"], "Morder", null, false, null);
    searcher.line("no", lineprops, linebtns).render();

    function updateStatus(oid, status) {

        com.post(api.store.updateMorderForStatus, {
            "morder.oid": oid,
            "morder.status": status
        }, function(res) {

            searcher.doSearch();
        })
    }

});
