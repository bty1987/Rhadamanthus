package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.ContractService;
import com.fanglin.communion.vo.ContractVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ContractAction extends BaseListAction {
	
	private static final long serialVersionUID = 1863345894818194334L;
	
	@Autowired
	private ContractService contractService;
	
	private List<ContractVO> contracts;
	
	private ContractVO contract;
	
	@Action(value = "pageContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageContract() throws FLException {

		contractService.pageContract(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "queryContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryContract() throws FLException {

		contracts = contractService.queryContract();

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
