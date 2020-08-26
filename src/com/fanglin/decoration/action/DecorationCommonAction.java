package com.fanglin.decoration.action;


import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.CustomerService;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.service.DecorationContractService;
import com.fanglin.decoration.service.DecorationInfoService;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class DecorationCommonAction extends BaseListAction {

	private static final long serialVersionUID = 1619707140383979773L;

	@Autowired
	private CustomerService customerService;
	
	@Autowired
	private DecorationInfoService decorationInfoService;
	
	@Autowired
	private DecorationAdditionService decorationAdditionService;
	
	@Autowired
	private DecorationContractService decorationContractService;

	private CustomerVO customer;

	private DecorationVO decoration;
	
	private DecorationInfoVO decorationInfo;
	
	private DecorationContractVO decorationContract;
	
	private String imgbase;
	
	private short result;
	
	private String orderId;
	
	private String redirect;

	@Action(value = "signateCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signateCustomer() throws FLException {

		customerService.signateCustomer(customer, imgbase);

		return "success";
	}
	
	@Action(value = "confirmDecorationInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmDecorationInfo() throws FLException {

		decorationInfoService.confirmDecorationInfo(decorationInfo, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "queryDecorationSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationProcess() throws FLException {

		result = decorationAdditionService.queryDecorationSchedule(decoration);

		return SUCCESS;
	}
	
	@Action(value = "redirectDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String redirectDecorationContract() throws FLException {

		redirect = decorationContractService.redirectDecorationContract(decorationContract);

		return SUCCESS;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public DecorationInfoVO getDecorationInfo() {
		return decorationInfo;
	}

	public void setDecorationInfo(DecorationInfoVO decorationInfo) {
		this.decorationInfo = decorationInfo;
	}

	public DecorationContractVO getDecorationContract() {
		return decorationContract;
	}

	public void setDecorationContract(DecorationContractVO decorationContract) {
		this.decorationContract = decorationContract;
	}

	public String getImgbase() {
		return imgbase;
	}

	public void setImgbase(String imgbase) {
		this.imgbase = imgbase;
	}

	public short getResult() {
		return result;
	}

	public void setResult(short result) {
		this.result = result;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getRedirect() {
		return redirect;
	}

	public void setRedirect(String redirect) {
		this.redirect = redirect;
	}
	
}
