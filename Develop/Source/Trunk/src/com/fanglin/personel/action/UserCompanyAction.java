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
import com.fanglin.personel.vo.UserCompanyVO;
import com.fanglin.personel.vo.UserVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserCompanyAction extends BaseListAction {

	private static final long serialVersionUID = -4398737048532787390L;

	@Autowired
	private UserCompanyService userCompanyService;
	
	private List<UserCompanyVO>  userCompanys;
	
	private UserVO user;
	
	private List<Integer> cids;
	
	@Action(value = "queryUserCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserCompany() throws FLException{
      
		userCompanys = userCompanyService.queryUserCompany(user);
		
		return SUCCESS;
	}
	
	@Action(value = "updateUserCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserCompany() throws FLException{
		
		userCompanyService.updateUserCompany(user, cids);
		
		return SUCCESS;
	}
	
	public List<UserCompanyVO> getUserCompanys() {
		return userCompanys;
	}

	public void setUserCompanys(List<UserCompanyVO> userCompanys) {
		this.userCompanys = userCompanys;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public List<Integer> getCids() {
		return cids;
	}

	public void setCids(List<Integer> cids) {
		this.cids = cids;
	}
	
}
