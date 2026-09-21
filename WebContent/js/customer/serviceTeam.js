$(function(){

    var serviceTeam = {
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

    serviceTeam.bindSaveBtn.bindClick(bindgroup);
    serviceTeam.bindSaveOrderBtn.bindClick(bindgroupOrder);

    com.focusPage(".modal").on("hide.bs.modal",function () {
        com.cleanItems(serviceTeam.items);
        com.clearValidator();
    });

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("serviceTeam");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var lineprops = (function() {

        var propertyMap = {
            "opengid": {
                field: "opengid",
                name: "群编号",
                prop: "opengid",
                clazz: "grey"
            },
            "orderId": {
                field: "orderId",
                name: "装修单号",
                prop: "orderId",
                clazz: "grey"
            },
            "content": {
                field: "content",
                name: "说明",
                prop: "content",
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
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {

                    serviceTeam.gid = v.gid;

                    serviceTeam.items.name.val(v.name);
                    serviceTeam.items.content.val(v.content);

                    serviceTeam.modals.updateOrderModal.modal("show");
                },
                show: function() { return btnVisible("edit"); }
            },
            bind: {
                name: "绑定",
                clazz: "btn-success",
                show: function(v) { return btnVisible("bind") && v.orderId == null; },
                handle: function(v) {

                    serviceTeam.gid = v.gid;
                    serviceTeam.opengid = v.opengid;

                    serviceTeam.modals.bindOrderModal.modal("show");
                }
            },
            addUser: {
                name: "群成员",
                clazz: "btn-success",
                show: function(v) { return btnVisible("addUser") && v.orderId != null; },
                handle: function(v) {

                    params.customer.orderId = v.orderId;
                    com.popup4page('#serviceTeam4userPopUp', api.index.serviceTeam4user.url, '群成员');
                }
            },
            unbind: {
                name: "解绑",
                clazz: "btn-warning",
                show: function(v) { return btnVisible("unbind") && v.orderId != null; },
                handle: function(v) {

                    bindGrop(v.gid);
                }
            }
        };
    })();

    var searcher = new Searcher();
    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageGroup, null, pageConfig.condArr.length > 0 ? pageConfig.condArr : ['customer-serviceTeam-name', 'customer-serviceTeam-orderId'], null, null, false, null);
    searcher.line("name", lineprops, linebtns).render();

    function bindgroup (){
        
        if(com.validate('form')){
            return false;
        }

       var option = {
            "group.gid": serviceTeam.gid,
            "group.name": serviceTeam.items.name.val(),
            "group.content": serviceTeam.items.content.val(),
        };

        com.post(api.customer.updateGroup, option, function(){
            searcher.doSearch();
            com.showAlert(com.info,'修改群信息成功');
            serviceTeam.modals.updateOrderModal.modal("hide");
        });
    }

    function bindgroupOrder(){

        if(com.validate('orderIdCheck')){
            return false;
        }

        var option = {
            "group.opengid": serviceTeam.opengid,
            "group.orderId": serviceTeam.items.orderId.val(),
        };

        com.post(api.customer.bindGroup, option, function(){
            searcher.doSearch();
            com.showAlert(com.info,'绑定成功');
            serviceTeam.modals.bindOrderModal.modal("hide");
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