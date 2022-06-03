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
import com.fanglin.wechat.service.AccessTokenService;
import com.fanglin.wechat.service.JsapiTicketService;
import com.fanglin.wechat.service.OpenAccessTokenService;
import com.fanglin.wechat.vo.AccessTokenVO;
import com.fanglin.wechat.vo.JsapiTicketVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AccessTokenAction extends BaseListAction {

	private static final long serialVersionUID = -387995638369730321L;

	@Autowired
	private AccessTokenService accessTokenService;

	@Autowired
	private JsapiTicketService jsapiTicketService;

	@Autowired
	private OpenAccessTokenService openAccessTokenService;

	private AccessTokenVO accessToken;

	private JsapiTicketVO jsapiTicket;

	private Short type;

	private String company;

	@Action(value = "queryAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccessTokenForNew() {

		accessToken = accessTokenService.queryAccessToken(company);

		return SUCCESS;
	}

	@Action(value = "queryJsapiTicket", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWJsapiTicketForNew() {

		jsapiTicket = jsapiTicketService.queryJsapiTicketForNew(company);

		return SUCCESS;
	}

	@Action(value = "makeAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeAccessToken() {

		accessTokenService.makeAccessToken(type, company);

		return SUCCESS;
	}

	@Action(value = "deleteAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAccessToken() {

		accessTokenService.deleteAccessToken();

		return SUCCESS;
	}

	@Action(value = "deleteOpenAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteWOpenAccessToken() {

		openAccessTokenService.deleteOpenAccessTokenByOperateTime();

		return SUCCESS;
	}

	public AccessTokenVO getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(AccessTokenVO accessToken) {
		this.accessToken = accessToken;
	}

	public JsapiTicketVO getJsapiTicket() {
		return jsapiTicket;
	}

	public void setJsapiTicket(JsapiTicketVO jsapiTicket) {
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
