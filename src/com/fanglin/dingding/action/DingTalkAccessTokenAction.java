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

package com.fanglin.dingding.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.dingding.service.DingTalkAccessTokenService;
import com.fanglin.dingding.service.DingTalkJsapiTicketService;
import com.fanglin.dingding.vo.DingTalkAccessTokenVO;
import com.fanglin.dingding.vo.DingTalkJsapiTicketVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DingTalkAccessTokenAction extends BaseListAction {

	private static final long serialVersionUID = -5578448150732101710L;

	@Autowired
	private DingTalkAccessTokenService accessTokenService;

	@Autowired
	private DingTalkJsapiTicketService dJsapiTicketService;

	private DingTalkAccessTokenVO accessToken;

	private DingTalkJsapiTicketVO jsapiTicket;

	private Short type;

	private String company;

	@Action(value = "queryAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccessToken() {

		accessToken = accessTokenService.queryAccessToken(company);

		return SUCCESS;
	}

	@Action(value = "queryJsapiTicket", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryJsapiTicket() {

		jsapiTicket = dJsapiTicketService.queryJsapiTicket(company);

		return SUCCESS;
	}

	@Action(value = "makeAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeAccessToken() {

		accessTokenService.makeAccessToken(company);

		return SUCCESS;
	}

	@Action(value = "batchmakeAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String batchmakeAccessToken() {

		accessTokenService.batchmakeAccessToken(company);

		return SUCCESS;
	}

	@Action(value = "deleteAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAccessToken() {

		accessTokenService.deleteAccessTokenByOperateTime();

		return SUCCESS;
	}

	public DingTalkAccessTokenVO getaccessToken() {
		return accessToken;
	}

	public void setaccessToken(DingTalkAccessTokenVO accessToken) {
		this.accessToken = accessToken;
	}

	public DingTalkJsapiTicketVO getJsapiTicket() {
		return jsapiTicket;
	}

	public void setJsapiTicket(DingTalkJsapiTicketVO jsapiTicket) {
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
