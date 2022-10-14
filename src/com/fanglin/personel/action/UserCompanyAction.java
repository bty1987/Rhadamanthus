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
import com.fanglin.personel.service.UserCompanyService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserCompanyVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserCompanyAction extends BaseListAction {

	private static final long serialVersionUID = -4398737048532787390L;

	@Autowired
	private UserCompanyService userCompanyService;

	private List<UserCompanyVO> userCompanys;

	private UserBaseVO user;

	private List<String> cids;

	@Action(value = "queryUserCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserCompany() throws FLException {

		userCompanys = userCompanyService.queryUserCompany(user);

		return SUCCESS;
	}

	@Action(value = "updateUserCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserCompany() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userCompanyService.updateUserCompany(user, cids, queryUserId());

		return SUCCESS;
	}

	public List<UserCompanyVO> getUserCompanys() {
		return userCompanys;
	}

	public void setUserCompanys(List<UserCompanyVO> userCompanys) {
		this.userCompanys = userCompanys;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public List<String> getCids() {
		return cids;
	}

	public void setCids(List<String> cids) {
		this.cids = cids;
	}

}
