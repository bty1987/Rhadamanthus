package com.fanglin.information.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.PlanService;
import com.fanglin.information.service.VpaymentService;
import com.fanglin.information.vo.PlanVO;
import com.fanglin.information.vo.VpaymentVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class CommonAction extends BaseListAction{

	private static final long serialVersionUID = -4141641122501947005L;

	@Autowired
	private PlanService planService;

	@Autowired
	private VpaymentService vpaymentService;
	
	private PlanVO plan;
	
	private VpaymentVO vpayment;
	
	private List<VpaymentVO> vpayments;
	
	@Action(value = "updatePlanForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePlanSchedule() throws FLException {

		planService.updatePlanForAdvance(plan);
		
		return SUCCESS;
	}

	@Action(value = "queryVpaymentByNo", results = {@Result (name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String queryVpaymentByNo() throws FLException{
		
		vpayments = vpaymentService.queryVpaymentByNo(vpayment);
		
		return SUCCESS;
	}
	
	public PlanVO getPlan() {
		return plan;
	}

	public void setPlan(PlanVO plan) {
		this.plan = plan;
	}

	public VpaymentVO getVpayment() {
		return vpayment;
	}

	public void setVpayment(VpaymentVO vpayment) {
		this.vpayment = vpayment;
	}

	public List<VpaymentVO> getVpayments() {
		return vpayments;
	}

	public void setVpayments(List<VpaymentVO> vpayments) {
		this.vpayments = vpayments;
	}
	
}
