$(function(){
	//获得页面参数
	var urlParam = params['urlLoadParams'].company;
	var company = params.company.cid;

	if(urlParam == "all"){
		com.charts("reportDiv", "company", {"api": "user.report.total4group", "mongo": "communion"}, "col-xs-6", {"height": "500px"});
		com.charts("reportDiv", "status", {"api": "user.report.status4group", "mongo": "communion"}, "col-xs-6", {"height": "500px"});

		com.charts("reportDiv", "jobYears", {"api": "user.report.servicelength4group", "mongo": "communion"}, "col-xs-6", {"height": "500px"});
		com.charts("reportDiv", "gender", {"api": "user.report.gender4group", "mongo": "communion"}, "col-xs-6", {"height": "500px"});

		com.charts("reportDiv", "education", {"api": "user.report.education4group", "mongo": "communion"}, "col-xs-6", {"height": "500px"});

	}else {
		com.charts("reportDiv", "deptType", {"api": "user.report.departmenttype4company", "company": company, "mongo": "communion"}, "col-xs-6", {"height": "500px"});
		com.charts("reportDiv", "duty", {"api": "user.report.duty4company", "company": company, "mongo": "communion"}, "col-xs-6", {"height": "500px"});

		com.charts("reportDiv", "status", {"api": "user.report.status4company", "company": company, "mongo": "communion"}, "col-xs-6", {"height": "500px"});
		com.charts("reportDiv", "jobYears", {"api": "user.report.servicelength4company", "company": company, "mongo": "communion"}, "col-xs-6", {"height": "500px"});

		com.charts("reportDiv", "dept", {"api": "user.report.department4company", "company": company, "mongo": "communion"}, "col-xs-6", {"height": "700px"});
		com.charts("reportDiv", "education", {"api": "user.report.education4company", "company": company, "mongo": "communion"}, "col-xs-6", {"height": "700px"});
	}
});