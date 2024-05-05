package com.fanglin.right.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.service.DecorationFunctionRightService;
import com.fanglin.right.vo.DecorationFunctionRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationFunctionRightAction extends BaseListAction {

	private static final long serialVersionUID = 6788183414191506157L;

	@Autowired
	private DecorationFunctionRightService decorationFunctionRightService;

	private List<DecorationFunctionRightVO> decorationFunctionRights;

	private DecorationFunctionRightVO decorationFunctionRight;

	private List<Long> dfids;

	@Action(value = "queryDecorationFunctionRightByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationFunctionRightByName() throws FLException {

		decorationFunctionRights = decorationFunctionRightService.queryDecorationFunctionRightByName(decorationFunctionRight, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateDecorationFunctionRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationFunctionRight() throws FLException {

		decorationFunctionRightService.updateDecorationFunctionRight(decorationFunctionRight, dfids, queryCompany());

		return SUCCESS;
	}

	public List<DecorationFunctionRightVO> getDecorationFunctionRights() {
		return decorationFunctionRights;
	}

	public void setDecorationFunctionRights(List<DecorationFunctionRightVO> decorationFunctionRights) {
		this.decorationFunctionRights = decorationFunctionRights;
	}

	public DecorationFunctionRightVO getDecorationFunctionRight() {
		return decorationFunctionRight;
	}

	public void setDecorationFunctionRight(DecorationFunctionRightVO decorationFunctionRight) {
		this.decorationFunctionRight = decorationFunctionRight;
	}

	public List<Long> getDfids() {
		return dfids;
	}

	public void setDfids(List<Long> dfids) {
		this.dfids = dfids;
	}

}
