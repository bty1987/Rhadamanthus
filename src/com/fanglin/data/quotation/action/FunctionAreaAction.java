/**
 * @File Name		: FunctionAreaAction
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-9-20
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

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
import com.fanglin.data.quotation.service.FunctionAreaService;
import com.fanglin.data.quotation.vo.FunctionAreaVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FunctionAreaAction extends BaseListAction {

	private static final long serialVersionUID = -9139698916609681549L;

	@Autowired
	private FunctionAreaService functionAreaService;

	private FunctionAreaVO functionArea;

	private List<FunctionAreaVO> functionAreas;
	
	@Action(value = "pageFunctionArea", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageFunctionArea() throws FLException {

		functionAreaService.pageFunctionArea(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryFunctionAreaByIdAVersionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFunctionAreaByIdAVersionId() throws FLException {

		functionArea = functionAreaService.queryFunctionAreaByIdAVersionId(functionArea);

		return SUCCESS;
	}

	@Action(value = "queryFunctionAreaByVersionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFunctionAreaByVersionId() throws FLException {

		functionAreas = functionAreaService.queryFunctionAreaByVersionId(functionArea);

		return SUCCESS;
	}
	
	@Action(value = "addFunctionArea", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFunctionArea() throws FLException {

		functionAreaService.addFunctionArea(functionArea, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateFunctionArea", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateFunctionArea() throws FLException {

		functionAreaService.updateFunctionArea(functionArea);

		return SUCCESS;
	}

	@Action(value = "updateFunctionAreaForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateFunctionAreaForStatus() throws FLException {

		functionAreaService.updateFunctionAreaForStatus(functionArea);

		return SUCCESS;
	}

	@Action(value = "deleteFunctionArea", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteFunctionArea() {

		functionAreaService.deleteFunctionArea(functionArea);

		return SUCCESS;
	}

	public FunctionAreaVO getFunctionArea() {
		return functionArea;
	}

	public void setFunctionArea(FunctionAreaVO functionArea) {
		this.functionArea = functionArea;
	}

	public void setFunctionAreas(List<FunctionAreaVO> functionAreas) {
		this.functionAreas = functionAreas;
	}

	public List<FunctionAreaVO> getFunctionAreas() {
		return functionAreas;
	}
	
}
