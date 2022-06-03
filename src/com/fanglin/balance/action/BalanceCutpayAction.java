package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceCutpayService;
import com.fanglin.balance.vo.BalanceCutpayVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceCutpayAction extends BaseListAction {

	private static final long serialVersionUID = 4861644463792131364L;

	@Autowired
	private BalanceCutpayService balanceCutpayService;

	private BalanceCutpayVO balanceCutpay;

	private List<BalanceCutpayVO> balanceCutpays;

	@Action(value = "queryBalanceCutpay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceCutpay() throws FLException {

		balanceCutpays = balanceCutpayService.queryBalanceCutpay(balanceCutpay);

		return SUCCESS;
	}

	@Action(value = "addBalanceCutpay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBalanceCutpay() throws FLException {

		balanceCutpayService.addBalanceCutpay(balanceCutpay,queryUserId());

		return SUCCESS;
	}
	
	public BalanceCutpayVO getBalanceCutpay() {
		return balanceCutpay;
	}

	public void setBalanceCutpay(BalanceCutpayVO balanceCutpay) {
		this.balanceCutpay = balanceCutpay;
	}

	public List<BalanceCutpayVO> getBalanceCutpays() {
		return balanceCutpays;
	}

	public void setBalanceCutpays(List<BalanceCutpayVO> balanceCutpays) {
		this.balanceCutpays = balanceCutpays;
	}

}
