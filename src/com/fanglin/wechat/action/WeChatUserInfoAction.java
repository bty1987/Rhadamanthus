/**
 * @File Name		: WeChatUserInfoAction.java
 * @Package   	: com.fanglin.wechat.action
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信公众号用户信息控制器
 */

package com.fanglin.wechat.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.wechat.service.WeChatUserInfoService;
import com.fanglin.wechat.vo.WeChatUserInfoVO;

/**
 * 微信公众号用户信息控制器
 * 用于获取微信公众号用户信息
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class WeChatUserInfoAction extends BaseListAction {

	private static final long serialVersionUID = -387995638369730327L;

	@Autowired
	private WeChatUserInfoService weChatUserInfoService;

	/**
	 * 微信用户 OpenID
	 */
	private String openId;

	/**
	 * 公司标识
	 */
	private String company;

	/**
	 * 微信用户信息
	 */
	private WeChatUserInfoVO userInfo;

	/**
	 * 查询微信公众号用户信息
	 * @return 成功
	 */
	@Action(value = "queryWeChatUserInfo", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String queryUserInfo() throws FLException {

		userInfo = weChatUserInfoService.queryUserInfo(openId, company);

		return SUCCESS;
	}

	// Getters and Setters

	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public WeChatUserInfoVO getUserInfo() {
		return userInfo;
	}

	public void setUserInfo(WeChatUserInfoVO userInfo) {
		this.userInfo = userInfo;
	}

}
