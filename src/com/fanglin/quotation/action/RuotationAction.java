package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.RuotationService;
import com.fanglin.quotation.vo.RuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RuotationAction extends BaseListAction {

	private static final long serialVersionUID = -454049085051751042L;

	@Autowired
	private RuotationService ruotationService;

	private RuotationVO ruotation;

	private List<RuotationVO> ruotations;

	@Action(value = "pageRuotation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageRuotation() throws FLException {

		ruotationService.pageRuotation(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryRuotationById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRuotationById() throws FLException {

		ruotation = ruotationService.queryRuotationById(ruotation);

		return SUCCESS;
	}

	@Action(value = "addRuotation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addRuotation() throws FLException {

		ruotationService.addRuotation(ruotation, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateRuotation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRuotation() throws FLException {

		ruotationService.updateRuotation(ruotation);

		return SUCCESS;
	}

	@Action(value = "deleteRuotation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteRuotation() throws FLException {

		ruotationService.deleteRuotation(ruotation);

		return SUCCESS;
	}

	public RuotationVO getRuotation() {
		return ruotation;
	}

	public void setRuotation(RuotationVO ruotation) {
		this.ruotation = ruotation;
	}

	public List<RuotationVO> getRuotations() {
		return ruotations;
	}

	public void setRuotations(List<RuotationVO> ruotations) {
		this.ruotations = ruotations;
	}
}
