$(function(){
	//获得页面参数
	var urlParam = params['urlLoadParams'].company;
	var company = params.company.cid;

	if(urlParam == "all"){
		com.charts("reportDiv", "company", api.home.library, {"api": "user.report.total4group", "mongo": "communion"}, "col-xs-6", {"height": "500px"});
		com.charts("reportDiv", "status", api.home.library, {"api": "user.report.status4group", "mongo": "communion"}, "col-xs-6", {"height": "500px"});

		com.charts("reportDiv", "jobYears", api.home.library, {"api": "user.report.servicelength4group", "mongo": "communion"}, "col-xs-6", {"height": "500px"});
		com.charts("reportDiv", "gender", api.home.library, {"api": "user.report.gender4group", "mongo": "communion"}, "col-xs-6", {"height": "500px"});

		com.charts("reportDiv", "education", api.home.library, {"api": "user.report.education4group", "mongo": "communion"}, "col-xs-6", {"height": "500px"});

	}else {
		com.charts("reportDiv", "deptType", api.home.library, {"api": "user.report.departmenttype4company", "company": company, "mongo": "communion"}, "col-xs-6", {"height": "500px"});
		com.charts("reportDiv", "duty", api.home.library, {"api": "user.report.duty4company", "company": company, "mongo": "communion"}, "col-xs-6", {"height": "500px"});

		com.charts("reportDiv", "status", api.home.library, {"api": "user.report.status4company", "company": company, "mongo": "communion"}, "col-xs-6", {"height": "500px"});
		com.charts("reportDiv", "jobYears", api.home.library, {"api": "user.report.servicelength4company", "company": company, "mongo": "communion"}, "col-xs-6", {"height": "500px"});

		com.charts("reportDiv", "dept", api.home.library, {"api": "user.report.department4company", "company": company, "mongo": "communion"}, "col-xs-12", {"height": "900px"});
		com.charts("reportDiv", "education", api.home.library, {"api": "user.report.education4company", "company": company, "mongo": "communion"}, "col-xs-6", {"height": "700px"});
	}
});