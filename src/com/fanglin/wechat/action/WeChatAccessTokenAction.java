/**
 * @File Name		: WAccessTokenAction.java
 * @Package   	: com.fanglin.common.action
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.wechat.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.wechat.service.WeChatAccessTokenService;
import com.fanglin.wechat.service.WeChatOpenAccessTokenService;
import com.fanglin.wechat.vo.WeChatAccessTokenVO;
import com.fanglin.wechat.vo.WeChatJsapiTicketVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WeChatAccessTokenAction extends BaseListAction {

	private static final long serialVersionUID = -387995638369730321L;

	@Autowired
	private WeChatAccessTokenService accessTokenService;

	@Autowired
	private WeChatOpenAccessTokenService openAccessTokenService;

	private WeChatAccessTokenVO accessToken;

	private WeChatJsapiTicketVO jsapiTicket;

	private Short type;

	private String company;

	@Action(value = "queryWeChatAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccessTokenForNew() {

		accessToken = accessTokenService.queryAccessToken(company);

		return SUCCESS;
	}

	@Action(value = "queryWeChatJsapiTicket", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWJsapiTicketForNew() {

		jsapiTicket = accessTokenService.queryJsapiTicketForNew(company);

		return SUCCESS;
	}

	@Action(value = "makeWeChatAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeAccessToken() {

		accessTokenService.makeAccessToken(type, company);

		return SUCCESS;
	}

	@Action(value = "deleteWeChatAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAccessToken() {

		accessTokenService.deleteAccessToken();

		return SUCCESS;
	}

	@Action(value = "deleteWeChatOpenAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteWOpenAccessToken() {

		openAccessTokenService.deleteOpenAccessTokenByOperateTime();

		return SUCCESS;
	}

	public WeChatAccessTokenVO getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(WeChatAccessTokenVO accessToken) {
		this.accessToken = accessToken;
	}

	public WeChatJsapiTicketVO getJsapiTicket() {
		return jsapiTicket;
	}

	public void setJsapiTicket(WeChatJsapiTicketVO jsapiTicket) {
		this.jsapiTicket = jsapiTicket;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

}
