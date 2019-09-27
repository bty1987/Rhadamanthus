/**
 * @File Name		: GoodsStorehouseStockAction.java
 * @Package   	: com.fanglin.inventory.action
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.service.GoodsStorehouseStockService;
import com.fanglin.inventory.vo.GoodsStorehouseStockVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class GoodsStorehouseStockAction extends BaseListAction {

	private static final long serialVersionUID = 6626731189288920005L;

	@Autowired
	private GoodsStorehouseStockService goodsStorehouseStockService;

	private GoodsStorehouseStockVO goodsStorehouseStock;

	private List<GoodsStorehouseStockVO> goodsStorehouseStocks;

	private Integer nums;

	@Action(value = "pageGoodsStorehouseStock", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageGoodsStorehouseStock() throws FLException {

		goodsStorehouseStockService.pageGoodsStorehouseStock(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "queryGoodsStorehouseStockByShidAGid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryStorehouseStockByShidAGid() {

		goodsStorehouseStock = goodsStorehouseStockService.queryStorehouseStockByShidAGid(goodsStorehouseStock);

		return SUCCESS;
	}

	@Action(value = "queryGoodsStorehouseStockByGid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsStorehouseStockByGid() {

		nums = goodsStorehouseStockService.queryGoodsStorehouseStockByGid(goodsStorehouseStock);

		return SUCCESS;
	}

	@Action(value = "surplusGoodsStorehouseStock", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String surplusGoodsStorehouseStock() throws FLException {

		goodsStorehouseStockService.surplusGoodsStorehouseStock(goodsStorehouseStock, queryUserId(), queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "lossesGoodsStorehouseStock", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String lossesGoodsStorehouseStock() throws FLException {

		goodsStorehouseStockService.lossesGoodsStorehouseStock(goodsStorehouseStock, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "makeGoodsStorehouseStock", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeGoodsStorehouseStock() throws FLException {

		goodsStorehouseStockService.makeGoodsStorehouseStock(goodsStorehouseStock);

		return SUCCESS;
	}

	@Action(value = "splitPackage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String splitPackage() throws FLException {

		goodsStorehouseStockService.splitPackage(goodsStorehouseStock, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "mergePackage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String mergePackage() throws FLException {

		goodsStorehouseStockService.mergePackage(goodsStorehouseStock, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public GoodsStorehouseStockVO getGoodsStorehouseStock() {
		return goodsStorehouseStock;
	}

	public void setGoodsStorehouseStock(GoodsStorehouseStockVO goodsStorehouseStock) {
		this.goodsStorehouseStock = goodsStorehouseStock;
	}

	public List<GoodsStorehouseStockVO> getGoodsStorehouseStocks() {
		return goodsStorehouseStocks;
	}

	public void setGoodsStorehouseStocks(List<GoodsStorehouseStockVO> goodsStorehouseStocks) {
		this.goodsStorehouseStocks = goodsStorehouseStocks;
	}

	public Integer getNums() {
		return nums;
	}

	public void setNums(Integer nums) {
		this.nums = nums;
	}

}
