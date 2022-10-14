package com.fanglin.data.material.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.service.PriceService;
import com.fanglin.data.material.vo.PriceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PriceAction extends BaseListAction {

	private static final long serialVersionUID = 1565735491222639991L;

	@Autowired
	private PriceService priceService;

	private List<PriceVO> prices;

	private PriceVO price;

	@Action(value = "pagePrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePrice() throws FLException {

		priceService.pagePrice(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryPriceByGid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPriceByGid() {

		prices = priceService.queryPriceByGid(price);

		return SUCCESS;
	}

	@Action(value = "queryPriceByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPriceByPid() {

		price = priceService.queryPriceByPid(price);

		return SUCCESS;
	}

	@Action(value = "addPrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPrice() throws FLException {

		priceService.addPrice(price);

		return SUCCESS;
	}

	@Action(value = "deletePrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePrice() throws FLException {

		priceService.deletePrice(price);

		return SUCCESS;
	}

	@Action(value = "updatePriceForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePriceForStatus() throws FLException {

		priceService.updatePriceForStatus(price);

		return SUCCESS;
	}

	public List<PriceVO> getPrices() {
		return prices;
	}

	public void setPrices(List<PriceVO> prices) {
		this.prices = prices;
	}

	public PriceVO getPrice() {
		return price;
	}

	public void setPrice(PriceVO price) {
		this.price = price;
	}

}
