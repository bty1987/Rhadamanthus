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

    function buildVustomerAdvanceLineprops() {

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
            field: "belonger.userName",
            name: "归属人",
            prop: "belonger.userName",
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
            prop: function(v) { return constant.customer().vustomerAdvance.status.keys[v.status]; },
            clazz: "red"
        }, {
            field: "comment",
            name: "说明",
            prop: "comment",
            clazz: "grey"
        }];
    }

    function buildVustomerAdvanceLinebtns() {

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
                }
            },
            record: {
                name: "记录",
                clazz: "btn-success",
                handle: function(v) {

                    params.customer.vid = v.vid;
                    com.popup4page("#vscoreRecordPopUp", api.index.vrecord.url, "记录");
                }
            },
            score: {
                name: "积分",
                clazz: "btn-warning",
                handle: function(v) {

                    params.customer.unionId = v.unionId;
                    params.customer.id = 1;
                    com.popup4page("#vscoreRecordPopUp", api.index.vscoreRecord.url, "积分");
                }
            },
            belonger: {
                name: "归属",
                clazz: "btn-inverse",
                handle: function(v) {

                    vustomer.vid = v.vid;
                    vustomer.modals.belongerModal.modal("show");
                    com.updateTypeahead("belonger", v.belonger.uid, com.checkNull(v.belonger.userName, ''));
                }
            }
        };
    }

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.customer.pageVustomerForAdvance, null, ["customer-v-name"], "vustomerPostData", null, false, null);
    searcher.line("phone", buildVustomerAdvanceLineprops(), buildVustomerAdvanceLinebtns()).render();

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
