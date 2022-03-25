package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationActivityItemService;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.service.DecorationContractService;
import com.fanglin.decoration.service.DecorationInfoService;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class DecorationCommonAction extends BaseListAction {

	private static final long serialVersionUID = 1619707140383979773L;

	@Autowired
	private DecorationInfoService decorationInfoService;

	@Autowired
	private DecorationAdditionService decorationAdditionService;

	@Autowired
	private DecorationContractService decorationContractService;

	@Autowired
	private DecorationActivityItemService decorationActivityItemService;

	private DecorationVO decoration;

	private DecorationInfoVO decorationInfo;

	private List<DecorationContractVO> decorationContracts;

	private DecorationContractVO decorationContract;

	private DecorationActivityItemVO decorationActivityItem;

	private List<DecorationActivityItemVO> decorationActivityItems;

	private short result;

	private String orderId;

	private String redirect;

	@Action(value = "queryDecorationSchedule", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String queryDecorationProcess() throws FLException {

		result = decorationAdditionService.queryDecorationSchedule(decoration);

		return SUCCESS;
	}

	@Action(value = "queryDecorationContract", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String queryDecorationContract() throws FLException {

		decorationContracts = decorationContractService.queryDecorationContractByOrderId(decorationContract);

		return SUCCESS;
	}

	@Action(value = "confirmDecorationInfo", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String confirmDecorationInfo() throws FLException {

		decorationInfoService.confirmDecorationInfo(decorationInfo, queryUserId());

		return SUCCESS;
	}

	@Action(value = "redirectDecorationContract", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String redirectDecorationContract() throws FLException {

		redirect = decorationContractService.redirectDecorationContract(decorationContract);

		return SUCCESS;
	}

	@Action(value = "affirmDecorationActivityItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String affirmAddReduce() throws FLException {

		decorationActivityItemService.affirmDecorationActivityItem(decorationActivityItems);

		return SUCCESS;
	}

	@Action(value = "sendDecorationActivityItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String sendAddReduce() throws FLException {

		decorationActivityItemService.sendDecorationActivityItem(decorationActivityItem);

		return SUCCESS;
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

	public List<DecorationContractVO> getDecorationContracts() {
		return decorationContracts;
	}

	public void setDecorationContracts(List<DecorationContractVO> decorationContracts) {
		this.decorationContracts = decorationContracts;
	}

	public DecorationContractVO getDecorationContract() {
		return decorationContract;
	}

	public void setDecorationContract(DecorationContractVO decorationContract) {
		this.decorationContract = decorationContract;
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

	public DecorationActivityItemVO getDecorationActivityItem() {
		return decorationActivityItem;
	}

	public void setDecorationActivityItem(DecorationActivityItemVO decorationActivityItem) {
		this.decorationActivityItem = decorationActivityItem;
	}

	public List<DecorationActivityItemVO> getDecorationActivityItems() {
		return decorationActivityItems;
	}

	public void setDecorationActivityItems(List<DecorationActivityItemVO> decorationActivityItems) {
		this.decorationActivityItems = decorationActivityItems;
	}

}
