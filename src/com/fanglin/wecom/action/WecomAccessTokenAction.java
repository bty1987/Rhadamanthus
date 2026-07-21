/**
 * @File Name		: WecomAccessTokenAction.java
 * @Package   	: com.fanglin.wecom.action
 * @Version		: 1.0
 * @Date			: 2026-7-5
 * @Copyright	: Copyright Creators 2014
 * @Describing	: 企业微信 access_token 控制器
 */

package com.fanglin.wecom.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.wecom.service.WecomAccessTokenService;
import com.fanglin.wecom.vo.WecomAccessTokenVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WecomAccessTokenAction extends BaseListAction {

	private static final long serialVersionUID = 6102745839201742310L;

	@Autowired
	private WecomAccessTokenService accessTokenService;

	private WecomAccessTokenVO accessToken;

	private String company;

	@Action(value = "queryWecomAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccessToken() {

		accessToken = accessTokenService.queryAccessToken(company);

		return SUCCESS;
	}

	@Action(value = "makeWecomAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeAccessToken() {

		accessTokenService.makeAccessToken(company);

		return SUCCESS;
	}

	@Action(value = "batchMakeWecomAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String batchmakeAccessToken() {

		accessTokenService.batchmakeAccessToken(company);

		return SUCCESS;
	}

	@Action(value = "deleteWecomAccessToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAccessToken() {

		accessTokenService.deleteAccessTokenByOperateTime();

		return SUCCESS;
	}

	public WecomAccessTokenVO getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(WecomAccessTokenVO accessToken) {
		this.accessToken = accessToken;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

}
