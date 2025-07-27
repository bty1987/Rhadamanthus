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

	private DecorationVO decoration;

	private DecorationActivityVO decorationActivity;

	private List<DecorationActivityVO> decorationActivitys;

	private DecorationActivityItemVO decorationActivityItem;

	@Action(value = "queryDecorationActivityByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationActivityByOrderId() {

		decorationActivitys = decorationActivityService.queryDecorationActivityByOrderId(decorationActivity);

		return SUCCESS;
	}

	@Action(value = "amountDecorationActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountDecorationActivity() throws FLException {

		decorationActivity = decorationActivityService.amountDecorationActivity(decorationActivity, decorationActivityItem);

		return SUCCESS;
	}

	@Action(value = "addDecorationActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationActivity() throws FLException {

		decorationActivityService.addDecorationActivity(decorationActivity, queryUserId());

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
