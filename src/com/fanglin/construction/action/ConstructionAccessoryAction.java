package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.ConstructionAccessoryService;
import com.fanglin.construction.vo.ConstructionAccessoryVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;


@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionAccessoryAction extends BaseListAction{
	
	private static final long serialVersionUID = 7912765874220030069L;
	
	@Autowired
	private ConstructionAccessoryService constructionAccessoryService;
	
    private ConstructionAccessoryVO constructionAccessory;
    
	private List<ConstructionAccessoryVO> constructionAccessorys;
	
	@Action(value = "pageConstructionAccessory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionAccessory() throws FLException{
		
		constructionAccessoryService.pageConstructionAccessory(getPaging(), getFilters(), constructionAccessory);
		
		return SUCCESS;
	}
	
	@Action(value = "addConstructionAccessory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionAccessory() throws FLException{
		
		constructionAccessoryService.addConstructionAccessory(constructionAccessory);
		
		return SUCCESS;
	}
	
	@Action(value = "updateConstructionAccessory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionAccessory() throws FLException{
		
		constructionAccessoryService.updateConstructionAccessory(constructionAccessory);
		
		return SUCCESS;
	}

	public ConstructionAccessoryVO getConstructionAccessory() {
		return constructionAccessory;
	}

	public void setConstructionAccessory(ConstructionAccessoryVO constructionAccessory) {
		this.constructionAccessory = constructionAccessory;
	}

	public List<ConstructionAccessoryVO> getConstructionAccessorys() {
		return constructionAccessorys;
	}

	public void setConstructionAccessorys(List<ConstructionAccessoryVO> constructionAccessorys) {
		this.constructionAccessorys = constructionAccessorys;
	}

}
