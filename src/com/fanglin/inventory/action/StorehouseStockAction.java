/**
 * @File Name		: StorehouseStockAction.java
 * @Package   	: com.fanglin.inventory.action
 * @Version		: 1.0
 * @Date			: 2016-10-5
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
import com.fanglin.inventory.service.StorehouseStockService;
import com.fanglin.inventory.vo.StorehouseStockVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class StorehouseStockAction extends BaseListAction{

	private static final long serialVersionUID = -6795905661017720504L;
	
	@Autowired
	private StorehouseStockService storehouseStockService;
	
	private List<StorehouseStockVO> storehouseStocks;
	
	@Action(value = "queryStorehouseStock", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryStorehouseStock(){
		
		storehouseStocks = storehouseStockService.queryStorehouseStock();
		
		return SUCCESS;
	}

	public List<StorehouseStockVO> getStorehouseStocks() {
		return storehouseStocks;
	}

	public void setStorehouseStocks(List<StorehouseStockVO> storehouseStocks) {
		this.storehouseStocks = storehouseStocks;
	}

}
