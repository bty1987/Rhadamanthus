package com.fanglin.right.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.service.SalesFunctionRightService;
import com.fanglin.right.vo.SalesFunctionRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesFunctionRightAction extends BaseListAction{

	private static final long serialVersionUID = -6807412734080828439L;

	@Autowired
	private SalesFunctionRightService salesFunctionRightService;
	
	private List<SalesFunctionRightVO> salesFunctionRights;
	
	private SalesFunctionRightVO salesFunctionRight;
	
	private List<Long> sfids;
	
	@Action(value="querySalesFunctionRightByName", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String querySalesFunctionRightByName() throws FLException{
		
		salesFunctionRights = salesFunctionRightService.querySalesFunctionRightByName(salesFunctionRight);
		
		return SUCCESS;
	}
	
	@Action(value="updateSalesFunctionRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateSalesFunctionRight() throws FLException{
		
		salesFunctionRightService.updateSalesFunctionRight(salesFunctionRight, sfids, queryCompany());
		
		return SUCCESS;
	}

	public List<SalesFunctionRightVO> getSalesFunctionRights() {
		return salesFunctionRights;
	}

	public void setSalesFunctionRights(
			List<SalesFunctionRightVO> salesFunctionRights) {
		this.salesFunctionRights = salesFunctionRights;
	}

	public SalesFunctionRightVO getSalesFunctionRight() {
		return salesFunctionRight;
	}

	public void setSalesFunctionRight(
			SalesFunctionRightVO salesFunctionRight) {
		this.salesFunctionRight = salesFunctionRight;
	}

	public List<Long> getSfids() {
		return sfids;
	}

	public void setSfids(List<Long> sfids) {
		this.sfids = sfids;
	}


}
