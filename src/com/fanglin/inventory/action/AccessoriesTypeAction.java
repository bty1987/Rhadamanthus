package com.fanglin.inventory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.service.AccessoriesTypeService;
import com.fanglin.inventory.vo.AccessoriesTypeVO;
@ParentPackage("base")
@Namespace("/")
@Controller
public class AccessoriesTypeAction extends BaseListAction{

	private static final long serialVersionUID = -4140635606784104865L;
	
	@Autowired
	private AccessoriesTypeService accessoriesTypeService;
	
	private List<AccessoriesTypeVO> accessoriesTypes;
	
	private AccessoriesTypeVO accessoriesType;
	
	@Action(value = "pageAccessoriesType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAccessoriesType(){
		accessoriesTypeService.pageAccessoriesType(getPaging(), getFilters());
		return SUCCESS;
	}
	
	@Action(value = "queryAccessoriesType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccessoriesType(){
		accessoriesTypes = accessoriesTypeService.queryAccessoriesType();
		return SUCCESS;
	}
	
	@Action(value = "queryAccessoriesTypeByWtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccessoriesTypeByWtid(){
		accessoriesTypes = accessoriesTypeService.queryAccessoriesTypeByWtid(accessoriesType);
		return SUCCESS;
	}
	
	@Action(value = "addAccessoriesType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAccessoriesType() throws FLException{
		accessoriesTypeService.addAccessoriesType(accessoriesType);
		return SUCCESS;
	}
	
	@Action(value = "updateAccessoriesType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAccessoriesType() throws FLException{
		accessoriesTypeService.updateAccessoriesType(accessoriesType);
		return SUCCESS;
	}
	
	@Action(value = "updateAccessoriesTypeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAccessoriesTypeForStatus() throws FLException{
		accessoriesTypeService.updateAccessoriesTypeForStatus(accessoriesType);
		return SUCCESS;
	}

	public List<AccessoriesTypeVO> getAccessoriesTypes() {
		return accessoriesTypes;
	}

	public void setAccessoriesTypes(List<AccessoriesTypeVO> accessoriesTypes) {
		this.accessoriesTypes = accessoriesTypes;
	}

	public AccessoriesTypeVO getAccessoriesType() {
		return accessoriesType;
	}

	public void setAccessoriesType(AccessoriesTypeVO accessoriesType) {
		this.accessoriesType = accessoriesType;
	}

}
