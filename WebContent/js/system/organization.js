jQuery(function($){
    
	var organization = {

		oid:null,
		btns: {
			withdrawBtn: com.focusPage("#withdrawBtn").on("click", saveDate),
		},
		
		modals: {
			editOrganizationModal: com.focusPage("#editOrganizationModal")
		},

		items: {
			no: com.focusPage("#no", "#editOrganizationModal"),
			name: com.focusPage("#name", "#editOrganizationModal"),
		},
		
		status: ["启用", "禁用"]
	};
	
	var searcher = new Searcher();
	
	searcher.base("condList", "pagenation", "resultList", api.system.pageOrganization);

	searcher.condition(["system-organization-name"]);

	searcher.button([{id: "addOrganization", name: "添加", clazz: "btn-primary", icon: "icon-plus"}]);
	
	searcher.history("organizationPostData");

	var lineprops = [
		{fieId:"no",name: "编号", prop: "no", clazz:"grey"},
		{fieId: "status", name: "状态", prop: "status", dataset: organization.status, clazz: "red"}
	];
	
	var linebtns = [
		{name: "状态", type: "switch", clazz: "status-lbl", handle: function(v, check){
			com.post(api.system.updateOrganizationForStatus, {"organization.oid": v.oid, "organization.status": check ? 0 : 1}, function(res){
				searcher.doSearch();
				return false;
			});
		}, init: function(v){
			return !v.status;
		}},
		{name: "更新", clazz: "btn-info", handle: function(v){
		    
			com.focusPage('#myModalLabe2').text('更新');
			
			organization.oid = v.oid;
			organization.items.name.val(v.name);
			organization.items.no.val(v.no);
			
			organization.modals.editOrganizationModal.modal("show");
			
			return false;
		}},
	];

	searcher.line("name", lineprops, linebtns).render();

	com.focusPage('#addOrganization' , '#pagenation').on("click", function(){
	    
		organization.oid = null;
		
		com.cleanItems(organization.items);
		
		organization.modals.editOrganizationModal.modal("show");
	})

	function saveDate() {
	    
		if (com.validate('editOrganizationModal')) return false;
		
		var url = api.system.addOrganization;
		var options = {
			"organization.name" : organization.items.name.val(),
			"organization.no" : organization.items.no.val()
		};
		
		if(organization.oid){
		    url = api.system.updateOrganization;
		    options["organization.oid"] = organization.oid;
		}
		
		com.post(url, options, function () {
            searcher.doSearch();
            organization.modals.editOrganizationModal.modal("hide");
        });
	}
	
});

