package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.PricePoolService;
import com.fanglin.communion.vo.PricePoolVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PricePoolAction extends BaseListAction {

	private static final long serialVersionUID = 1424526486617808495L;

	@Autowired
	private PricePoolService pricePoolService;

	private List<PricePoolVO> pricePools;

	private PricePoolVO pricePool;

	@Action(value = "pagePricePool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePricePool() throws FLException {

		pricePoolService.pagePricePool(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryPricePoolByGpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPricePoolByGpid() {

		pricePools = pricePoolService.queryPricePoolByGpid(pricePool);

		return SUCCESS;
	}

	@Action(value = "queryPricePoolByPpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPricePoolByPpid() {

		pricePool = pricePoolService.queryPricePoolByPpid(pricePool);

		return SUCCESS;
	}

	@Action(value = "addPricePool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPricePool() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		pricePoolService.addPricePool(pricePool);

		return SUCCESS;
	}

	@Action(value = "updatePricePoolForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePricePoolForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		pricePoolService.updatePricePoolForStatus(pricePool);

		return SUCCESS;
	}

	@Action(value = "deletePricePool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePricePool() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		pricePoolService.deletePricePool(pricePool);

		return SUCCESS;
	}

	public List<PricePoolVO> getPricePools() {
		return pricePools;
	}

	public void setPricePools(List<PricePoolVO> pricePools) {
		this.pricePools = pricePools;
	}

	public PricePoolVO getPricePool() {
		return pricePool;
	}

	public void setPricePool(PricePoolVO pricePool) {
		this.pricePool = pricePool;
	}

}
