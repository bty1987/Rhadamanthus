/**
 * @File Name	: LoginAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 登陆相关action
 */

package com.fanglin.common.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.po.User;
import com.fanglin.dingding.service.AuthService;
import com.fanglin.dingding.service.UserService;

@ParentPackage("login")
@Namespace("/")
@Controller
public class DoginAction extends BaseListAction {
	
	private static final long serialVersionUID = 6488703220739762932L;

	@Autowired
	private  AuthService authDDService ;
	
	@Autowired
    private UserService userDDService;
	
	private String url;
	
	private String configInfo;
	
	private String code;
	
	private User user;
	
	private String company;
	
	@Action(value = "requestDDConfig", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String requestDDConfig() throws FLException{
		
		configInfo = authDDService.getConfig(url, null, company);
		
		return SUCCESS;
	}
	
	@Action(value = "queryDDUserInfo", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String queryUserInfo() throws FLException{
		
		user = userDDService.getUserInfo(code, company);
		
		return SUCCESS;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getConfigInfo() {
		return configInfo;
	}

	public void setConfigInfo(String configInfo) {
		this.configInfo = configInfo;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

}
