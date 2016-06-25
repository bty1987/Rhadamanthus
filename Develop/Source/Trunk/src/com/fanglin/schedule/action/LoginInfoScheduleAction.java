/**
 * @File Name		: LoginInfoAction.java
 * @Package   	: com.fanglin.schedule.action
 * @Version		: 1.0
 * @Date			: 2016-5-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.schedule.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.service.LoginInfoService;
import com.fanglin.common.vo.LoginInfoVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("dingding")
@Namespace("/")
@Controller
public class LoginInfoScheduleAction extends BaseListAction {

	private static final long serialVersionUID = -8445580138346459262L;

	@Autowired
	private LoginInfoService loginInfoService;
	
	private LoginInfoVO loginInfo;
	
	@Action(value = "deleteLoginInfo", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String deleteLoginInfo(){
		
		loginInfoService.deleteLoginInfoByOptime(loginInfo);
		
		return SUCCESS;
	}

	public LoginInfoVO getLoginInfo() {
		return loginInfo;
	}

	public void setLoginInfo(LoginInfoVO loginInfo) {
		this.loginInfo = loginInfo;
	}

}
