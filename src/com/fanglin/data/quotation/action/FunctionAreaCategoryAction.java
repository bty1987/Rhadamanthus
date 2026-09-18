package com.fanglin.data.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.FunctionAreaCategoryService;
import com.fanglin.data.quotation.vo.FunctionAreaCategoryVO;
import com.fanglin.data.quotation.vo.FunctionAreaFormatVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FunctionAreaCategoryAction extends BaseAction {

	private static final long serialVersionUID = 4681295703824176925L;

	@Autowired
	private FunctionAreaCategoryService functionAreaCategoryService;

	private FunctionAreaCategoryVO functionAreaCategory;

	private FunctionAreaFormatVO functionAreaFormat;

	private String facids;

	private List<FunctionAreaCategoryVO> functionAreaCategorys;

	private List<FunctionAreaFormatVO> functionAreaFormats;

	@Action(value = "queryFunctionAreaCategoryByFaid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFunctionAreaCategoryByFaid() throws FLException {

		functionAreaCategorys = functionAreaCategoryService.queryFunctionAreaCategoryByFaid(functionAreaCategory);

		return SUCCESS;
	}

	@Action(value = "queryFunctionAreaFormatByFacids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFunctionAreaFormatByFacids() throws FLException {

		functionAreaFormats = functionAreaCategoryService.queryFunctionAreaFormatByFacids(facids);

		return SUCCESS;
	}

	@Action(value = "addFunctionAreaCategory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFunctionAreaCategory() throws FLException {

		functionAreaCategoryService.addFunctionAreaCategory(functionAreaCategory);

		return SUCCESS;
	}

	@Action(value = "deleteFunctionAreaCategory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteFunctionAreaCategory() throws FLException {

		functionAreaCategoryService.deleteFunctionAreaCategory(functionAreaCategory);

		return SUCCESS;
	}

	@Action(value = "addFunctionAreaFormat", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFunctionAreaFormat() throws FLException {

		functionAreaCategoryService.addFunctionAreaFormat(functionAreaFormat);

		return SUCCESS;
	}

	@Action(value = "updateFunctionAreaFormat", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateFunctionAreaFormat() throws FLException {

		functionAreaCategoryService.updateFunctionAreaFormat(functionAreaFormat);

		return SUCCESS;
	}

	@Action(value = "deleteFunctionAreaFormat", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteFunctionAreaFormat() throws FLException {

		functionAreaCategoryService.deleteFunctionAreaFormat(functionAreaFormat);

		return SUCCESS;
	}

	public FunctionAreaCategoryVO getFunctionAreaCategory() {
		return functionAreaCategory;
	}

	public void setFunctionAreaCategory(FunctionAreaCategoryVO functionAreaCategory) {
		this.functionAreaCategory = functionAreaCategory;
	}

	public FunctionAreaFormatVO getFunctionAreaFormat() {
		return functionAreaFormat;
	}

	public void setFunctionAreaFormat(FunctionAreaFormatVO functionAreaFormat) {
		this.functionAreaFormat = functionAreaFormat;
	}

	public List<FunctionAreaCategoryVO> getFunctionAreaCategorys() {
		return functionAreaCategorys;
	}

	public void setFunctionAreaCategorys(List<FunctionAreaCategoryVO> functionAreaCategorys) {
		this.functionAreaCategorys = functionAreaCategorys;
	}

	public String getFacids() {
		return facids;
	}

	public void setFacids(String facids) {
		this.facids = facids;
	}

	public List<FunctionAreaFormatVO> getFunctionAreaFormats() {
		return functionAreaFormats;
	}

	public void setFunctionAreaFormats(List<FunctionAreaFormatVO> functionAreaFormats) {
		this.functionAreaFormats = functionAreaFormats;
	}

}
