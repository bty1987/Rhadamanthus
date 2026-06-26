$(function () {

    function buildEmemberLineprops() {

        return [{
            field: "unionId",
            name: "微信号",
            prop: "unionId",
            clazz: "grey"
        }, {
            field: "no",
            name: "会员编号",
            prop: "no",
            clazz: "grey"
        }, {
            field: "name",
            name: "姓名",
            prop: "name",
            clazz: "grey"
        }, {
            field: "address",
            name: "地址",
            prop: "address",
            clazz: "grey"
        }, {
            field: "ticket",
            name: "票号",
            prop: "ticket",
            clazz: "grey"
        }, {
            field: "registerTime",
            name: "注册时间",
            prop: "registerTime",
            clazz: "green"
        }];
    }

    function buildEmemberLinebtns() {

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
                }
            }
        };
    }

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.customer.pageEmember, null, ["customer-member-no","customer-member-phone"], "ememeberPostData", null, false, null);
    searcher.line(function(v) { return v.name + " " + v.phone; }, buildEmemberLineprops(), buildEmemberLinebtns()).render();
});
