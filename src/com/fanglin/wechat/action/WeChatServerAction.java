/**
 * @File Name		: WeChatServerAction.java
 * @Package   	: com.fanglin.wechat.action
 * @Version		: 1.0
 * @Date			: 2018-5-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信服务器配置控制器
 */

package com.fanglin.wechat.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.wechat.service.WeChatServerService;

/**
 * 微信服务器配置控制器
 * 用于管理微信相关服务器地址配置
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class WeChatServerAction extends BaseListAction {

	private static final long serialVersionUID = -387995638369730325L;

	@Autowired
	private WeChatServerService weChatServerService;

	/**
	 * 服务器标识
	 */
	private String communion;

	/**
	 * 服务器地址
	 */
	private String serverUrl;

	/**
	 * 获取 communion 服务器地址
	 * @return 成功
	 */
	@Action(value = "queryWeChatServerUrl", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String queryServerUrl() {

		serverUrl = weChatServerService.communion(communion);

		return SUCCESS;
	}

	// Getters and Setters

	public String getCommunion() {
		return communion;
	}

	public void setCommunion(String communion) {
		this.communion = communion;
	}

	public String getServerUrl() {
		return serverUrl;
	}

	public void setServerUrl(String serverUrl) {
		this.serverUrl = serverUrl;
	}

}
