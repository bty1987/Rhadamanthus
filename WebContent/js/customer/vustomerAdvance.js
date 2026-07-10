$(function(){

    var vustomer = {

        bindSaveBtn: com.focusPage("#bindSaveBtn"),
        vustomerSaveBtn: com.focusPage('#vustomerSaveBtn'),

        modals:{
            bindOrderModal: com.focusPage("#bindOrderModal"),
            belongerModal: com.focusPage("#belongerModal")
        },
        items:{
            belonger: com.focusPage("#belonger"),
            orderId: com.focusPage("#orderId"),
        },

        vid:null
    }

    vustomer.bindSaveBtn.bindClick(bindOrderData);
    vustomer.vustomerSaveBtn.bindClick(changeBelonger);

    com.focusPage(".modal").on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanTypeahead("belonger");
        com.cleanItems(vustomer.items);
    });


    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {"duty":"", "user.status":0}, "userBases", "uid", "currentName", null);

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("vustomerAdvance");

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
            "belonger": {
                field: "belonger.userName",
                name: "归属人",
                prop: "belonger.userName",
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
                prop: function(v) { return constant.customer().vustomerAdvance.status.keys[v.status]; },
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
            bind: {
                name: "绑定",
                clazz: "btn-yellow",
                handle: function(v) {

                    vustomer.vid = v.vid;
                    com.focusPage("#orderId").val("");

                    if (v.orderId != null) {
                        vustomer.items.orderId.val(v.orderId);
                        vustomer.items.orderId.attr('readonly', "readonly");
                    } else {
                        vustomer.items.orderId.removeAttr('readonly');
                    }

                    vustomer.modals.bindOrderModal.modal("show");

                    com.clearValidator();
                },
                show: function() { return btnVisible("bind"); }
            },
            record: {
                name: "记录",
                clazz: "btn-success",
                handle: function(v) {

                    params.customer.vid = v.vid;
                    com.popup4page("#vscoreRecordPopUp", api.index.vrecord.url, "记录");
                },
                show: function() { return btnVisible("record"); }
            },
            score: {
                name: "积分",
                clazz: "btn-warning",
                handle: function(v) {

                    params.customer.unionId = v.unionId;
                    params.customer.id = 1;
                    com.popup4page("#vscoreRecordPopUp", api.index.vscoreRecord.url, "积分");
                },
                show: function() { return btnVisible("score"); }
            },
            belonger: {
                name: "归属",
                clazz: "btn-inverse",
                handle: function(v) {

                    vustomer.vid = v.vid;
                    vustomer.modals.belongerModal.modal("show");
                    com.updateTypeahead("belonger", v.belonger.uid, com.checkNull(v.belonger.userName, ''));
                },
                show: function() { return btnVisible("belonger"); }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageVustomerForAdvance, null, pageConfig.condArr.length > 0 ? pageConfig.condArr : ["customer-v-name"], "vustomerPostData", null, false, null);
    searcher.line("phone", lineprops, linebtns).render();

    function changeBelonger(){
        if(com.validate('belongerModal')){
            return false;
        }

        var option={
            "vustomer.vid": vustomer.vid,
            "vustomer.belonger.uid":com.typeahead("belonger")
        };
        com.post(api.customer.updateVustomerForBelonger,option,function(){
            searcher.doSearch();
            com.showAlert(com.info,'修改成功');
        });
        vustomer.modals.belongerModal.modal("hide");
    }

    function bindOrderData(){
        if(com.validate('bindOrderModal')){
            return false;
        }

        var options = {
            'vustomer.vid': vustomer.vid,
            'vustomer.orderId': vustomer.items.orderId.val()
        };

        com.post(api.customer.updateVustomer, options, function(res){
            searcher.doSearch();
            com.showAlert(com.info,'绑定装修单号成功');
        });
        vustomer.modals.bindOrderModal.modal("hide");
    }

});
