package com.fanglin.information.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.AwardPurchaseService;
import com.fanglin.information.vo.AwardPurchaseVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AwardPurchaseAction extends BaseListAction {

	private static final long serialVersionUID = -5742462179927102641L;

	@Autowired
	private AwardPurchaseService awardPurchaseService;

	private AwardPurchaseVO awardPurchase;

	private List<AwardPurchaseVO> awardPurchases;

	@Action(value = "pageAwardPurchase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAwardPurchase() throws FLException {

		awardPurchaseService.pageAwardPurchase(getPaging(), getFilters(), awardPurchase, queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "addAwardPurchase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAwardPurchase() throws FLException {

		awardPurchaseService.addAwardPurchase(awardPurchase, queryUserId(), queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "purchaseAwardPurchase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String purchaseAwardPurchase() throws FLException {

		awardPurchaseService.purchaseAwardPurchase( awardPurchase, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "instoreAwardPurchase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String instoreAwardPurchase() throws FLException {

		awardPurchaseService.instoreAwardPurchase(awardPurchase, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "balanceAwardPurchase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String balanceAwardPurchase() throws FLException {

		awardPurchaseService.balanceAwardPurchase(awardPurchase, queryUserId());

		return SUCCESS;
	}

	public AwardPurchaseVO getAwardPurchase() {
		return awardPurchase;
	}

	public void setAwardPurchase(AwardPurchaseVO awardPurchase) {
		this.awardPurchase = awardPurchase;
	}

	public List<AwardPurchaseVO> getAwardPurchases() {
		return awardPurchases;
	}

	public void setAwardPurchases(List<AwardPurchaseVO> awardPurchases) {
		this.awardPurchases = awardPurchases;
	}

}
