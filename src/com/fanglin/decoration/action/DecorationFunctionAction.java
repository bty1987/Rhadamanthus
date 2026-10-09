package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationFunctionService;
import com.fanglin.decoration.vo.DecorationFunctionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationFunctionAction extends BaseListAction {

	private static final long serialVersionUID = 1361918888368720479L;

	@Autowired
	private DecorationFunctionService decorationFunctionService;

	private List<DecorationFunctionVO> decorationFunctions;

	private DecorationFunctionVO decorationFunction;

	@Action(value = "pageDecorationFunction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationFunction() throws FLException {

		decorationFunctions = decorationFunctionService.pageDecorationFunction(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryDecorationFunction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationFunction() throws FLException {

		decorationFunctions = decorationFunctionService.queryDecorationFunction(decorationFunction);

		return SUCCESS;
	}

	@Action(value = "queryDecorationFunctionByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationFunctionByName() throws FLException {

		decorationFunctions = decorationFunctionService.queryDecorationFunctionByName(decorationFunction);

		return SUCCESS;
	}

	@Action(value = "addDecorationFunction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationFunction() throws FLException {

		decorationFunctionService.addDecorationFunction(decorationFunction);

		return SUCCESS;
	}

	@Action(value = "updateDecorationFunction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationFunction() throws FLException {

		decorationFunctionService.updateDecorationFunction(decorationFunction);

		return SUCCESS;
	}

	@Action(value = "deleteDecorationFunction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDecorationFunction() throws FLException {

		decorationFunctionService.deleteDecorationFunction(decorationFunction);

		return SUCCESS;
	}

	public List<DecorationFunctionVO> getDecorationFunctions() {
		return decorationFunctions;
	}

	public void setDecorationFunctions(List<DecorationFunctionVO> decorationFunctions) {
		this.decorationFunctions = decorationFunctions;
	}

	public DecorationFunctionVO getDecorationFunction() {
		return decorationFunction;
	}

	public void setDecorationFunction(DecorationFunctionVO decorationFunction) {
		this.decorationFunction = decorationFunction;
	}

}
