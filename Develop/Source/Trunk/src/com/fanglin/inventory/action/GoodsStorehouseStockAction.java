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
import com.fanglin.inventory.vo.CheckListVO;
import com.fanglin.inventory.vo.GoodsStorehouseStockVO;
import com.fanglin.utils.Arith;

@ParentPackage("base")
@Namespace("/")
@Controller
public class GoodsStorehouseStockAction extends BaseListAction {

	private static final long serialVersionUID = 6626731189288920005L;
	
	@Autowired
	private GoodsStorehouseStockService goodsStorehouseStockService;
	
	private GoodsStorehouseStockVO goodsStorehouseStock;
	
	private List<GoodsStorehouseStockVO> goodsStorehouseStocks;
	
	private CheckListVO checkList;
	
	private Float nums;
	
	@Action(value = "pageGoodsStorehouseStock", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageGoodsStorehouseStock(){
		
		goodsStorehouseStockService.pageGoodsStorehouseStock(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "checkGoodsStorehouseStock", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkGoodsStorehouseStock() throws FLException{
		
		goodsStorehouseStockService.checkGoodsStorehouseStock(checkList, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryStorehouseStockByShIdAGId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryStorehouseStockByShid() {
		
		goodsStorehouseStock = goodsStorehouseStockService.queryStorehouseStockByShIdAGId(goodsStorehouseStock);
		
		return SUCCESS;
	}
	
	@Action(value = "queryGoodsStorehouseStockByGid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsStorehouseStockByGid() {
		
		Float num = 0f;
		
		goodsStorehouseStocks = goodsStorehouseStockService.queryGoodsStorehouseStockByGid(goodsStorehouseStock);
		
		for(GoodsStorehouseStockVO goodsStorehouseStockVO : goodsStorehouseStocks){
			num = Arith.add(goodsStorehouseStockVO.getNum(), num);
		}
		
		nums = num;
				
		return SUCCESS;
	}

	public CheckListVO getCheckList() {
		return checkList;
	}

	public void setCheckList(CheckListVO checkList) {
		this.checkList = checkList;
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

	public void setGoodsStorehouseStocks(
			List<GoodsStorehouseStockVO> goodsStorehouseStocks) {
		this.goodsStorehouseStocks = goodsStorehouseStocks;
	}

	public Float getNums() {
		return nums;
	}

	public void setNums(Float nums) {
		this.nums = nums;
	}

}
