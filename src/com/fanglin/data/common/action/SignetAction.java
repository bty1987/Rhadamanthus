package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.SignetService;
import com.fanglin.data.common.vo.SignetVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SignetAction extends BaseListAction {

	private static final long serialVersionUID = 6376596333056777147L;

	@Autowired
	private SignetService signetService;

	private List<SignetVO> signets;

	private SignetVO signet;

	@Action(value = "pageSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSignet() throws FLException {

		signetService.pageSignet(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySignet() throws FLException {

		signets = signetService.querySignet(queryCompany());

		return SUCCESS;
	}

	@Action(value = "addSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSignet() throws FLException {

		signetService.addSignet(signet, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSignet() throws FLException {

		signetService.updateSignet(signet);

		return SUCCESS;
	}

	@Action(value = "registSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String registSignet() throws FLException {

		signetService.registSignet(signet);

		return SUCCESS;
	}

	@Action(value = "authSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String authSignet() throws FLException {

		signetService.authSignet(signet);

		return SUCCESS;
	}

	@Action(value = "confirmSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmSignet() throws FLException {

		signetService.confirmSignet(signet);

		return SUCCESS;
	}

	@Action(value = "signateSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signateSignet() throws FLException {

		signetService.signateSignet(signet);

		return SUCCESS;
	}

	@Action(value = "signateAuto", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signateAuto() throws FLException {

		signetService.signateAuto(signet);

		return SUCCESS;
	}

	public List<SignetVO> getSignets() {
		return signets;
	}

	public void setSignets(List<SignetVO> signets) {
		this.signets = signets;
	}

	public SignetVO getSignet() {
		return signet;
	}

	public void setSignet(SignetVO signet) {
		this.signet = signet;
	}

}
