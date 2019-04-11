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
import com.fanglin.decoration.service.DecorationActivityService;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationActivityVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationActivityAction extends BaseListAction {

	private static final long serialVersionUID = 2327633841386704953L;

	@Autowired
	private DecorationActivityService decorationActivityService;

	@Autowired
	private DecorationActivityItemService decorationActivityItemService;

	private DecorationVO decoration;

	private DecorationActivityVO decorationActivity;

	private List<DecorationActivityVO> decorationActivitys;

	private DecorationActivityItemVO decorationActivityItem;

	private List<DecorationActivityItemVO> decorationActivityItems;

	@Action(value = "queryDecorationActivityByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationActivityByOrderId() {

		decorationActivitys = decorationActivityService.queryDecorationActivityByOrderId(decorationActivity);

		return SUCCESS;
	}

	@Action(value = "queryDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationActivityItem() {

		decorationActivityItems = decorationActivityItemService.queryDecorationActivityItemByOrderId(decoration);

		return SUCCESS;
	}

	@Action(value = "queryDecorationActivityItemForCouponAVaildByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationActivityItemForCouponAVaildByOrderId() {

		decorationActivityItems = decorationActivityItemService.queryDecorationActivityItemForCouponAVaildByOrderId(decoration);

		return SUCCESS;
	}

	@Action(value = "addDecorationActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationActivity() throws FLException {

		decorationActivityService.addDecorationActivity(decorationActivity);

		return SUCCESS;
	}

	@Action(value = "deleteDecorationActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDecorationActivity() throws FLException {

		decorationActivityService.deleteDecorationActivity(decorationActivity);

		return SUCCESS;
	}
	
	@Action(value = "lockDecorationActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String lockDecorationActivity() throws FLException {

		decorationActivityService.lockDecorationActivity(decorationActivity);

		return SUCCESS;
	}
	
	@Action(value = "unlockDecorationActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unlockDecorationActivity() throws FLException {

		decorationActivityService.unlockDecorationActivity(decorationActivity);

		return SUCCESS;
	}

	@Action(value = "abateDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String abateDecorationActivityItem() throws FLException {

		decorationActivityItemService.abateDecorationActionItem(decorationActivityItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "receiveDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String receiveDecorationActivityItem() throws FLException {

		decorationActivityItemService.receiveDecorationActivityItem(decorationActivityItem, queryUserId(), queryUserName());

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
	
	@Action(value = "upgradeDecorationAtivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String upgradeDecorationAtivityItem() throws FLException {

		decorationActivityItemService.upgradeDecorationAtivityItem(decorationActivityItem, queryUserId());

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

	public DecorationActivityVO getDecorationActivity() {
		return decorationActivity;
	}

	public void setDecorationActivity(DecorationActivityVO decorationActivity) {
		this.decorationActivity = decorationActivity;
	}

	public List<DecorationActivityVO> getDecorationActivitys() {
		return decorationActivitys;
	}

	public void setDecorationActivitys(List<DecorationActivityVO> decorationActivitys) {
		this.decorationActivitys = decorationActivitys;
	}

}
