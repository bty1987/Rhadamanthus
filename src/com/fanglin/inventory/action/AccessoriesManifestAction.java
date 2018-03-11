package com.fanglin.inventory.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.inventory.service.AccessoriesManifestService;
import com.fanglin.inventory.vo.AccessoriesManifestVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AccessoriesManifestAction extends BaseListAction{

	private static final long serialVersionUID = 1273120047792794331L;
	
	@Autowired
	private AccessoriesManifestService accessoriesManifestService;
	
	private AccessoriesManifestVO accessoriesManifest;
	
	@Action(value = "queryAccessoriesManifestByAid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccessoriesManifestByAid(){
		
		accessoriesManifest = accessoriesManifestService.queryAccessoriesManifestByAid(accessoriesManifest);
		
		return SUCCESS;
	}

	public AccessoriesManifestVO getAccessoriesManifest() {
		return accessoriesManifest;
	}

	public void setAccessoriesManifest(AccessoriesManifestVO accessoriesManifest) {
		this.accessoriesManifest = accessoriesManifest;
	}
	
}
