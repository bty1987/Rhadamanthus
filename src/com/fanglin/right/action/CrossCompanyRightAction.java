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
import com.fanglin.right.service.CrossCompanyRightService;
import com.fanglin.right.vo.CrossCompanyRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CrossCompanyRightAction extends BaseListAction {

	private static final long serialVersionUID = -5718239446370854412L;

	@Autowired
	private CrossCompanyRightService crossCompanyRightService;

	private CrossCompanyRightVO crossCompanyRight;

	private List<CrossCompanyRightVO> crossCompanyRights;

	@Action(value = "queryCrossCompanyRightByUid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCrossCompanyRightByUid() throws FLException {

		crossCompanyRights = crossCompanyRightService.queryCrossCompanyRightByUid(crossCompanyRight.getUid());

		return SUCCESS;
	}

	@Action(value = "updateCrossCompanyRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCrossCompanyRight() throws FLException {

		crossCompanyRightService.updateCrossCompanyRight(crossCompanyRight.getUid(), crossCompanyRights, queryUserId());

		return SUCCESS;
	}

	public CrossCompanyRightVO getCrossCompanyRight() {
		return crossCompanyRight;
	}

	public void setCrossCompanyRight(CrossCompanyRightVO crossCompanyRight) {
		this.crossCompanyRight = crossCompanyRight;
	}

	public List<CrossCompanyRightVO> getCrossCompanyRights() {
		return crossCompanyRights;
	}

	public void setCrossCompanyRights(List<CrossCompanyRightVO> crossCompanyRights) {
		this.crossCompanyRights = crossCompanyRights;
	}

}
