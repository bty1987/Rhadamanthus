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
import com.fanglin.system.service.CompanyService;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.utils.Constant;
import com.fanglin.utils.CookieUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.IPUtil;
import com.fanglin.utils.LogUtils;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class LoginAction extends BaseListAction {

	private static final long serialVersionUID = 597878314944213650L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private UserService userService;

	@Autowired
	private CompanyService companyService;

	@Autowired
	private LoginService loginService;

	@Autowired
	private LoginLogService loginLogService;

	private String authentication;

	private UserVO user;

	private String current;

	private String company;

	private String nonce;

	/**
	 * 生成登录挑战（nonce） 用于挑战-响应认证
	 */
	@Action(value = "requestLoginChallenge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String requestLoginChallenge() {
		try {
			String userId = request.getParameter("userId");

			if (userId == null || userId.trim().isEmpty()) {
				throw new FLException(110019, "用户ID不能为空");
			}

			// 生成随机nonce（UUID）
			String nonce = java.util.UUID.randomUUID().toString().replace("-", "");

			// 获取当前时间戳
			long timestamp = System.currentTimeMillis();

			// 将nonce存储到session中，设置5分钟过期
			request.getSession().setAttribute("login_nonce_" + userId, nonce);
			request.getSession().setAttribute("login_nonce_time_" + userId, timestamp);

			// 返回nonce给前端
			setNonce(nonce);

		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统繁忙,请稍后重试");
			LogUtils.logging(logger, e, "requestLoginChallenge", "common");
		}

		return SUCCESS;
	}

	@Action(value = "doLogin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String doLogin() {

		String inputCode = request.getParameter("verifyCode");
		String loginId = request.getParameter("userId");
		String password = request.getParameter("password");
		String responseHash = request.getParameter("responseHash"); // 新增：挑战响应哈希
		String securityCode = request.getParameter("securityCode");
		String ip = IPUtil.getIpAddr(request);

		// Phase 8: 统一登录日志上下文（含 operateType/resultState 等新字段）
		LoginLogVO loginLogVO = new LoginLogVO(loginId, ip, DateUtil.getDateToTimestamp(new Date()));
		loginLogVO.setOperateType(com.fanglin.log.po.LoginLogPO.OPERATETYPE_PASSWORD);

		try {

			if (SystemConfig.getString("disable") != null && !SystemConfig.getString("disable").equals(loginId)) {
				throw new FLException(110018, "平台暂停使用");
			}

			String verifyCode = AESHelper.decrypt(securityCode, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

			if (verifyCode == null || !verifyCode.equals(inputCode)) {
				throw new FLException(110001, "验证码错误");
			}

			// Phase 8: 预检查防爆破（快速拒绝已锁定用户，避免消耗 DB 查询）
			int times = loginLogService.isCanLogin(loginLogVO);
			if (times == -1) {
				throw new FLException(110003, "密码输入错误次数过多,拒绝登陆");
			}

			UserVO user = null;

			// ===== 挑战-响应认证分支 =====
			if (responseHash != null && !responseHash.trim().isEmpty()) {
				// 从session获取nonce
				String storedNonce = (String) request.getSession().getAttribute("login_nonce_" + loginId);
				Long nonceTime = (Long) request.getSession().getAttribute("login_nonce_time_" + loginId);

				if (storedNonce == null || nonceTime == null) {
					throw new FLException(110020, "登录会话已过期,请刷新页面重试");
				}

				// 检查nonce是否过期（5分钟）
				if (System.currentTimeMillis() - nonceTime > 5 * 60 * 1000) {
					throw new FLException(110020, "登录会话已过期,请刷新页面重试");
				}

				// 使用挑战-响应方式验证
				user = userService.validateUserByChallenge(loginId, responseHash, storedNonce);

				// 验证成功后清除nonce（防止重放）
				request.getSession().removeAttribute("login_nonce_" + loginId);
				request.getSession().removeAttribute("login_nonce_time_" + loginId);

			} else if (password != null && !password.trim().isEmpty()) {
				// 旧方式：明文密码验证（向后兼容）
				user = userService.validateUser(loginId, password);
			} else {
				throw new FLException(110002, "请提供密码");
			}
			// ===== 挑战-响应认证结束 =====

			if (user == null) {
				// Phase 8: 原子化写入失败日志（FOR UPDATE 串行化，防并发爆破）
				int remain = loginLogService.recordLogin(loginLogVO, false, 110002, "用户名或者密码错误");
				String errorMessage = String.format("用户名或者密码错误,还可以尝试%s次输入", String.valueOf(remain));
				throw new FLException(110002, errorMessage);
			}

			if ((user.getIsLogin() & UserPO.ISLOGIN_FIP_INT) != UserPO.ISLOGIN_FIP_INT) {
				throw new FLException(110004, "该用户不能登陆系统");
			}

			companyService.validateCompany(new CompanyVO(CompanyServiceImpl.encode(Integer.parseInt(user.getCompanys()))));

			Authentication authenticationUtil = new Authentication(user.getUserId(), user.getCurrentName(), user.getRole().getRid(), (new Date()).getTime(), false, Integer.parseInt(user.getCompanys()), user.getFreedom());

			authentication = AESHelper.encrypt(authenticationUtil.getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

			// Phase 8: 原子化写入成功日志（同时写 successFlag=1 和 resultState=0）
			loginLogVO.setCompanyId(Integer.parseInt(user.getCompanys()));
			loginLogService.recordLogin(loginLogVO, true, null, null);
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());

			// Phase 8: FLException 也记录到登录日志（除已记录的 110002/110004 外）
			// 避免重复记录：110002 已在上方 recordLogin 记录
			if (e.getCode() != 110002 && e.getCode() != 110003){
				try {
					loginLogService.recordLogin(loginLogVO, false, e.getCode(), e.getErrorMessage());
				} catch (Throwable ignore) { }
			}
		} catch (Exception e) {

			setErrorCode(110000);
			setErrorMsg("系统繁忙,请稍后重试");

			// Phase 8: 系统异常也记录到登录日志（resultState=2 异常）
			try {
				loginLogVO.setResultState(com.fanglin.log.po.LoginLogPO.RESULTSTATE_ERROR);
				loginLogService.recordLogin(loginLogVO, false, 110000, "系统繁忙,请稍后重试");
			} catch (Throwable ignore) { }

			LogUtils.logging(logger, e, "doLogin", "common", ip);
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

		String userId = request.getParameter("userId");
		String ip = IPUtil.getIpAddr(request);

		// Phase 8: 补登录日志（原代码完全不记录验证码登录路径）
		LoginLogVO loginLogVO = new LoginLogVO(userId, ip, DateUtil.getDateToTimestamp(new Date()));
		loginLogVO.setOperateType(com.fanglin.log.po.LoginLogPO.OPERATETYPE_AUTHCODE);

		try {
			String code = request.getParameter("code");
			String secret = request.getParameter("secret");

			if (SystemConfig.getString("disable") != null && !SystemConfig.getString("disable").equals(userId)) {
				throw new FLException(110018, "平台暂停使用");
			}

			setAuthentication(loginService.requestAuthCode(userId, code, secret));

			// 成功
			loginLogService.recordLogin(loginLogVO, true, null, null);
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
			try {
				loginLogService.recordLogin(loginLogVO, false, e.getCode(), e.getErrorMessage());
			} catch (Throwable ignore) { }
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统繁忙,请稍后重试");
			try {
				loginLogVO.setResultState(com.fanglin.log.po.LoginLogPO.RESULTSTATE_ERROR);
				loginLogService.recordLogin(loginLogVO, false, 110000, "系统繁忙,请稍后重试");
			} catch (Throwable ignore) { }

			LogUtils.logging(logger, e, "requestAuthCode", "common");
		}

		return SUCCESS;
	}

	@Action(value = "phoneAuthCode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String phoneAuthCode() throws FLException {

		String userId = request.getParameter("userId");
		String ip = IPUtil.getIpAddr(request);

		// Phase 8: 补登录日志（原代码完全不记录手机验证码登录路径）
		LoginLogVO loginLogVO = new LoginLogVO(userId, ip, DateUtil.getDateToTimestamp(new Date()));
		loginLogVO.setOperateType(com.fanglin.log.po.LoginLogPO.OPERATETYPE_PHONE);

		try {
			String phone = request.getParameter("phone");
			String code = request.getParameter("code");
			String secret = request.getParameter("secret");

			if (SystemConfig.getString("disable") != null && !SystemConfig.getString("disable").equals(userId)) {
				throw new FLException(110018, "平台暂停使用");
			}

			setAuthentication(loginService.phoneAuthCode(userId, phone, code, secret));

			// 成功
			loginLogService.recordLogin(loginLogVO, true, null, null);
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
			try {
				loginLogService.recordLogin(loginLogVO, false, e.getCode(), e.getErrorMessage());
			} catch (Throwable ignore) { }
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统繁忙,请稍后重试");
			try {
				loginLogVO.setResultState(com.fanglin.log.po.LoginLogPO.RESULTSTATE_ERROR);
				loginLogService.recordLogin(loginLogVO, false, 110000, "系统繁忙,请稍后重试");
			} catch (Throwable ignore) { }

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

			companyService.validateCompany(new CompanyVO(getCompany()));

			setAuthentication(loginService.changeAuthCode(getAuthentication(), getCompany()));
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统繁忙,请稍后重试");

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

			if (user == null) {
				throw new FLException(110008, "验证信息错误");
			}

			setAuthentication(loginService.updateAuthCode(getAuthentication(), user.getPassword()));
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
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

	public String getNonce() {
		return nonce;
	}

	public void setNonce(String nonce) {
		this.nonce = nonce;
	}

}
