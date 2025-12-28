/**
 * @File Name		: WeChatConfigAction.java
 * @Package   	: com.fanglin.wechat.action
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信 JS-SDK 配置控制器
 */

package com.fanglin.wechat.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.wechat.service.WeChatConfigService;
import com.fanglin.wechat.vo.WeChatConfigVO;

/**
 * 微信 JS-SDK 配置控制器
 * 用于生成微信 JS-SDK 所需的配置签名
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class WeChatConfigAction extends BaseListAction {

	private static final long serialVersionUID = -387995638369730323L;

	@Autowired
	private WeChatConfigService weChatConfigService;

	/**
	 * URL 地址
	 */
	private String url;

	/**
	 * 查询字符串
	 */
	private String query;

	/**
	 * 公司标识
	 */
	private String company;

	/**
	 * 微信配置对象
	 */
	private WeChatConfigVO wxConfigVO;

	/**
	 * 签名配置 JSON 字符串
	 */
	private String configJson;

	/**
	 * 查询微信 JS-SDK 配置（通过 VO 对象）
	 * @return 成功
	 */
	@Action(value = "queryWeChatConfig", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String queryWXConfig() {

		wxConfigVO = new WeChatConfigVO();
		wxConfigVO.setUrl(url);
		wxConfigVO.setQuery(query);
		wxConfigVO.setCompany(company);

		wxConfigVO = weChatConfigService.queryWXConfig(wxConfigVO);

		return SUCCESS;
	}

	/**
	 * 获取微信 JS-SDK 配置（JSON 格式字符串）
	 * @return 成功
	 */
	@Action(value = "getWeChatConfig", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String getConfig() {

		configJson = weChatConfigService.getConfig(url, query, company);

		return SUCCESS;
	}

	// Getters and Setters

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getQuery() {
		return query;
	}

	public void setQuery(String query) {
		this.query = query;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public WeChatConfigVO getWxConfigVO() {
		return wxConfigVO;
	}

	public void setWxConfigVO(WeChatConfigVO wxConfigVO) {
		this.wxConfigVO = wxConfigVO;
	}

	public String getConfigJson() {
		return configJson;
	}

	public void setConfigJson(String configJson) {
		this.configJson = configJson;
	}

}
