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

package com.fanglin.factory.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.LoginInfoVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.factory.service.LoginInfoService;
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

	private String prefix;

	private short type;

	@Action(value = "QRCode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String QRCode() throws FLException {

		try {

			if (SystemConfig.getString("communion") == null) {
				throw new FLException(-1, "无操作权限");
			}

			loginInfo = loginInfoService.addLoginInfo();

			if (prefix == null || "".equals(prefix))
				prefix = "/";
			else
				prefix = String.format("/%s/", prefix);

			String contents = "";

			if (type == 1) {
				contents = String.format("%swx/login?loginFlag=%s", SystemConfig.getString("innerhost"), loginInfo.getLoginFlag());
			} else {
				contents = String.format("%s%sdingding/login/login.html?loginFlag=%s", SystemConfig.getString("outterhost"), prefix, loginInfo.getLoginFlag());
			}

			QRCode = QRCodeUtil.encode(contents, 300, 300);

		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统处理问题");
		}

		return SUCCESS;
	}

	@Action(value = "queryLoginInfoByLoginFlag", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryLoginInfoByLoginFlag() throws FLException {

		try {

			if (SystemConfig.getString("communion") == null) {
				throw new FLException(-1, "无操作权限");
			}

			loginInfo = loginInfoService.queryLoginInfoByLoginFlag(loginInfo);

		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统处理问题");
		}

		return SUCCESS;
	}

	@Action(value = "updateLoginInfoForAuthentication", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateLoginInfoForAuthentication() {

		try {

			if (SystemConfig.getString("communion") == null) {
				throw new FLException(-1, "无操作权限");
			}

			loginInfoService.updateLoginInfoForAuthentication(loginInfo);

		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		}

		return SUCCESS;
	}

	@Action(value = "deleteLoginInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteLoginInfo() {

		loginInfoService.deleteLoginInfoByOptime(loginInfo);

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

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

}
