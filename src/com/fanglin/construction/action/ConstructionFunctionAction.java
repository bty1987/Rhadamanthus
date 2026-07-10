package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.ConstructionFunctionService;
import com.fanglin.construction.vo.ConstructionFunctionVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionFunctionAction extends BaseListAction {

	private static final long serialVersionUID = 1361918888368720480L;

	@Autowired
	private ConstructionFunctionService constructionFunctionService;

	private List<ConstructionFunctionVO> constructionFunctions;

	private ConstructionFunctionVO constructionFunction;

	@Action(value = "queryConstructionFunction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionFunction() throws FLException {

		constructionFunctions = constructionFunctionService.queryConstructionFunction(constructionFunction);

		return SUCCESS;
	}

	@Action(value = "queryConstructionFunctionByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionFunctionByName() throws FLException {

		constructionFunctions = constructionFunctionService.queryConstructionFunctionByName(constructionFunction);

		return SUCCESS;
	}

	public List<ConstructionFunctionVO> getConstructionFunctions() {
		return constructionFunctions;
	}

	public void setConstructionFunctions(List<ConstructionFunctionVO> constructionFunctions) {
		this.constructionFunctions = constructionFunctions;
	}

	public ConstructionFunctionVO getConstructionFunction() {
		return constructionFunction;
	}

	public void setConstructionFunction(ConstructionFunctionVO constructionFunction) {
		this.constructionFunction = constructionFunction;
	}

}
