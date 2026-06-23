$(function() {

    var decorationBalance = {
        decoration: null,

        items: {
            orderId: com.focusPage('#orderId', '#balanceModal'),
            balance: com.focusPage('#balance', '#balanceModal')
        },

        btns: {
            saveBtn: com.focusPage('#saveBtn').on('click', saveData)
        },

        modals: {
            balanceModal: com.focusPage('#balanceModal').on('show.bs.modal', function() {
                com.clearValidator();
            })
        }
    };

    var searcher = new Searcher();

    searcher.base('condList', 'pagenation', 'resultList', api.decoration.pageDecorationForBalance);
    searcher.condition(['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'decoration-salesman', 'decoration-status', 'decoration-balanceStatus', 'decoration-balanceTime']);
    searcher.history('decorationBalancePostData');

    var lineprops = [{
        fieId: 'decoration.orderId',
        name: '装修单号',
        prop: function(v) {
            return v.decoration ? v.decoration.orderId : '';
        },
        clazz: 'blue',
        click: function(btn, v) {
            if (v.decoration) tools.decoration.info(btn, v.decoration.orderId);
        }
    }, {
        fieId: 'decoration.house.village.name',
        name: '楼盘',
        prop: function(v) {
            return v.decoration && v.decoration.house && v.decoration.house.village ? v.decoration.house.village.name : '';
        },
        clazz: 'grey',
        click: function(btn, v) {
            if (v.decoration && v.decoration.house) tools.house.info(btn, v.decoration.house.hid);
        }
    }, {
        fieId: 'decoration.house.houseNumber',
        name: '楼号',
        prop: function(v) {
            return v.decoration && v.decoration.house ? v.decoration.house.houseNumber : '';
        },
        clazz: 'grey'
    }, {
        fieId: 'decoration.customer.name',
        name: '客户',
        prop: function(v) {
            return v.decoration && v.decoration.customer ? v.decoration.customer.name : '';
        },
        clazz: 'grey'
    }, {
        fieId: 'decoration.designer.currentName',
        name: '设计师',
        prop: function(v) {
            return v.decoration && v.decoration.designer ? v.decoration.designer.currentName : '';
        },
        clazz: 'grey'
    }, {
        fieId: 'decoration.salesman.currentName',
        name: '业务员',
        prop: function(v) {
            return v.decoration && v.decoration.salesman ? v.decoration.salesman.currentName : '';
        },
        clazz: 'grey'
    }, {
        fieId: 'decoration.status',
        name: '订单状态',
        prop: function(v) {
            return v.decoration ? constant.decoration().decoration.status.keys[v.decoration.status] : '';
        },
        clazz: 'red'
    }, {
        fieId: 'decoration.balanceStatus',
        name: '内决状态',
        prop: function(v) {
            return v.decoration ? constant.decoration().decoration.balanceStatus.keys[v.decoration.balanceStatus] : '';
        },
        clazz: 'red'
    }, {
        fieId: 'decoration.balanceTime',
        name: '内决时间',
        prop: function(v) {
            return v.decoration ? v.decoration.balanceTime : '';
        },
        clazz: 'green'
    }, {
        type: 'newline'
    }, {
        fieId: 'balance',
        name: '结算金额',
        prop: 'balance',
        clazz: 'blue'
    }, {
        fieId: 'user.currentName',
        name: '结算人',
        prop: function(v) {
            return v.user ? v.user.currentName : '';
        },
        clazz: 'grey'
    }, {
        fieId: 'balanceTime',
        name: '结算时间',
        prop: 'balanceTime',
        clazz: 'green'
    }];

    var linebtns = [{
        name: '编辑',
        clazz: 'btn-info',
        handle: function(v) {

            decorationBalance.decoration = v.decoration;

            decorationBalance.items.orderId.val(v.decoration ? v.decoration.orderId : '');
            decorationBalance.items.balance.val(v.balance);
            decorationBalance.modals.balanceModal.modal('show');

            return false;
        }
    }];

    searcher.line('decoration.orderId', lineprops, linebtns).render();

    function saveData() {

        if (com.validate('balanceModal')) return false;

        if (!decorationBalance.decoration || !decorationBalance.decoration.orderId) {
            com.showAlert(com.warning, '装修单信息不存在');
            return false;
        }

        com.post(api.decoration.makeDecorationBalance, {
            'decorationBalance.decoration.orderId': decorationBalance.decoration.orderId,
            'decorationBalance.balance': decorationBalance.items.balance.val()
        }, function() {

            com.showAlert(com.info, '操作成功');
            decorationBalance.modals.balanceModal.modal('hide');
            searcher.doSearch();
        });
    }

});
