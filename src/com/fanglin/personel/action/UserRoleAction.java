package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.UserRoleService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserRoleVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserRoleAction extends BaseListAction {

	private static final long serialVersionUID = 7751442884678778646L;

	@Autowired
	private UserRoleService userRoleService;

	private List<UserRoleVO> userRoles;

	private UserBaseVO user;

	private List<Integer> rids;

	@Action(value = "queryUserRole", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserRole() throws FLException {

		userRoles = userRoleService.queryUserRole(user);

		return SUCCESS;
	}

	@Action(value = "updateUserRole", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserRole() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userRoleService.updateUserRole(user, rids, queryUserId());

		return SUCCESS;
	}

	public List<UserRoleVO> getUserRoles() {
		return userRoles;
	}

	public void setUserRoles(List<UserRoleVO> userRoles) {
		this.userRoles = userRoles;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public List<Integer> getRids() {
		return rids;
	}

	public void setRids(List<Integer> rids) {
		this.rids = rids;
	}

}
