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
import com.fanglin.data.common.service.SupplierSignetService;
import com.fanglin.data.common.vo.SupplierSignetVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierSignetAction extends BaseListAction {

	private static final long serialVersionUID = 6376596333056777147L;

	@Autowired
	private SupplierSignetService signetService;

	private List<SupplierSignetVO> signets;

	private SupplierSignetVO signet;

	@Action(value = "pageSupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSupplierSignet() throws FLException {

		signetService.pageSupplierSignet(getPaging(), getFilters(), signet, queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySupplierSignet() throws FLException {

		signets = signetService.querySupplierSignet(signet == null ? new SupplierSignetVO() : signet, queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySupplierSignetBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySupplierSignetBySid() throws FLException {

		signet = signetService.querySupplierSignet(signet);

		return SUCCESS;
	}

	@Action(value = "addSupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSupplierSignet() throws FLException {

		signetService.addSupplierSignet(signet, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateSupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSupplierSignet() throws FLException {

		signetService.updateSupplierSignet(signet);

		return SUCCESS;
	}

	@Action(value = "registSupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String registSupplierSignet() throws FLException {

		signetService.registSupplierSignet(signet);

		return SUCCESS;
	}

	@Action(value = "authSupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String authSupplierSignet() throws FLException {

		signetService.authSupplierSignet(signet);

		return SUCCESS;
	}

	@Action(value = "confirmSupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmSupplierSignet() throws FLException {

		signetService.confirmSupplierSignet(signet);

		return SUCCESS;
	}

	@Action(value = "signateSupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signateSupplierSignet() throws FLException {

		signetService.signateSupplierSignet(signet);

		return SUCCESS;
	}

	@Action(value = "autoSupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String autoSupplierSignet() throws FLException {

		signetService.autoSupplierSignet(signet);

		return SUCCESS;
	}

	@Action(value = "selectSupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String selectSupplierSignet() throws FLException {

		signetService.selectSupplierSignet(signet);

		return SUCCESS;
	}

	@Action(value = "cancelSupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelSupplierSignet() throws FLException {

		signetService.cancelSupplierSignet(signet);

		return SUCCESS;
	}

	@Action(value = "copySupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String copySupplierSignet() throws FLException {

		signetService.copySupplierSignet(signet);

		return SUCCESS;
	}

	@Action(value = "moveSupplierSignet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String moveSupplierSignet() throws FLException {

		signetService.moveSupplierSignet(signet);

		return SUCCESS;
	}

	public List<SupplierSignetVO> getSignets() {
		return signets;
	}

	public void setSignets(List<SupplierSignetVO> signets) {
		this.signets = signets;
	}

	public SupplierSignetVO getSignet() {
		return signet;
	}

	public void setSignet(SupplierSignetVO signet) {
		this.signet = signet;
	}

}
