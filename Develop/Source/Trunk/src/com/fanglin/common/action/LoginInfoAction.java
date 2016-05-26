/**
 * @File Name		: LoginInfoAction.java
 * @Package   	: com.fanglin.common.action
 * @Version		: 1.0
 * @Date			: 2016-5-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.service.LoginInfoService;
import com.fanglin.common.vo.LoginInfoVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.QRCodeUtil;
import com.fanglin.utils.SystemConfig;

@ParentPackage("login")
@Namespace("/")
@Controller
public class LoginInfoAction extends BaseListAction {

	private static final long serialVersionUID = 7905619047647380527L;
	
	@Autowired
	private LoginInfoService loginInfoService;
	
	private LoginInfoVO loginInfo;
	
	private String QRCode;
	
	@Action(value = "QRCode", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String QRCode(){
		
		loginInfo = loginInfoService.addLoginInfo();
		
		String contents = String.format("%s/dingding/login/login.html?loginFlag=%s", SystemConfig.getString("hostServer"), loginInfo.getLoginFlag());
		
		QRCode = QRCodeUtil.encode(contents, 300, 300);
		
		return SUCCESS;
	}
	
	@Action(value = "queryLoginInfoByLoginFlag", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String queryLoginInfoByLoginFlag(){
		
		loginInfo = loginInfoService.queryLoginInfoByLoginFlag(loginInfo);
		
		return SUCCESS;
	}
	
	@Action(value = "updateLoginInfoForAuthentication", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String updateLoginInfoForAuthentication() throws FLException{
		
		loginInfoService.updateLoginInfoForAuthentication(loginInfo);
		
		return SUCCESS;
	}
	
	@Action(value = "loginByQRCode", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String loginByQRCode(){
		
		loginInfoService.login(loginInfo);
		
		return SUCCESS;
	}

	public LoginInfoVO getLoginInfo() {
		return loginInfo;
	}

	public void setLoginInfo(LoginInfoVO loginInfo) {
		this.loginInfo = loginInfo;
	}

	public String getQRCode() {
		return QRCode;
	}

	public void setQRCode(String qRCode) {
		QRCode = qRCode;
	}
	
}
