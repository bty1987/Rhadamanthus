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
import com.fanglin.data.quotation.service.FunctionAreaOtemService;
import com.fanglin.data.quotation.vo.FunctionAreaOtemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FunctionAreaOtemAction extends BaseListAction {

	private static final long serialVersionUID = -8112581171039921146L;

	@Autowired
	private FunctionAreaOtemService functionAreaOtemService;

	private List<FunctionAreaOtemVO> functionAreaOtems;

	private FunctionAreaOtemVO functionAreaOtem;

	@Action(value = "queryFunctionAreaOtem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFunctionAreaOtem() throws FLException {

		functionAreaOtem = functionAreaOtemService.queryFunctionAreaOtem(functionAreaOtem);

		return SUCCESS;
	}

	@Action(value = "makeFunctionAreaOtem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeFunctionAreaOtem() throws FLException {

		functionAreaOtem = functionAreaOtemService.makeFunctionAreaOtem(functionAreaOtem);

		return SUCCESS;
	}

	public List<FunctionAreaOtemVO> getFunctionAreaOtems() {
		return functionAreaOtems;
	}

	public void setFunctionAreaOtems(List<FunctionAreaOtemVO> functionAreaOtems) {
		this.functionAreaOtems = functionAreaOtems;
	}

	public FunctionAreaOtemVO getFunctionAreaOtem() {
		return functionAreaOtem;
	}

	public void setFunctionAreaOtem(FunctionAreaOtemVO functionAreaOtem) {
		this.functionAreaOtem = functionAreaOtem;
	}

}
