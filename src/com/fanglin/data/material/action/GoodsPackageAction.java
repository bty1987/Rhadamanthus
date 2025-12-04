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
import com.fanglin.data.material.service.GoodsPackageService;
import com.fanglin.data.material.vo.GoodsPackageVO;
import com.fanglin.data.material.vo.GoodsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class GoodsPackageAction extends BaseListAction {

	private static final long serialVersionUID = -7801931415139013595L;

	@Autowired
	private GoodsPackageService goodsPackageService;

	private List<GoodsPackageVO> goodsPackages;

	private GoodsPackageVO goodsPackage;

	private GoodsVO goods;

	@Action(value = "queryGoodsPackage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsPackage() throws FLException {

		goodsPackages = goodsPackageService.queryGoodsPackage(goodsPackage);

		return SUCCESS;
	}

	@Action(value = "addPackage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPackage() throws FLException {

		goodsPackageService.addGoodsPackage(goods, goodsPackages, queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteGoodsPackage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteGoodsPackage() throws FLException {

		goodsPackageService.deleteGoodsPackage(goodsPackage);

		return SUCCESS;
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

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

}
