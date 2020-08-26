package com.fanglin.customer.action;


import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.RepairpayService;
import com.fanglin.customer.vo.RepairpayVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RepairpayAction extends BaseListAction {

	private static final long serialVersionUID = 7713045696666245028L;

	@Autowired
	private RepairpayService repairpayService;
	
	private List<RepairpayVO> repairpays;
	
	private RepairpayVO repairpay;
	
	@Action(value = "queryRepairpay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRepairpay() throws FLException {

		repairpays = repairpayService.queryRepairpay(repairpay);

		return SUCCESS;
	}
	
	@Action(value = "addRepairpay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addRepairpay() throws FLException {

		repairpayService.addRepairpay(repairpay, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "deleteRepairpay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteRepairpay() throws FLException {

		repairpayService.deleteRepairpay(repairpay);

		return SUCCESS;
	}

	public List<RepairpayVO> getRepairpays() {
		return repairpays;
	}

	public void setRepairpays(List<RepairpayVO> repairpays) {
		this.repairpays = repairpays;
	}

	public RepairpayVO getRepairpay() {
		return repairpay;
	}

	public void setRepairpay(RepairpayVO repairpay) {
		this.repairpay = repairpay;
	}
}
