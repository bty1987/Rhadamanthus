package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceDetailService;
import com.fanglin.balance.vo.BalanceDetailVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceDetailAction extends BaseListAction {

	private static final long serialVersionUID = 4493385608040589247L;

	@Autowired
	private BalanceDetailService balanceDetailService;
	
	private BalanceDetailVO balanceDetail;
	
	private List<BalanceDetailVO> balanceDetails;
	
	@Action(value = "queryBalanceDetailForBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceDetailForBalance() throws FLException {

		balanceDetails = balanceDetailService.queryBalanceDetailForBalance(balanceDetail);

		return SUCCESS;
	}
	

	public BalanceDetailVO getBalanceDetail() {
		return balanceDetail;
	}

	public void setBalanceDetail(BalanceDetailVO balanceDetail) {
		this.balanceDetail = balanceDetail;
	}

	public List<BalanceDetailVO> getBalanceDetails() {
		return balanceDetails;
	}

	public void setBalanceDetails(List<BalanceDetailVO> balanceDetails) {
		this.balanceDetails = balanceDetails;
	}
}
