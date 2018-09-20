package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationUserService;
import com.fanglin.decoration.vo.DecorationUserVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationUserAction extends BaseListAction{

	private static final long serialVersionUID = -7534255012777666910L;
	
	@Autowired
	private DecorationUserService decorationUserService;
	
	private DecorationUserVO decorationUser;
	
	private List<DecorationUserVO> decorationUsers;

	@Action(value = "queryDecorationUser", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationUser() throws FLException{
		
		decorationUsers = decorationUserService.queryDecorationUser(getPaging(), getFilters(),decorationUser);

		return SUCCESS;
	}
	
	@Action(value = "addDecorationUser", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationUser() throws FLException{

		decorationUserService.addDecorationUser(decorationUser,authentication());

		return SUCCESS;
	}
	
	@Action(value = "deleteDecorationUser", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDecorationUser() throws FLException{

		decorationUserService.deleteDecorationUser(decorationUser);

		return SUCCESS;
	}
	
	public DecorationUserVO getDecorationUser() {
		return decorationUser;
	}

	public void setDecorationUser(DecorationUserVO decorationUser) {
		this.decorationUser = decorationUser;
	}

	public List<DecorationUserVO> getDecorationUsers() {
		return decorationUsers;
	}

	public void setDecorationUsers(List<DecorationUserVO> decorationUsers) {
		this.decorationUsers = decorationUsers;
	}
	
	
	

}
