package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.ContractService;
import com.fanglin.data.common.vo.ContractVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ContractAction extends BaseListAction {

	private static final long serialVersionUID = 1863345894818194334L;

	@Autowired
	private ContractService contractService;

	private List<ContractVO> contracts;

	private ContractVO contract;

	private int count;

	@Action(value = "pageContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageContract() throws FLException {

		contractService.pageContract(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryContract() throws FLException {

		contracts = contractService.queryContract(contract, queryCompany());

		return SUCCESS;
	}

	@Action(value = "countContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String contractCount() throws FLException {

		count = contractService.countContract(queryCompany());

		return SUCCESS;
	}

	@Action(value = "addContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addContract() throws FLException {

		contractService.addContract(contract, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateContract() throws FLException {

		contractService.updateContract(contract);

		return SUCCESS;
	}

	@Action(value = "updateContractForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateContractForStatus() throws FLException {

		contractService.updateContractForStatus(contract);

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

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

}
