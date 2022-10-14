$(function() {

    var balanceDccountDetail = {

    	bdid: params.balance.bdid,
    };

    var seacher = new Searcher();

	seacher.base("condList1", "pagenation1", "resultList1",api.balance.pageBalanceCutpay);

    seacher.param({
        "balanceCutpay.dccount.bdid": balanceDccountDetail.bdid
    });	

	seacher.history("balanceDccountDetailPostData");

	var lineprops = [{
        fieId: "operater.currentName",
        name: "操作人",
        prop: "operater.currentName",
        clazz: "grey",
    },{
        fieId: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "green",
    },{
        field: "money",
        name: "金额",
        prop: "money",
        clazz: "blue",
    },{
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.balance().balanceCutpay.type.keys,
    },{
        fieId: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey",
    }, ];

	var linebtus = [];

	seacher.line("name", lineprops, linebtus).render();

});
