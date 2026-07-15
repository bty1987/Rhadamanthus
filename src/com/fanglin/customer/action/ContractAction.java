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
import com.fanglin.customer.service.ContractService;
import com.fanglin.customer.vo.ContractVO;

@ParentPackage("base")
@Namespace("/")
@Controller("CusContractAction")
public class ContractAction extends BaseListAction {

	private static final long serialVersionUID = -2426173446463541726L;

	@Autowired
	private ContractService contractService;

	private List<ContractVO> contracts;

	private ContractVO contract;

	@Action(value = "queryCusContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCusContract() throws FLException {

		contracts = contractService.queryCusContract(contract);

		return SUCCESS;
	}

	public List<ContractVO> getContracts() {
		return contracts;
	}

	public void setContracts(List<ContractVO> contracts) {
		this.contracts = contracts;
	}

	public ContractVO getContract() {
		return contract;
	}

	public void setContract(ContractVO contract) {
		this.contract = contract;
	}

}
