package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.decoration.service.DecorationContractService;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationContractAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548111L;

	private DecorationContractVO decorationContract;

	private List<DecorationContractVO> decorationContracts;

	private DecorationVO decoration;

	private String decorationOrderId;

	private CustomerVO customer;

	private SignetVO signet;

	private String redirect;

	private String data;

	private String table;

	@Autowired
	private DecorationContractService decorationContractService;

	@Action(value = "queryDecorationContractByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationContractByOrderId() throws FLException {

		decorationContracts = decorationContractService.queryDecorationContractByOrderId(decorationContract);

		return SUCCESS;
	}

	@Action(value = "sendDecorationContractForAuth", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendDecorationContractForAuth() throws FLException {

		decorationContractService.sendDecorationContractForAuth(decorationContract);

		return SUCCESS;
	}

	@Action(value = "addDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationContract() throws FLException {

		decorationContractService.addDecorationContract(decorationContract, data, table, queryUserId());

		return SUCCESS;
	}

	@Action(value = "signDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signDecorationContract() throws FLException {

		decorationContractService.signDecorationContract(decorationContract, authentication());

		return SUCCESS;
	}

	@Action(value = "resignDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String resignDecorationContract() throws FLException {

		decorationContractService.resignDecorationContract(decorationContract, queryUserId());

		return SUCCESS;
	}

	@Action(value = "presignDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String presignDecorationContract() throws FLException {

		decorationContractService.presignDecorationContract(decoration, queryUserId());

		return SUCCESS;
	}

	@Action(value = "signDecorationContractForCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signDecorationContractForCompany() throws FLException {

		redirect = decorationContractService.signDecorationContractForCompany(signet, decorationContract);

		return SUCCESS;
	}

	@Action(value = "signDecorationContractForCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signDecorationContractForCustomer() throws FLException {

		redirect = decorationContractService.signDecorationContractForCustomer(decorationContract, customer);

		return SUCCESS;
	}

	@Action(value = "affixDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affixDecorationContract() throws FLException {

		decorationContractService.affixDecorationContract(decorationContract, queryUserId());

		return SUCCESS;
	}

	@Action(value = "expireDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String expireDecorationContract() throws FLException {

		decorationContractService.expireDecorationContract(decorationContract);

		return SUCCESS;
	}

	@Action(value = "viewDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String viewDecorationContract() throws FLException {

		redirect = decorationContractService.viewDecorationContract(decorationContract);

		return SUCCESS;
	}

	@Action(value = "filingDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String filingDecorationContract() throws FLException {

		decorationContractService.filingDecorationContract(decorationContract, queryUserId());

		return SUCCESS;
	}

	@Action(value = "sendDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendDecorationContract() throws FLException {

		decorationContractService.sendDecorationContract(decorationContract);

		return SUCCESS;
	}

	public String getDecorationOrderId() {
		return decorationOrderId;
	}

	public void setDecorationOrderId(String decorationOrderId) {
		this.decorationOrderId = decorationOrderId;
	}

	public void setDecorationContract(DecorationContractVO decorationContract) {
		this.decorationContract = decorationContract;
	}

	public DecorationContractVO getDecorationContract() {
		return decorationContract;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public List<DecorationContractVO> getDecorationContracts() {
		return decorationContracts;
	}

	public void setDecorationContracts(List<DecorationContractVO> decorationContracts) {
		this.decorationContracts = decorationContracts;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public String getRedirect() {
		return redirect;
	}

	public void setRedirect(String redirect) {
		this.redirect = redirect;
	}

	public SignetVO getSignet() {
		return signet;
	}

	public void setSignet(SignetVO signet) {
		this.signet = signet;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getTable() {
		return table;
	}

	public void setTable(String table) {
		this.table = table;
	}
}
