package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.quotation.service.ProtationCostService;
import com.fanglin.quotation.vo.ProtationCostVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ProtationCostAction extends BaseListAction {

	private static final long serialVersionUID = -3762226091014863790L;
	
	@Autowired
	private ProtationCostService protationCostService;
	
	private ProtationCostVO protationCost;
	
	private List<ProtationCostVO> protationCosts;
	
	@Action(value = "queryProtationCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProtationCost() {

		protationCosts = protationCostService.queryProtationCost(protationCost);
		
		return SUCCESS;
	}

	public ProtationCostVO getProtationCost() {
		return protationCost;
	}

	public void setProtationCost(ProtationCostVO protationCost) {
		this.protationCost = protationCost;
	}

	public List<ProtationCostVO> getProtationCosts() {
		return protationCosts;
	}

	public void setProtationCosts(List<ProtationCostVO> protationCosts) {
		this.protationCosts = protationCosts;
	}

}
