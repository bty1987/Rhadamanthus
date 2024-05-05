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
import com.fanglin.right.service.UserFunctionRightService;
import com.fanglin.right.vo.UserFunctionRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserFunctionRightAction extends BaseListAction {

	private static final long serialVersionUID = 4783400028165995376L;

	@Autowired
	private UserFunctionRightService userFunctionRightService;

	private List<UserFunctionRightVO> userFunctionRights;

	private UserFunctionRightVO userFunctionRight;

	private List<Long> ufids;

	@Action(value = "queryUserFunctionRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserFunctionRight() throws FLException {

		userFunctionRights = userFunctionRightService.queryUserFunctionRight(userFunctionRight);

		return SUCCESS;
	}

	@Action(value = "updateUserFunctionRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserFunctionRight() throws FLException {

		userFunctionRightService.updateUserFunctionRight(userFunctionRight, ufids, queryCompany());

		return SUCCESS;
	}

	public List<UserFunctionRightVO> getUserFunctionRights() {
		return userFunctionRights;
	}

	public void setUserFunctionRights(List<UserFunctionRightVO> userFunctionRights) {
		this.userFunctionRights = userFunctionRights;
	}

	public UserFunctionRightVO getUserFunctionRight() {
		return userFunctionRight;
	}

	public void setUserFunctionRight(UserFunctionRightVO userFunctionRight) {
		this.userFunctionRight = userFunctionRight;
	}

	public List<Long> getUfids() {
		return ufids;
	}

	public void setUfids(List<Long> ufids) {
		this.ufids = ufids;
	}

}
