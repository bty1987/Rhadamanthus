jQuery(function($) {

    // 活动物品查询: 覆盖全部活动类型的 decorationactivityitem 行(券/物品/优惠额度系), 条件筛选
    // 订单号/券编码(no)/活动名称/奖励名称/物品类型/券状态/线上线下;
    // 抽奖券券行(no=LT前缀)同池可查, 券状态=11 即已中奖(抽奖系统开奖回写),
    // 供全国门店员工查询中奖客户信息(需求: 工作人员需要一个入口可以查询到中奖客户信息)

    // 状态映射(state): 与条件区下拉同源, 展示用
    var stateMap = {
        0: "初始", 1: "失效", 2: "已领", 3: "退货", 10: "已领", 11: "抽奖"
    };

    // 类型映射(type)
    var typeMap = {
        0: "券", 1: "物品", 10: "优惠额度-券", 11: "优惠额度-物品", 12: "优惠额度-红包"
    };

    // 列定义
    var lineprops = [
        {
            field: "no",
            name: "编号",
            prop: "no",
            clazz: "blue"
        },
        {
            field: "orderId",
            name: "装修单",
            prop: "orderId",
            clazz: "blue",
            click: function(btn, v) {
                tools.decoration.info(btn, v.orderId);
            }
        },
        {
            field: "activityName",
            name: "活动名称",
            prop: "activityName",
            clazz: "grey"
        },
        {
            field: "activityItemName",
            name: "奖励名称",
            prop: "activityItemName",
            clazz: "grey"
        },
        {
            field: "type",
            name: "类型",
            prop: function(v) { return v.type == null ? "" : (typeMap[v.type] || v.type); },
            clazz: "grey"
        },
        {
            field: "state",
            name: "状态",
            prop: function(v) { return v.state == null ? "" : (stateMap[v.state] || v.state); },
            clazz: function(v) { return v.state == 11 ? "red" : "grey"; }
        },
        {
            field: "createTime",
            name: "发放时间",
            prop: "createTime",
            clazz: "grey"
        }
    ];

    // 行按钮: 跳装修单详情
    var linebtns = {
        info: {
            name: "装修单",
            clazz: "btn-yellow",
            handle: function(v, btn) {
                tools.decoration.info(btn, v.orderId);
            }
        }
    };

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.decoration.pageDecorationActivityItem, {}, ['decorationActivityItem-orderId', 'decorationActivityItem-no', 'decorationActivityItem-activityName', 'decorationActivityItem-activityItemName', 'decorationActivityItem-type', 'decorationActivityItem-state', 'decorationActivityItem-atttype'], "decoration4activityItemPostData", null, false, null);

    searcher.line("no", lineprops, linebtns).render();
});
