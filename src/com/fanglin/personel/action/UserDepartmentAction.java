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
import com.fanglin.personel.service.UserDepartmentService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserDepartmentVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserDepartmentAction extends BaseListAction {

	private static final long serialVersionUID = -4398737048532787401L;

	@Autowired
	private UserDepartmentService userDepartmentService;

	private List<UserDepartmentVO> userDepartments;

	private UserBaseVO user;

	private List<Integer> dids;

	@Action(value = "queryUserDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserDepartment() throws FLException {

		userDepartments = userDepartmentService.queryUserDepartment(user);

		return SUCCESS;
	}

	@Action(value = "updateUserDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserDepartment() throws FLException {

		userDepartmentService.updateUserDepartment(user, dids, queryUserId());

		return SUCCESS;
	}

	public List<UserDepartmentVO> getUserDepartments() {
		return userDepartments;
	}

	public void setUserDepartments(List<UserDepartmentVO> userDepartments) {
		this.userDepartments = userDepartments;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public List<Integer> getDids() {
		return dids;
	}

	public void setDids(List<Integer> dids) {
		this.dids = dids;
	}

}
