/**
 * @File Name	: BaseAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * @Describing	: 基类Action 当返回的是非列表的Action是继承该类，返回列表时继承BaseListAction类
 */

package com.fanglin.core.action;

import java.io.UnsupportedEncodingException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.json.annotations.JSON;
import org.springframework.stereotype.Controller;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.utils.Constant;
import com.fanglin.utils.CookieUtil;
import com.fanglin.utils.SystemConfig;
import com.opensymphony.xwork2.ActionSupport;

@ParentPackage("common")
@Namespace("/")
@Controller
public class BaseAction extends ActionSupport implements ServletRequestAware, ServletResponseAware {

	private static final long serialVersionUID = 1638203239536571772L;

	public static final String BACKVALUE_LOGIN_STR = "login";

	protected HttpServletRequest request;

	protected HttpServletResponse response;

	private int errorCode = 0;

	private String errorMsg;

	Map<String, Object> logObjs = new HashMap<String, Object>();

	public String queryUserName() throws FLException {
		String userName = null;

		String authentication = getAuthentication();

		if (authentication != null) {
			String decryptString = AESHelper.decrypt(authentication, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

			Authentication authenticationUtil = new Authentication(decryptString);
			if (authenticationUtil.getUpdateTime() != -1) {
				userName = authenticationUtil.getUserName();
			}
		}

		return userName;
	}

	public String queryUserId() throws FLException {
		String userId = null;

		String authentication = getAuthentication();

		if (authentication != null) {
			String decryptString = AESHelper.decrypt(authentication, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

			Authentication au = new Authentication(decryptString);
			if (au.getUpdateTime() != -1) {
				userId = au.getUserId();
			}
		}

		return userId;
	}

	public Integer queryRoleId() throws FLException {
		Integer roleId = null;

		String authentication = getAuthentication();

		if (authentication != null) {
			String decryptString = AESHelper.decrypt(authentication, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

			Authentication au = new Authentication(decryptString);
			if (au.getUpdateTime() != -1) {
				roleId = au.getRoleId();
			}
		}

		return roleId;
	}

	public int queryCompany() throws FLException {

		int company = 0;

		String authentication = getAuthentication();

		if (authentication != null) {
			String encryptKey = SystemConfig.getString("encryptKey");
			String encryptIv = SystemConfig.getString("encryptIv");
			String decryptString = AESHelper.decrypt(authentication, encryptKey, encryptIv);

			Authentication au = new Authentication(decryptString);
			if (au.getUpdateTime() != -1) {
				company = au.getCompany();
			}
		}

		return company;
	}

	public Authentication authentication() throws FLException {

		Authentication authentication = new Authentication();

		try {
			String au = request.getParameter("authentication");

			if (au == null) {
				au = CookieUtil.getCookie(request, Constant.COOKIE_AUTHENTICATION);
			}

			if (au == null) {
				au = (String) request.getAttribute("authentication");
			}

			if (au == null) {
				throw new FLException(110005, "登陆超时");
			}

			authentication = new Authentication(AESHelper.decrypt(au, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
		} catch (Exception e) {
			throw new FLException(110005, "登陆超时");
		}

		return authentication;
	}

	private String getAuthentication() throws FLException {

		String authentication;

		try {
			authentication = request.getParameter("authentication");

			if (authentication == null) {
				authentication = CookieUtil.getCookie(request, Constant.COOKIE_AUTHENTICATION);
			}

			return authentication;
		} catch (UnsupportedEncodingException e) {
			throw new FLException(110005, "登陆超时");
		}
	}

	@Override
	public void setServletResponse(HttpServletResponse response) {
		this.response = response;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

	public int getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(int errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	@Override
	@JSON(serialize = false)
	public Collection<String> getActionErrors() {
		return super.getActionErrors();
	}

	@Override
	@JSON(serialize = false)
	public Collection<String> getActionMessages() {
		return super.getActionMessages();
	}

	@Override
	@JSON(serialize = false)
	public Map<String, List<String>> getFieldErrors() {
		return super.getFieldErrors();
	}

	@Override
	@JSON(serialize = false)
	public ResourceBundle getTexts() {
		return super.getTexts();
	}

	@JSON(serialize = false)
	public Map<String, Object> getLogObjs() {
		if (logObjs == null) {
			logObjs = new HashMap<String, Object>();
		}

		if (logObjs.size() == 0) {
			logObjs.put("errorCode", getErrorCode());
			logObjs.put("errorMsg", getErrorMsg());
		}

		return logObjs;
	}

	public void setLogObjs(Map<String, Object> logObjs) {
		this.logObjs = logObjs;
	}

}
