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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.bean.User;
import com.fanglin.dingding.service.DingTalkAuthService;
import com.fanglin.dingding.service.DingTalkUserService;
import com.fanglin.utils.LogUtils;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DoginAction extends BaseListAction {

	private static final long serialVersionUID = 6488703220739762932L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private DingTalkAuthService authDDService;

	@Autowired
	private DingTalkUserService userDDService;

	private String url;

	private String configInfo;

	private String code;

	private User user;

	private String company;

	@Action(value = "requestDDConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String requestDDConfig() throws FLException {

		try {
			configInfo = authDDService.getConfig(url, null, company);
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统繁忙,请稍后重试");

			LogUtils.logging(logger, e, "requestDDConfig", "common");
		}

		return SUCCESS;
	}

	@Action(value = "queryDDUserInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDDUserInfo() throws FLException {

		try {
			user = userDDService.getUserInfo(code, company);
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统繁忙,请稍后重试");

			LogUtils.logging(logger, e, "queryDDUserInfo", "common");
		}

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
