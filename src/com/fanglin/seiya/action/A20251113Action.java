/**
 * @File Name		: ApprovalAction.java
 * @Package   	: com.fanglin.approval.action
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.seiya.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.seiya.service.A20251113Service;

@ParentPackage("base")
@Namespace("/")
@Controller
public class A20251113Action extends BaseListAction {

	private static final long serialVersionUID = 3540333987788927680L;

	@Autowired
	private A20251113Service a20251113Service;

	private String osstoken;

	private String accessToken;

	private String socialCode;

	private String socialState;

	private String userId;

	private String domain;

	@Action(value = "registAuthCode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String registAuthCode() throws FLException {

		osstoken = a20251113Service.registAuthCode(osstoken);

		return SUCCESS;
	}

	@Action(value = "exchangeAuthCode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String exchangeAuthCode() throws FLException {

		osstoken = a20251113Service.exchangeAuthCode(osstoken);

		return SUCCESS;
	}

	@Action(value = "exchangeAuthCodeForToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String exchangeAuthCodeForToken() throws FLException {

		osstoken = a20251113Service.exchangeAuthCodeForToken(accessToken);

		return SUCCESS;
	}

	@Action(value = "socialAuthCode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String socialAuthCode() throws FLException {

		domain = a20251113Service.socialAuthCode(domain);

		return SUCCESS;
	}

	@Action(value = "stateAuthCode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String stateAuthCode() throws FLException {

		domain = a20251113Service.stateAuthCode(socialCode, socialState);

		return SUCCESS;
	}

	@Action(value = "logoutAuthCode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String logoutAuthCode() throws FLException {

		a20251113Service.logoutAuthCode(userId, osstoken, domain);

		return SUCCESS;
	}

	public String getOsstoken() {
		return osstoken;
	}

	public void setOsstoken(String osstoken) {
		this.osstoken = osstoken;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public String getSocialCode() {
		return socialCode;
	}

	public void setSocialCode(String socialCode) {
		this.socialCode = socialCode;
	}

	public String getSocialState() {
		return socialState;
	}

	public void setSocialState(String socialState) {
		this.socialState = socialState;
	}

}
