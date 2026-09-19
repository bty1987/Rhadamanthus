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
import com.fanglin.quotation.service.RuotationItemService;
import com.fanglin.quotation.vo.RuotationItemVO;
import com.fanglin.quotation.vo.RuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RuotationItemAction extends BaseListAction {

	private static final long serialVersionUID = -277871510143982548L;

	@Autowired
	private RuotationItemService ruotationItemService;

	private RuotationItemVO ruotationItem;

	private List<RuotationItemVO> ruotationItems;

	private RuotationVO ruotation;

	@Action(value = "queryRuotationItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRuotationItem() throws FLException {

		ruotationItems = ruotationItemService.queryRuotationItem(ruotationItem);

		return SUCCESS;
	}

	@Action(value = "queryRuotationItemForCandidateByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRuotationItemForCandidateByOrderId() throws FLException {

		ruotationItems = ruotationItemService.queryRuotationItemForCandidateByOrderId(ruotationItem);

		return SUCCESS;
	}

	@Action(value = "updateRuotationItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRuotationItem() throws FLException {

		ruotationItem = ruotationItemService.updateRuotationItem(ruotationItem, ruotation);

		return SUCCESS;
	}

	@Action(value = "updateRuotationItemForIndex", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRuotationItemForIndex() throws FLException {

		ruotationItemService.updateRuotationItemForIndex(ruotationItems);

		return SUCCESS;
	}

	@Action(value = "deleteRuotationItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteRuotationItem() throws FLException {

		ruotationItemService.deleteRuotationItem(ruotationItem, ruotation);

		return SUCCESS;
	}

	public RuotationItemVO getRuotationItem() {
		return ruotationItem;
	}

	public void setRuotationItem(RuotationItemVO ruotationItem) {
		this.ruotationItem = ruotationItem;
	}

	public List<RuotationItemVO> getRuotationItems() {
		return ruotationItems;
	}

	public void setRuotationItems(
			List<RuotationItemVO> ruotationItems) {
		this.ruotationItems = ruotationItems;
	}

	public RuotationVO getRuotation() {
		return ruotation;
	}

	public void setRuotation(RuotationVO ruotation) {
		this.ruotation = ruotation;
	}
}
