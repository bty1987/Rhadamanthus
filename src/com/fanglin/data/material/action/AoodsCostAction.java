package com.fanglin.data.material.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.service.AoodsCostService;
import com.fanglin.data.material.vo.AoodsCostVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AoodsCostAction extends BaseListAction {

	private static final long serialVersionUID = -6253699476990163844L;
	
	@Autowired
	private AoodsCostService aoodsCostService;
	
	private AoodsCostVO aoodsCost;

	@Action(value = "pageAoodsCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAoodsCost() throws FLException{
		
		aoodsCostService.pageAoodsCost(getPaging(), getFilters(), aoodsCost);
		
		return SUCCESS;
	}
	
	@Action(value = "addAoodsCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAoodsCost() throws FLException{
		
		aoodsCostService.addAoodsCost(aoodsCost);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteAoodsCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAoodsCost() throws FLException{
		
		aoodsCostService.deleteAoodsCost(aoodsCost);
		
		return SUCCESS;
	}

	public AoodsCostVO getAoodsCost() {
		return aoodsCost;
	}

	public void setAoodsCost(AoodsCostVO aoodsCost) {
		this.aoodsCost = aoodsCost;
	}
	
}
