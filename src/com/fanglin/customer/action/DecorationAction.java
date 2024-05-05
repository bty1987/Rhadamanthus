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
import com.fanglin.customer.service.DecorationActivityService;
import com.fanglin.customer.service.DecorationHolonomyService;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.customer.vo.DecorationActivityVO;
import com.fanglin.customer.vo.DecorationHolonomyVO;
import com.fanglin.customer.vo.DecorationVO;
import com.fanglin.data.common.vo.TalkingVO;

@ParentPackage("common")
@Namespace("/")
@Controller("CusDecorationAction")
public class DecorationAction extends BaseListAction {

	private static final long serialVersionUID = 2759234043149247536L;

	@Autowired
	private DecorationService decorationOrderService;

	@Autowired
	private DecorationActivityService decorationActivityService;

	@Autowired
	private DecorationHolonomyService decorationHolonomyService;

	private DecorationActivityVO decorationActivity;

	private DecorationHolonomyVO decorationHolonomy;

	private List<DecorationVO> decorations;

	private DecorationVO decoration;

	private Object decorationObject;

	private String unionId;

	private String securityCode;

	private String verifyCode;

	private TalkingVO talking;

	private List<TalkingVO> talkings;

	@Action(value = "queryCusDecoration", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCusDecoration() throws FLException {

		decorationObject = decorationOrderService.queryCusDecoration(decoration, unionId);

		return SUCCESS;
	}

	@Action(value = "queryCusDecorationByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCusDecorationByOrderId() throws FLException {

		decoration = decorationOrderService.queryCusDecorationByOrderId(decoration);

		return SUCCESS;
	}

	@Action(value = "queryCusDecorationUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCusDecorationUser() throws FLException {

		decorationOrderService.queryCusDecorationUser(getPaging(), getFilters(), decoration);

		return SUCCESS;
	}

	@Action(value = "queryCusDecorationForDefault", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCusDecorationForDefault() throws FLException {

		decoration = decorationOrderService.queryCusDecorationForDefault(unionId);

		return SUCCESS;
	}

	@Action(value = "queryCusDecorationActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCusDecorationActivity() throws FLException {

		decorationActivity = decorationActivityService.queryCusDecorationActivity(decorationActivity);

		return SUCCESS;
	}

	@Action(value = "queryCusDecorationHolonomy", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCusDecorationHolonomy() throws FLException {

		decorationHolonomy = decorationHolonomyService.queryCusDecorationHolonomy(decorationHolonomy);

		return SUCCESS;
	}

	@Action(value = "queryCusTalking", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCusTalking() throws FLException {

		talkings = decorationOrderService.queryTalking(decoration, talking);

		return SUCCESS;
	}

	@Action(value = "vodeCusDecoration", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String vodeCusDecoration() throws FLException {

		securityCode = decorationOrderService.vodeCusDecoration(decoration);

		return SUCCESS;
	}

	@Action(value = "bindingCusDecoration", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String bindingCusDecoration() throws FLException {

		decorationOrderService.bindingCusDecoration(decoration, unionId, securityCode, verifyCode);

		return SUCCESS;
	}

	@Action(value = "updateCusDecorationForDefault", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCusDecorationForDefault() throws FLException {

		decorationOrderService.updateCusDecorationForDefault(decoration, unionId);

		return SUCCESS;
	}

	public List<DecorationVO> getDecorations() {
		return decorations;
	}

	public void setDecorations(List<DecorationVO> decorations) {
		this.decorations = decorations;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
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

	public Object getDecorationObject() {
		return decorationObject;
	}

	public void setDecorationObject(Object decorationObject) {
		this.decorationObject = decorationObject;
	}

	public DecorationActivityVO getDecorationActivity() {
		return decorationActivity;
	}

	public void setDecorationActivity(DecorationActivityVO decorationActivity) {
		this.decorationActivity = decorationActivity;
	}

	public DecorationHolonomyVO getDecorationHolonomy() {
		return decorationHolonomy;
	}

	public void setDecorationHolonomy(DecorationHolonomyVO decorationHolonomy) {
		this.decorationHolonomy = decorationHolonomy;
	}

	public List<TalkingVO> getTalkings() {
		return talkings;
	}

	public void setTalkings(List<TalkingVO> talkings) {
		this.talkings = talkings;
	}

	public TalkingVO getTalking() {
		return talking;
	}

	public void setTalking(TalkingVO talking) {
		this.talking = talking;
	}

}
