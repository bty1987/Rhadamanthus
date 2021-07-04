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
import com.fanglin.data.quotation.service.FunctionAreaItemService;
import com.fanglin.data.quotation.vo.FunctionAreaItemVO;
import com.fanglin.data.quotation.vo.FunctionAreaVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FunctionAreaItemAction extends BaseListAction {

	private static final long serialVersionUID = -9139698916609681549L;

	@Autowired
	private FunctionAreaItemService functionAreaItemService;

	private FunctionAreaItemVO functionAreaItem;

	private List<FunctionAreaItemVO> functionAreaItems;

	private FunctionAreaVO functionArea;

	private List<Long> ids;

	@Action(value = "queryFunctionAreaItemByFunctionAreaId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFunctionAreaItemByFunctionAreaId() {

		functionAreaItems = functionAreaItemService.queryFunctionAreaItemByFunctionAreaId(functionAreaItem);

		return SUCCESS;
	}

	@Action(value = "addFunctionAreaItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFunctionAreaItem() throws FLException {

		functionAreaItemService.addFunctionAreaItem(functionArea, functionAreaItems);

		return SUCCESS;
	}

	@Action(value = "updateFunctionAreaItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateFunctionAreaItem() throws FLException {
		
		functionAreaItemService.updateFunctionAreaItem(functionAreaItem);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteFunctionAreaItemByIds", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteFunctionAreaItemByIds() {

		functionAreaItemService.deleteFunctionAreaItemByIds(ids);

		return SUCCESS;
	}

	public void setFunctionAreaItems(List<FunctionAreaItemVO> functionAreaItems) {
		this.functionAreaItems = functionAreaItems;
	}

	public List<FunctionAreaItemVO> getFunctionAreaItems() {
		return functionAreaItems;
	}

	public FunctionAreaItemVO getFunctionAreaItem() {
		return functionAreaItem;
	}

	public void setFunctionAreaItem(FunctionAreaItemVO functionAreaItem) {
		this.functionAreaItem = functionAreaItem;
	}

	public FunctionAreaVO getFunctionArea() {
		return functionArea;
	}

	public void setFunctionArea(FunctionAreaVO functionArea) {
		this.functionArea = functionArea;
	}

	public List<Long> getIds() {
		return ids;
	}

	public void setIds(List<Long> ids) {
		this.ids = ids;
	}

}
