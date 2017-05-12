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
import com.fanglin.inventory.service.AssisTypeService;
import com.fanglin.inventory.vo.AssisTypeVO;
@ParentPackage("base")
@Namespace("/")
@Controller
public class AssisTypeAction extends BaseListAction{

	private static final long serialVersionUID = -4140635606784104865L;
	
	@Autowired
	private AssisTypeService assisTypeService;
	
	private List<AssisTypeVO> assisTypes;
	
	private AssisTypeVO assisType;
	
	@Action(value = "pageAssisType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAssisType(){
		assisTypeService.pageAssisType(getPaging(), getFilters());
		return SUCCESS;
	}
	
	@Action(value = "queryAssisType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAssisType(){
		assisTypes = assisTypeService.queryAssisType();
		return SUCCESS;
	}
	
	@Action(value = "queryAssisTypeByWtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAssisTypeByWtid(){
		assisTypes = assisTypeService.queryAssisTypeByWtid(assisType);
		return SUCCESS;
	}
	
	@Action(value = "addAssisType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAssisType() throws FLException{
		assisTypeService.addAssisType(assisType);
		return SUCCESS;
	}
	
	@Action(value = "updateAssisType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAssisType() throws FLException{
		assisTypeService.updateAssisType(assisType);
		return SUCCESS;
	}
	
	@Action(value = "updateAssisTypeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAssisTypeForStatus() throws FLException{
		assisTypeService.updateAssisTypeForStatus(assisType);
		return SUCCESS;
	}

	public List<AssisTypeVO> getAssisTypes() {
		return assisTypes;
	}

	public void setAssisTypes(List<AssisTypeVO> assisTypes) {
		this.assisTypes = assisTypes;
	}

	public AssisTypeVO getAssisType() {
		return assisType;
	}

	public void setAssisType(AssisTypeVO assisType) {
		this.assisType = assisType;
	}
	
}
