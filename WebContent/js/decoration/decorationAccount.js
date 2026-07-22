$(function() {

    var decorationAccount = {
        modals: {
            accountItemModal: com.focusPage('#accountItemModal'),
            QRcodeModal: com.focusPage('#QRcodeModal')
        },
        items: {
            accountItemList: com.focusPage('#accountItemList'),
            QRcode: com.focusPage('#QRcode')
        },
        type: {
            0: "半包",
            1: "套餐",
            2: "半价"
        },
        arcal: {
            0: "计算配比",
            1: "不计算配比"
        },
        isAffirm: {
            0: "初始",
            1: "确认"
        },
        status: {
            0: "未通过",
            1: "通过",
            2: "不验证"
        },
        itemType: {
            0: "预签",
            1: "报价",
            2: "扩展",
            3: "合同",
            4: "主材",
            5: "外销",
            6: "增减",
            7: "预付款",
            8: "决算"
        }
    };

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.decoration.pageDecorationAccount);
    searcher.condition(["decoration-orderId", "decoration-village", "decoration-houseNumber", "decoration-designer", "decoration-salesman", "decoration-status", "decoration-accountTime", "decorationAccount-isAffirm", "decorationAccount-name"]);
    searcher.history("decorationAccountPostData");

    var lineprops = [{
        fieId: "decoration.orderId",
        name: "装修单号",
        prop: function(v) {
            return v.decoration ? v.decoration.orderId : v.orderId;
        },
        clazz: "blue"
    }, {
        fieId: "decoration.house.village.name",
        name: "楼盘",
        prop: function(v) {
            return v.decoration && v.decoration.house && v.decoration.house.village ? v.decoration.house.village.name : "";
        },
        clazz: "grey"
    }, {
        fieId: "decoration.house.houseNumber",
        name: "楼号",
        prop: function(v) {
            return v.decoration && v.decoration.house ? v.decoration.house.houseNumber : "";
        },
        clazz: "grey"
    }, {
        fieId: "decoration.customer.name",
        name: "客户",
        prop: function(v) {
            return v.decoration && v.decoration.customer ? v.decoration.customer.name : "";
        },
        clazz: "grey"
    }, {
        fieId: "decoration.designer.currentName",
        name: "设计师",
        prop: function(v) {
            return v.decoration && v.decoration.designer ? v.decoration.designer.currentName : "";
        },
        clazz: "grey"
    }, {
        fieId: "decoration.salesman.currentName",
        name: "业务员",
        prop: function(v) {
            return v.decoration && v.decoration.salesman ? v.decoration.salesman.currentName : "";
        },
        clazz: "grey"
    }, {
        fieId: "decoration.status",
        name: "订单状态",
        prop: function(v) {
            return v.decoration ? constant.decoration().decoration.status.keys[v.decoration.status] : "";
        },
        clazz: "red"
    }, {
        fieId: "decoration.accountTime",
        name: "决算时间",
        prop: function(v) {
            return v.decoration ? v.decoration.accountTime : "";
        },
        clazz: "green"
    }, {
        type: "newline"
    }, {
        fieId: "name",
        name: "决算名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "type",
        name: "类型",
        prop: function(v) {
            return decorationAccount.type[v.type] == null ? v.type : decorationAccount.type[v.type];
        },
        clazz: "grey"
    }, {
        fieId: "typeness",
        name: "决算类型",
        prop: function(v) {
            return constant.decoration().decoration.typeness.keys[v.typeness] == null ? v.typeness : constant.decoration().decoration.typeness.keys[v.typeness];
        },
        clazz: "grey"
    }, {
        fieId: "arcal",
        name: "增减配比",
        prop: function(v) {
            return decorationAccount.arcal[v.arcal] == null ? v.arcal : decorationAccount.arcal[v.arcal];
        },
        clazz: "grey"
    }, {
        fieId: "matching",
        name: "主材配比",
        prop: "matching",
        clazz: "blue"
    }, {
        fieId: "discount",
        name: "折扣",
        prop: "discount",
        clazz: "blue"
    }, {
        fieId: "discountBase",
        name: "折扣基数",
        prop: "discountBase",
        clazz: "blue"
    }, {
        fieId: "serviceRate",
        name: "服务费比例",
        prop: "serviceRate",
        clazz: "blue"
    }, {
        type: "newline"
    }, {
        fieId: "materialPrice",
        name: "决算主材额",
        prop: "materialPrice",
        clazz: "blue"
    }, {
        fieId: "servicePrice",
        name: "决算服务费",
        prop: "servicePrice",
        clazz: "blue"
    }, {
        fieId: "projectPrice",
        name: "工程总额",
        prop: "projectPrice",
        clazz: "blue"
    }, {
        fieId: "projectBase",
        name: "工程基数",
        prop: "projectBase",
        clazz: "blue"
    }, {
        fieId: "paidupMatching",
        name: "实花配比",
        prop: "paidupMatching",
        clazz: "blue"
    }, {
        fieId: "difference",
        name: "差额",
        prop: "difference",
        clazz: "blue"
    }, {
        fieId: "coupon",
        name: "优惠券",
        prop: "coupon",
        clazz: "blue"
    }, {
        fieId: "internal",
        name: "内部优惠券",
        prop: "internal",
        clazz: "blue"
    }, {
        fieId: "fulldel",
        name: "满送",
        prop: "fulldel",
        clazz: "blue"
    }, {
        fieId: "cashback",
        name: "返现",
        prop: "cashback",
        clazz: "blue"
    }, {
        type: "newline"
    }, {
        fieId: "isAffirm",
        name: "客户确认",
        prop: function(v) {
            return decorationAccount.isAffirm[v.isAffirm] == null ? v.isAffirm : decorationAccount.isAffirm[v.isAffirm];
        },
        clazz: "red"
    }, {
        fieId: "affirmTime",
        name: "确认时间",
        prop: "affirmTime",
        clazz: "green"
    }, {
        fieId: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }, {
        type: "newline"
    }, {
        fieId: "accountStatus.status",
        name: "决算指标",
        prop: function(v) {
            return statusName(v, "status");
        },
        clazz: "red"
    }, {
        fieId: "accountStatus.signStatus",
        name: "签约",
        prop: function(v) {
            return statusName(v, "signStatus");
        },
        clazz: "red"
    }, {
        fieId: "accountStatus.salesStatus",
        name: "销售完结",
        prop: function(v) {
            return statusName(v, "salesStatus") + unfinishText(v, "salesUnfinish");
        },
        clazz: "red"
    }, {
        fieId: "accountStatus.constructionStatus",
        name: "工程节点",
        prop: function(v) {
            var name = v.accountStatus && v.accountStatus.constructionName ? "(" + v.accountStatus.constructionName + ")" : "";
            return statusName(v, "constructionStatus") + name;
        },
        clazz: "red"
    }, {
        fieId: "accountStatus.selectionStatus",
        name: "选材完结",
        prop: function(v) {
            return statusName(v, "selectionStatus") + unfinishText(v, "selectionUnfinish");
        },
        clazz: "red"
    }, {
        fieId: "accountStatus.decorationPaymentStatus",
        name: "装修款比例",
        prop: function(v) {
            return statusName(v, "decorationPaymentStatus") + scaleText(v, "decorationPaymentScale", "decorationPaymentTarget");
        },
        clazz: "red"
    }, {
        fieId: "accountStatus.salesPaymentStatus",
        name: "销售比例",
        prop: function(v) {
            return statusName(v, "salesPaymentStatus") + scaleText(v, "salesPaymentScale", "salesPaymentTarget");
        },
        clazz: "red"
    }];

    var linebtns = [{
        name: "查看/编辑",
        clazz: "btn-info",
        handle: function(v) {

            viewDecorationAccount(v);

            return false;
        }
    }, {
        name: "明细",
        clazz: "btn-success",
        handle: function(v) {

            showDecorationAccountItems(v);

            return false;
        }
    }, {
        name: "推送",
        clazz: "btn-warning",
        handle: function(v) {

            com.showConfirm("确定要向客户推送决算信息吗?", function() {

                com.post(api.decoration.sendDecorationAccount, {
                    "decorationAccount.orderId": v.orderId
                }, function() {

                    com.showAlert(com.info, "操作成功");
                });
            });

            return false;
        }
    }, {
        name: "二维码",
        clazz: "btn-inverse",
        handle: function(v) {

            decorationAccount.items.QRcode.html("");
            decorationAccount.items.QRcode.qrcode({
                render: "canvas",
                width: 150,
                height: 150,
                text: " http://fanglin.vip/wx/account?orderId=" + v.orderId + "&daid=" + v.daid
            });
            decorationAccount.modals.QRcodeModal.modal('show');

            return false;
        }
    }];

    searcher.line("orderId", lineprops, linebtns).render();

    function statusName(v, field) {

        if (!v.accountStatus) return "";

        var status = v.accountStatus[field];

        return decorationAccount.status[status] == null ? status : decorationAccount.status[status];
    }

    function scaleText(v, scaleField, targetField) {

        if (!v.accountStatus) return "";

        return "(" + (v.accountStatus[scaleField] == null ? 0 : v.accountStatus[scaleField]) + "/" + (v.accountStatus[targetField] == null ? 0 : v.accountStatus[targetField]) + ")";
    }

    function unfinishText(v, field) {

        if (!v.accountStatus) return "";

        return "(" + (v.accountStatus[field] == null ? 0 : v.accountStatus[field]) + ")";
    }

    function viewDecorationAccount(v) {

        var decoration = v.decoration || {};
        var orderId = v.orderId || decoration.orderId;

        if (!params.quotation) params.quotation = {};
        if (!params.decoration) params.decoration = {};

        params.quotation.orderId = orderId;
        params.decoration.orderId = orderId;
        params.decoration.typeness = decoration.typeness;
        params.decoration.status = decoration.status;
        params.decoration.viewNode = typeof pageConfig != "undefined" && pageConfig.nodes ? Object.values(pageConfig.nodes) : [{
            type: "account",
            opt: {
                btn: ["accountPrint", "btnAccountPrint"]
            }
        }];
        params.historyPage = api.index.decorationAccountIndex.url;

        com.switchPage(api.index.decorationFinalSettlementIndex.url);
    }

    function showDecorationAccountItems(v) {

        decorationAccount.items.accountItemList.empty();

        com.post(api.decoration.queryDecorationAccountItem, {
            "decorationAccountItem.orderId": v.orderId
        }, function(res) {

            var items = res.decorationAccountItems;

            if (!items || items.length == 0) {
                decorationAccount.items.accountItemList.append($('<li></li>').addClass('item-orange clearfix').append($('<h3></h3>').addClass('oid').text('暂无明细')));
            } else {
                $.each(items, function(i, item) {
                    createAccountItemLine(item);
                });
            }

            decorationAccount.modals.accountItemModal.modal('show');
        });
    }

    function createAccountItemLine(item) {

        var $li = $('<li></li>').addClass('item-orange clearfix').appendTo(decorationAccount.items.accountItemList);
        var $h3 = $('<h3></h3>').addClass('oid').appendTo($li);
        var typeName = decorationAccount.itemType[item.type] == null ? item.type : decorationAccount.itemType[item.type];

        $('<small></small>').addClass('blue').html(typeName + ' - ' + item.name).appendTo($h3);

        var $ul = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($li);

        addProperty($ul, '金额', item.money);
        addProperty($ul, '比例', item.rate);
        addProperty($ul, '来源类型', item.sourceType);
        addProperty($ul, '来源ID', item.sourceId);
        addProperty($ul, '内容', item.content);
        addProperty($ul, '备注', item.comment);
    }

    function addProperty($ul, name, value) {

        var $li = $('<li></li>').appendTo($ul);
        $('<strong></strong>').html(name + ': ').appendTo($li);
        $('<b></b>').html(value == null ? '' : value).appendTo($li);
    }

});
