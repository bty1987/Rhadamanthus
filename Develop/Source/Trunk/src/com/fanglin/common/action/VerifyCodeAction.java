/*
 * @File Name	: VerifyCodeAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 验证码相关action
 */

package com.fanglin.common.action;

import java.io.ByteArrayInputStream;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.security.SecurityCodeHelper;
import com.fanglin.core.security.SecurityImageHelper;
import com.fanglin.utils.SystemConfig;

@SuppressWarnings("serial")
@ParentPackage("login")
@Namespace("/")
@Controller
public class VerifyCodeAction extends BaseAction {

	private ByteArrayInputStream imageStream; // 图片流
	
	private String securityCode;
	
	@Action(value = "queryVode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVode() throws Exception{
		
		securityCode = AESHelper.encryptToString(SecurityCodeHelper.getSecurityCode(), SystemConfig.getString("encryptKey"));
		
		return SUCCESS;
	}

	@Action(value = "verifyCode", results = { @Result(name = "success", type = "stream",  params={"ignoreHierarchy", "false", "contentType", "image/jpeg", "inputName", "imageStream", "bufferSize", "2048"}) })
	public String verifyCode() throws FLException{
		
		try {
			imageStream = SecurityImageHelper.getImageAsInputStream(AESHelper.decryptString(securityCode, SystemConfig.getString("encryptKey")));
		} catch (Exception e) {
			new FLException(110000, "系统处理问题");
		}
		
		return SUCCESS;
	}
	
	public ByteArrayInputStream getImageStream(){
		return imageStream;
	}

	public void setImageStream(ByteArrayInputStream imageStream){
		this.imageStream = imageStream;
	}

	public String getSecurityCode() {
		return securityCode;
	}

	public void setSecurityCode(String securityCode) {
		this.securityCode = securityCode;
	}
	
}
