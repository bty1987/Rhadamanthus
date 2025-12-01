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
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationActivityItemAction extends BaseListAction {

	private static final long serialVersionUID = 2327633841386704953L;

	@Autowired
	private DecorationActivityItemService decorationActivityItemService;

	private DecorationActivityItemVO decorationActivityItem;

	private List<DecorationActivityItemVO> decorationActivityItems;

	private DecorationVO decoration;

	private String securityCode;

	private String verifyCode;

	private Long amount;

	@Action(value = "queryDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationActivityItem() {

		decorationActivityItems = decorationActivityItemService.queryDecorationActivityItemByOrderId(decoration);

		return SUCCESS;
	}

	@Action(value = "addDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationActivityItem() throws FLException {

		decorationActivityItemService.addDecorationActivityItem(decorationActivityItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "receiveDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String receiveDecorationActivityItem() throws FLException {

		decorationActivityItemService.receiveDecorationActivityItem(decorationActivityItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "abateDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String abateDecorationActivityItem() throws FLException {

		decorationActivityItemService.abateDecorationActivityItem(decorationActivityItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deliveDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deliveDecorationActivityItem() throws FLException {

		decorationActivityItemService.deliveDecorationActivityItem(decorationActivityItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "unrefundDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unrefundDecorationActivityItem() throws FLException {

		decorationActivityItemService.unrefundDecorationActivityItem(decorationActivityItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "refundDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundDecorationActivityItem() throws FLException {

		decorationActivityItemService.refundDecorationActivityItem(decorationActivityItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "expendDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String expendDecorationActivityItem() throws FLException {

		decorationActivityItemService.expendDecorationActivityItem(decorationActivityItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "discountDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String discountDecorationActivityItem() throws FLException {

		decorationActivityItemService.discountDecorationActivityItem(decorationActivityItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "amountDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountDecorationActivityItem() throws FLException {

		decorationActivityItemService.amountDecorationActivityItem(decoration, queryUserId());

		return SUCCESS;
	}

	@Action(value = "sendDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendDecorationActivityItem() throws FLException {

		decorationActivityItemService.sendDecorationActivityItem(decorationActivityItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "affirmDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affirmAddReduce() throws FLException {

		decorationActivityItemService.affirmDecorationActivityItem(decoration, decorationActivityItems, securityCode, verifyCode);

		return SUCCESS;
	}

	@Action(value = "pointDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pointDecorationActivityItem() throws FLException {

		amount = decorationActivityItemService.pointDecorationActivityItem(decoration, queryUserId());

		return SUCCESS;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
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

	public String getSecurityCode() {
		return securityCode;
	}

	public void setSecurityCode(String securityCode) {
		this.securityCode = securityCode;
	}

	public String getVerifyCode() {
		return verifyCode;
	}

	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}

}
