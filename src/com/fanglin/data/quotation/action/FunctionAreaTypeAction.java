package com.fanglin.data.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.FunctionAreaTypeService;
import com.fanglin.data.quotation.vo.FunctionAreaTypeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FunctionAreaTypeAction extends BaseListAction {

	private static final long serialVersionUID = -4285713709152468716L;

	@Autowired
	private FunctionAreaTypeService functionAreaTypeService;

	private FunctionAreaTypeVO functionAreaType;

	private List<FunctionAreaTypeVO> functionAreaTypes;

	@Action(value = "pageFunctionAreaType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageFunctionAreaType() throws FLException {

		functionAreaTypeService.pageFunctionAreaType(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryFunctionAreaType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFunctionAreaType() throws FLException {

		functionAreaTypes = functionAreaTypeService.queryFunctionAreaType();

		return SUCCESS;
	}

	@Action(value = "addFunctionAreaType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFunctionAreaType() throws FLException {

		functionAreaTypeService.addFunctionAreaType(functionAreaType);

		return SUCCESS;
	}

	@Action(value = "updateFunctionAreaType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateFunctionAreaType() throws FLException {

		functionAreaTypeService.updateFunctionAreaType(functionAreaType);

		return SUCCESS;
	}

	@Action(value = "updateFunctionAreaTypeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateFunctionAreaTypeForStatus() throws FLException {

		functionAreaTypeService.updateFunctionAreaTypeForStatus(functionAreaType);

		return SUCCESS;
	}

	@Action(value = "deleteFunctionAreaType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteFunctionAreaType() throws FLException {

		functionAreaTypeService.deleteFunctionAreaType(functionAreaType);

		return SUCCESS;
	}

	public FunctionAreaTypeVO getFunctionAreaType() {
		return functionAreaType;
	}

	public void setFunctionAreaType(FunctionAreaTypeVO functionAreaType) {
		this.functionAreaType = functionAreaType;
	}

	public List<FunctionAreaTypeVO> getFunctionAreaTypes() {
		return functionAreaTypes;
	}

	public void setFunctionAreaTypes(List<FunctionAreaTypeVO> functionAreaTypes) {
		this.functionAreaTypes = functionAreaTypes;
	}

}
