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
import com.fanglin.information.service.AwardStockService;
import com.fanglin.information.vo.AwardStockVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AwardStockAction extends BaseListAction {

	private static final long serialVersionUID = 611127402908591571L;

	@Autowired
	private AwardStockService awardStockService;

	private AwardStockVO awardStock;
	
	private List<AwardStockVO> awardStocks;

	@Action(value = "pageAwardStock", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAwardStock() throws FLException {

		awardStockService.pageAwardStock(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryAwardStockByAsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAwardStockByAsid() throws FLException {

		awardStock = awardStockService.queryAwardStockByAsid(awardStock);

		return SUCCESS;
	}

	@Action(value = "queryAwardStockByType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAwardStockByType() throws FLException {

		awardStocks = awardStockService.queryAwardStockByType(awardStock, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addAwardStock", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAwardStock() throws FLException {

		awardStockService.addAwardStock(awardStock, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateAwardStock", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAwardStock() throws FLException {

		awardStockService.updateAwardStock(awardStock);

		return SUCCESS;
	}

	@Action(value = "updateAwardStockForXG", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAwardStockForXG() throws FLException {

		awardStockService.updateAwardStockForXG(awardStock, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateAwardStockForCG", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAwardStockForCG() throws FLException {
		
		awardStockService.updateAwardStockForCG(awardStock, queryUserId());

		return SUCCESS;
	}

	@Action(value = "checkAwardStock", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkAwardStock() throws FLException {

		awardStockService.checkAwardStock(awardStock, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateAwardStockForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAwardStockForStatus() throws FLException {

		awardStockService.updateAwardStockForStatus(awardStock);

		return SUCCESS;
	}

	public AwardStockVO getAwardStock() {
		return awardStock;
	}

	public void setAwardStock(AwardStockVO awardStock) {
		this.awardStock = awardStock;
	}

	public List<AwardStockVO> getAwardStocks() {
		return awardStocks;
	}

	public void setAwardStocks(List<AwardStockVO> awardStocks) {
		this.awardStocks = awardStocks;
	}

}
