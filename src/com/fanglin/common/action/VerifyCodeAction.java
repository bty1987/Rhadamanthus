/**
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.security.SecurityCodeHelper;
import com.fanglin.core.security.SecurityImageHelper;
import com.fanglin.utils.LogUtils;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VerifyCodeAction extends BaseAction {

	private static final long serialVersionUID = 6903462944786262299L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	private ByteArrayInputStream imageStream; // 图片流

	private String securityCode;

	@Action(value = "queryVode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVode() throws Exception {

		try {
			String tmp = SecurityCodeHelper.getSecurityCode();
			String key = SystemConfig.getString("encryptKey");
			String iv = SystemConfig.getString("encryptIv");

			securityCode = AESHelper.encrypt(tmp, key, iv);
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统繁忙,请稍后重试");

			LogUtils.logging(logger, e, "queryVode", "common");
		}

		return SUCCESS;
	}

	@Action(value = "verifyCode", results = { @Result(name = "success", type = "stream", params = { "ignoreHierarchy", "false", "contentType", "image/jpeg", "inputName", "imageStream", "bufferSize", "2048" }) })
	public String verifyCode() throws FLException {

		try {
			imageStream = SecurityImageHelper.getImageAsInputStream(AESHelper.decrypt(securityCode, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统繁忙,请稍后重试");

			LogUtils.logging(logger, e, "verifyCode", "common");
		}

		return SUCCESS;
	}

	public ByteArrayInputStream getImageStream() {
		return imageStream;
	}

	public void setImageStream(ByteArrayInputStream imageStream) {
		this.imageStream = imageStream;
	}

	public String getSecurityCode() {
		return securityCode;
	}

	public void setSecurityCode(String securityCode) {
		this.securityCode = securityCode;
	}

}
