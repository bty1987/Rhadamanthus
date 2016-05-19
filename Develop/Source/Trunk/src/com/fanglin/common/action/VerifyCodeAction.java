/*
 * @File Name	: VerifyCodeAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email		: 
 * Describing	: 验证码相关action
 */

package com.fanglin.common.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.security.SecurityCodeHelper;
import com.fanglin.core.security.SecurityImageHelper;
import com.fanglin.utils.Constant;
import com.fanglin.utils.CookieUtil;
import com.fanglin.utils.SystemConfig;

import java.io.ByteArrayInputStream;

@SuppressWarnings("serial")
@ParentPackage("login")
@Namespace("/")
@Controller
public class VerifyCodeAction extends BaseAction {

	private ByteArrayInputStream imageStream; // 图片流

	public ByteArrayInputStream getImageStream(){
		return imageStream;
	}

	public void setImageStream(ByteArrayInputStream imageStream){
		this.imageStream = imageStream;
	}

	@Action(value = "verifyCode", results = { @Result(name = "success", type = "stream",  params={"ignoreHierarchy", "false", "contentType", "image/jpeg", "inputName", "imageStream", "bufferSize", "2048"}) })
	public String verifyCode() throws Exception {
		
		String securityCode = SecurityCodeHelper.getSecurityCode(); // 获取默认难度和长度的验证码
		imageStream = SecurityImageHelper.getImageAsInputStream(securityCode);
		String securityCodeEncodeString = AESHelper.encryptToString(securityCode, SystemConfig.getString("encryptKey")); // 放入cookie中
		
		CookieUtil.addCookie(response, Constant.COOKIE_VERIFYCODE, securityCodeEncodeString);
		
		return SUCCESS;
	}
}
