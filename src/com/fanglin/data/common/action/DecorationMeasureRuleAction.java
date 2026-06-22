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
import com.fanglin.data.common.service.DecorationMeasureRuleService;
import com.fanglin.data.common.vo.DecorationMeasureRuleItemVO;
import com.fanglin.data.common.vo.DecorationMeasureRuleVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationMeasureRuleAction extends BaseListAction {

	private static final long serialVersionUID = 881143796931258310L;

	@Autowired
	private DecorationMeasureRuleService decorationMeasureRuleService;

	private List<DecorationMeasureRuleVO> decorationMeasures;

	private DecorationMeasureRuleVO decorationMeasureRule;

	private List<DecorationMeasureRuleItemVO> decorationMeasureRuleItems;

	private DecorationMeasureRuleItemVO decorationMeasureRuleItem;

	@Action(value = "queryDecorationMeasureRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationMeasureRule() throws FLException {

		decorationMeasures = decorationMeasureRuleService.queryDecorationMeasureRule();

		return SUCCESS;
	}

	@Action(value = "pageDecorationMeasureRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationMeasureRule() throws FLException {

		decorationMeasureRuleService.pageDecorationMeasureRule(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "addDecorationMeasureRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationMeasureRule() throws FLException {

		decorationMeasureRuleService.addDecorationMeasureRule(decorationMeasureRule);

		return SUCCESS;
	}

	@Action(value = "updateDecorationMeasureRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationMeasureRule() throws FLException {

		decorationMeasureRuleService.updateDecorationMeasureRule(decorationMeasureRule);

		return SUCCESS;
	}

	@Action(value = "updateDecorationMeasureRuleForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationMeasureRuleForStatus() throws FLException {

		decorationMeasureRuleService.updateDecorationMeasureRuleForStatus(decorationMeasureRule);

		return SUCCESS;
	}

	@Action(value = "deleteDecorationMeasureRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDecorationMeasureRule() throws FLException {

		decorationMeasureRuleService.deleteDecorationMeasureRule(decorationMeasureRule);

		return SUCCESS;
	}

	@Action(value = "queryDecorationMeasureRuleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationMeasureRuleItem() throws FLException {

		decorationMeasureRuleItems = decorationMeasureRuleService.queryDecorationMeasureRuleItem(decorationMeasureRuleItem.getDmrid());

		return SUCCESS;
	}

	@Action(value = "addDecorationMeasureRuleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationMeasureRuleItem() throws FLException {

		decorationMeasureRuleService.addDecorationMeasureRuleItem(decorationMeasureRuleItem);

		return SUCCESS;
	}

	@Action(value = "deleteDecorationMeasureRuleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDecorationMeasureRuleItem() throws FLException {

		decorationMeasureRuleService.deleteDecorationMeasureRuleItem(decorationMeasureRuleItem);

		return SUCCESS;
	}

	public List<DecorationMeasureRuleVO> getDecorationMeasures() {
		return decorationMeasures;
	}

	public void setDecorationMeasures(List<DecorationMeasureRuleVO> decorationMeasures) {
		this.decorationMeasures = decorationMeasures;
	}

	public DecorationMeasureRuleVO getDecorationMeasureRule() {
		return decorationMeasureRule;
	}

	public void setDecorationMeasureRule(DecorationMeasureRuleVO decorationMeasureRule) {
		this.decorationMeasureRule = decorationMeasureRule;
	}

	public List<DecorationMeasureRuleItemVO> getDecorationMeasureRuleItems() {
		return decorationMeasureRuleItems;
	}

	public void setDecorationMeasureRuleItems(List<DecorationMeasureRuleItemVO> decorationMeasureRuleItems) {
		this.decorationMeasureRuleItems = decorationMeasureRuleItems;
	}

	public DecorationMeasureRuleItemVO getDecorationMeasureRuleItem() {
		return decorationMeasureRuleItem;
	}

	public void setDecorationMeasureRuleItem(DecorationMeasureRuleItemVO decorationMeasureRuleItem) {
		this.decorationMeasureRuleItem = decorationMeasureRuleItem;
	}

}
