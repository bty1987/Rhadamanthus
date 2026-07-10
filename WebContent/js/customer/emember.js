$(function () {

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("emember");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var lineprops = (function() {

        var propertyMap = {
            "unionId": {
                field: "unionId",
                name: "微信号",
                prop: "unionId",
                clazz: "grey"
            },
            "no": {
                field: "no",
                name: "会员编号",
                prop: "no",
                clazz: "grey"
            },
            "name": {
                field: "name",
                name: "姓名",
                prop: "name",
                clazz: "grey"
            },
            "address": {
                field: "address",
                name: "地址",
                prop: "address",
                clazz: "grey"
            },
            "ticket": {
                field: "ticket",
                name: "票号",
                prop: "ticket",
                clazz: "grey"
            },
            "registerTime": {
                field: "registerTime",
                name: "注册时间",
                prop: "registerTime",
                clazz: "green"
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
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {

                    com.showConfirm("确认要删除当前表单吗?", function(res) {

                        com.post(api.customer.deleteEmember, {"emember.emid": v.emid}, function(res){

                            searcher.doSearch();
                        });
                    });
                },
                show: function() { return btnVisible("del"); }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageEmember, null, pageConfig.condArr.length > 0 ? pageConfig.condArr : ["customer-member-no","customer-member-phone"], "ememeberPostData", null, false, null);
    searcher.line(function(v) { return v.name + " " + v.phone; }, lineprops, linebtns).render();
});
