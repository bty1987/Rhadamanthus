$(function(){

    var group = {
        bindSaveBtn: com.focusPage("#bindSaveBtn"),
        bindSaveOrderBtn: com.focusPage("#bindSaveOrderBtn"),
        modals:{
            updateOrderModal: com.focusPage("#updateOrderModal"),
            bindOrderModal: com.focusPage("#bindOrderModal")
        },
        items: {
            name: com.focusPage("#name"),
            content: com.focusPage("#content"),
            orderId: com.focusPage("#orderId")
        },
        gid: null,
        opengid: null
    };

    group.bindSaveBtn.bindClick(bindgroup);
    group.bindSaveOrderBtn.bindClick(bindgroupOrder);

    com.focusPage(".modal").on("hide.bs.modal",function () {
        com.cleanItems(group.items);
        com.clearValidator();
    });

    var lineprops = (function() {

        return [{
            field: "opengid",
            name: "群编号",
            prop: "opengid",
            clazz: "grey"
        }, {
            field: "orderId",
            name: "装修单号",
            prop: "orderId",
            clazz: "grey"
        }, {
            field: "content",
            name: "说明",
            prop: "content",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {

                    group.gid = v.gid;

                    group.items.name.val(v.name);
                    group.items.content.val(v.content);

                    group.modals.updateOrderModal.modal("show");
                }
            },
            bind: {
                name: "绑定",
                clazz: "btn-success",
                show: function(v) { return v.orderId == null; },
                handle: function(v) {

                    group.gid = v.gid;
                    group.opengid = v.opengid;

                    group.modals.bindOrderModal.modal("show");
                }
            },
            addUser: {
                name: "群成员",
                clazz: "btn-success",
                show: function(v) { return v.orderId != null; },
                handle: function(v) {

                    params.customer.orderId = v.orderId;
                    com.popup4page('#crowdUserPopUp', api.index.crowdUser.url, '群成员');
                }
            },
            unbind: {
                name: "解绑",
                clazz: "btn-warning",
                show: function(v) { return v.orderId != null; },
                handle: function(v) {

                    bindGrop(v.gid);
                }
            }
        };
    })();

    var searcher = new Searcher();
    searcher.set("condList", "pagenation", "resultList", api.customer.pageGroup, null, ['customer-group-name', 'customer-group-orderId'], null, null, false, null);
    searcher.line("name", lineprops, linebtns).render();

    function bindgroup (){
        
        if(com.validate('form')){
            return false;
        }

       var option = {
            "group.gid": group.gid,
            "group.name": group.items.name.val(),
            "group.content": group.items.content.val(),
        };

        com.post(api.customer.updateGroup, option, function(){
            searcher.doSearch();
            com.showAlert(com.info,'修改群信息成功');
            group.modals.updateOrderModal.modal("hide");
        });
    }

    function bindgroupOrder(){

        if(com.validate('orderIdCheck')){
            return false;
        }

        var option = {
            "group.opengid": group.opengid,
            "group.orderId": group.items.orderId.val(),
        };

        com.post(api.customer.bindGroup, option, function(){
            searcher.doSearch();
            com.showAlert(com.info,'绑定成功');
            group.modals.bindOrderModal.modal("hide");
        });
    }

    function  bindGrop(id){
        com.showConfirm("确定要解除绑定", function(){
            com.post(api.customer.unbindGroup, {"group.gid": id}, function (res) {
                searcher.doSearch();
                com.showAlert(com.info,'解除成功');
            });
        });
    }

})();