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
import com.fanglin.personel.service.UserFunctionService;
import com.fanglin.personel.vo.UserFunctionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserFunctionAction extends BaseListAction {

	private static final long serialVersionUID = -328282613390177630L;

	@Autowired
	private UserFunctionService userFunctionService;

	private List<UserFunctionVO> userFunctions;

	private UserFunctionVO userFunction;

	@Action(value = "queryUserFunction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserFunction() throws FLException {

		userFunctions = userFunctionService.queryUserFunction(userFunction);

		return SUCCESS;
	}

	public List<UserFunctionVO> getUserFunctions() {
		return userFunctions;
	}

	public void setUserFunctions(List<UserFunctionVO> userFunctions) {
		this.userFunctions = userFunctions;
	}

	public UserFunctionVO getUserFunction() {
		return userFunction;
	}

	public void setUserFunction(UserFunctionVO userFunction) {
		this.userFunction = userFunction;
	}

}
