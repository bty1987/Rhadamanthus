package com.fanglin.production.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.PuotationService;
import com.fanglin.production.vo.PuotationItemVO;
import com.fanglin.production.vo.PuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PuotationAction extends BaseListAction {

	private static final long serialVersionUID = 556765449865257L;

	@Autowired
	private PuotationService puotationService;

	private PuotationVO puotation;

	private List<PuotationVO> puotations;

	private PuotationItemVO puotationItem;

	private List<PuotationItemVO> puotationItems;

	@Action(value = "queryPuotationByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPuotationByPid() {

		puotations = puotationService.queryPuotationByPid(puotation);

		return SUCCESS;
	}

	@Action(value = "queryPuotationItemByQid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPuotationItemByQid() {

		puotationItems = puotationService.queryPuotationItemByQid(puotation);

		return SUCCESS;
	}

	@Action(value = "addPuotation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPuotation() throws FLException {

		puotationService.addPuotation(puotation, puotationItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "addPuotationItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPuotationItem() throws FLException {

		puotationService.addPuotationItem(puotationItem);

		return SUCCESS;
	}

	@Action(value = "updatePuotation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePuotation() throws FLException {

		puotationService.updatePuotation(puotation);

		return SUCCESS;
	}

	@Action(value = "updatePuotationForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePuotationForAdvance() throws FLException {

		puotationService.updatePuotationForAdvance(puotation);

		return SUCCESS;
	}

	@Action(value = "updatePuotationForDefault", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePuotationForDefault() throws FLException {

		puotationService.updatePuotationForDefault(puotation);

		return SUCCESS;
	}

	@Action(value = "deletePuotation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePuotation() throws FLException {

		puotationService.deletePuotation(puotation);

		return SUCCESS;
	}

	@Action(value = "deletePuotationItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePuotationItem() throws FLException {

		puotationService.deletePuotationItem(puotationItem);

		return SUCCESS;
	}

	public PuotationVO getPuotation() {
		return puotation;
	}

	public void setPuotation(PuotationVO puotation) {
		this.puotation = puotation;
	}

	public List<PuotationVO> getPuotations() {
		return puotations;
	}

	public void setPuotations(List<PuotationVO> puotations) {
		this.puotations = puotations;
	}

	public PuotationItemVO getPuotationItem() {
		return puotationItem;
	}

	public void setPuotationItem(PuotationItemVO puotationItem) {
		this.puotationItem = puotationItem;
	}

	public List<PuotationItemVO> getPuotationItems() {
		return puotationItems;
	}

	public void setPuotationItems(List<PuotationItemVO> puotationItems) {
		this.puotationItems = puotationItems;
	}

}
