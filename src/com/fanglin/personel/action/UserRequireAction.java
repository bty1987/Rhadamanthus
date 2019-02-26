package com.fanglin.personel.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.UserRequireService;
import com.fanglin.personel.vo.UserRequireVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserRequireAction extends BaseListAction{

	private static final long serialVersionUID = -5496897644187333263L;
	
	private UserRequireVO userRequire;
	
	@Autowired
	private UserRequireService userRequireService;
	
	@Action(value = "pageUserRequire", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageUserRequire() throws FLException{
		
		userRequireService.pageUserRequire(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "addUserRequire", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addUserRequire() throws FLException{
		
		userRequireService.addUserRequire(userRequire, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="approveUserRequire", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String approveUserRequire() throws FLException{
		
		userRequireService.approveUserRequire(userRequire);
		
		return SUCCESS;
	}
	
	@Action(value="refuseUserRequire", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String refuseUserRequire() throws FLException{
		
		userRequireService.refuseUserRequire(userRequire);
		
		return SUCCESS;
	}
	
	@Action(value="finishUserRequire", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String finishUserRequire() throws FLException{
		
		userRequireService.finishUserRequire(userRequire);
		
		return SUCCESS;
	}
	
	public UserRequireVO getUserRequire() {
		return userRequire;
	}

	public void setUserRequire(UserRequireVO userRequire) {
		this.userRequire = userRequire;
	}
}
