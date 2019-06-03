$(function () {

    var company = params.company.cid;
    var userId = params.userInfo.user.userId;


    com.charts("reportDiv", "design", {
        "api": "system.decorationClass.designContractAndMeasure",
        "company": company,
        "userId": userId,
        "mongo": "decoration"
    }, "col-xs-6", {"height": "500px"});

    com.charts("reportDiv", "designContract", {
        "api": "system.decorationClass.designContract",
        "company": company,
        "userId": userId,
        "mongo": "decoration"
    }, "col-xs-6", {"height": "500px"});

    com.charts("reportDiv", "salesman", {
        "api": "system.decorationClass.salesmanContractAndMeasure",
        "company": company,
        "userId": userId,
        "mongo": "decoration"
    }, "col-xs-6", {"height": "500px"});

    com.charts("reportDiv", "salesmanContract", {
        "api": "system.decorationClass.salesmanContract",
        "company": company,
        "userId": userId,
        "mongo": "decoration"
    }, "col-xs-6", {"height": "500px"});

});