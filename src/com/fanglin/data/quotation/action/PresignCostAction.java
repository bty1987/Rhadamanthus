package com.fanglin.data.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.PresignCostService;
import com.fanglin.data.quotation.vo.PresignCostVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PresignCostAction extends BaseListAction {

	private static final long serialVersionUID = 6165562855954206419L;
	
	@Autowired
	private PresignCostService presignCostService;
	
	private PresignCostVO presignCost;
	
	private List<PresignCostVO> presignCosts;
	
	@Action(value = "queryPresignCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPresignCost() {
		
		presignCosts = presignCostService.queryPresignCost(presignCost);
		
		return SUCCESS;
	}

	@Action(value = "addPresignCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPresignCost() throws FLException {
		
		presignCostService.addPresignCost(presignCost);
		
		return SUCCESS;
	}
	
	@Action(value = "deletePresignCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePresignCost() throws FLException {
		
		presignCostService.deletePresignCost(presignCost);
		
		return SUCCESS;
	}

	public PresignCostVO getPresignCost() {
		return presignCost;
	}

	public void setPresignCost(PresignCostVO presignCost) {
		this.presignCost = presignCost;
	}
	
	
	public List<PresignCostVO> getPresignCosts() {
		return presignCosts;
	}

	public void setPresignCosts(List<PresignCostVO> presignCosts) {
		this.presignCosts = presignCosts;
	}
	
}
