/**
 * @File Name		: GoodsAction.java
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
import com.fanglin.inventory.service.GoodsPackageService;
import com.fanglin.inventory.service.GoodsService;
import com.fanglin.inventory.vo.GoodsPackageVO;
import com.fanglin.inventory.vo.GoodsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class GoodsAction extends BaseListAction {

	private static final long serialVersionUID = -7801931415139013595L;
	
	@Autowired
	private GoodsService goodsService;
	
	@Autowired
	private GoodsPackageService goodsPackageService;
	
	private List<GoodsPackageVO> goodsPackages;
	
	private List<GoodsVO> goodes;
	
	private GoodsVO goods;
	
	private GoodsPackageVO goodsPackage;
	
	@Action(value = "pageGoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageGoods() throws FLException{
		
		goodsService.pageGoods(getPaging(), getFilters(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryGoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoods() throws FLException{
		
		goodes = goodsService.queryGoods(getFilters(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryGoodsByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsByNo() throws FLException{
		
		goodes = goodsService.queryGoodsByNo(goods,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryGoodsByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsByName() throws FLException{
		
		goodes = goodsService.queryGoodsByName(goods,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryGoodsByBarcode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsByBarcode() throws FLException {
		
		goods = goodsService.queryGoodsByBarcode(goods,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryGoodsByAtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsByAtid() throws FLException{
		
		goodes = goodsService.queryGoodsByAtid(goods,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryGoodsByGId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsByGId(){
		
		goods = goodsService.queryGoodsByGId(goods);
		
		return SUCCESS;
	}
	
	@Action(value = "addGoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addGoods() throws FLException{
		
		goodsService.addGoods(goods,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "addPackage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPackage() throws FLException{
		
		goodsService.addPackage(goods, goodsPackages, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "updateGoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateGoods() throws FLException{
		
		goodsService.updateGoods(goods);
		
		return SUCCESS;
	}
	
	@Action(value = "updateGoodsForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateGoodsForStatus() throws FLException{
		
		goodsService.updateGoodsForStatus(goods);
		
		return SUCCESS;
	}
	
	@Action(value = "queryPackage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsForPackage() throws FLException{
		
		goodsPackages = goodsPackageService.queryPackage(goodsPackage);
		
		return SUCCESS;
	}
	@Action(value = "bindGoodsForPackage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String bindGoodsForPackage() throws FLException{
		
		goodsPackageService.bindGoodsForPackage(goodsPackage);
		
		return SUCCESS;
	}
	@Action(value = "deleteGoodsForPackage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteGoodsForPackage() throws FLException{
		
		goodsPackageService.deleteGoodsForPackage(goodsPackage);
		
		return SUCCESS;
	}

	public List<GoodsVO> getGoodes() {
		return goodes;
	}

	public void setGoodes(List<GoodsVO> goodes) {
		this.goodes = goodes;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public List<GoodsPackageVO> getGoodsPackages() {
		return goodsPackages;
	}

	public void setGoodsPackages(List<GoodsPackageVO> goodsPackages) {
		this.goodsPackages = goodsPackages;
	}

	public GoodsPackageVO getGoodsPackage() {
		return goodsPackage;
	}

	public void setGoodsPackage(GoodsPackageVO goodsPackage) {
		this.goodsPackage = goodsPackage;
	}
	
}
