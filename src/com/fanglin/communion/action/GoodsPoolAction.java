package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.GoodsPoolService;
import com.fanglin.communion.vo.GoodsPoolVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class GoodsPoolAction extends BaseListAction {

	private static final long serialVersionUID = 5086977631026330509L;

	@Autowired
	private GoodsPoolService goodsPoolService;

	private List<GoodsPoolVO> goodsPools;

	private GoodsPoolVO goodsPool;

	@Action(value = "pageGoodsPool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageGoodsPool() throws FLException {

		goodsPoolService.pageGoodsPool(getPaging(), getFilters(),goodsPool);

		return SUCCESS;
	}

	@Action(value = "queryGoodsPool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsPool() throws FLException {

		goodsPools = goodsPoolService.queryGoodsPool(getFilters());

		return SUCCESS;
	}

	@Action(value = "queryGoodsPoolByAtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsPoolByAtid() throws FLException {

		goodsPools = goodsPoolService.queryGoodsPoolByAtid(goodsPool);

		return SUCCESS;
	}

	@Action(value = "queryGoodsPoolByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsPoolByNo() throws FLException {

		goodsPools = goodsPoolService.queryGoodsPoolByNo(goodsPool);

		return SUCCESS;
	}

	@Action(value = "queryGoodsPoolByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsPoolByName() throws FLException {

		goodsPools = goodsPoolService.queryGoodsPoolByName(goodsPool);

		return SUCCESS;
	}

	@Action(value = "queryGoodsPoolByBarcode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsPoolByBarcode() throws FLException {

		goodsPool = goodsPoolService.queryGoodsPoolByBarcode(goodsPool);

		return SUCCESS;
	}

	@Action(value = "queryGoodsPoolByGpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsPoolByGpid() {

		goodsPool = goodsPoolService.queryGoodsPoolByGpid(goodsPool);

		return SUCCESS;
	}

	@Action(value = "addGoodsPool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addGoodsPool() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		goodsPoolService.addGoodsPool(goodsPool);

		return SUCCESS;
	}

	@Action(value = "batchAddFromPool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String batchAddFromPool() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		goodsPoolService.batchAddFromPool(goodsPools);

		return SUCCESS;
	}
	
	@Action(value = "updateGoodsPool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateGoodsPool() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		goodsPoolService.updateGoodsPool(goodsPool);

		return SUCCESS;
	}

	@Action(value = "updateGoodsPoolForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateGoodsPoolForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		goodsPoolService.updateGoodsPoolForStatus(goodsPool);

		return SUCCESS;
	}

	public List<GoodsPoolVO> getGoodsPools() {
		return goodsPools;
	}

	public void setGoodsPools(List<GoodsPoolVO> goodsPools) {
		this.goodsPools = goodsPools;
	}

	public GoodsPoolVO getGoodsPool() {
		return goodsPool;
	}

	public void setGoodsPool(GoodsPoolVO goodsPool) {
		this.goodsPool = goodsPool;
	}

}
