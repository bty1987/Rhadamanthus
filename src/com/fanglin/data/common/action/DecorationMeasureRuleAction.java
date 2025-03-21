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
import com.fanglin.data.common.vo.DecorationMeasureRuleVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationMeasureRuleAction extends BaseListAction {

	private static final long serialVersionUID = 881143796931258310L;

	@Autowired
	private DecorationMeasureRuleService decorationMeasureRuleService;

	private List<DecorationMeasureRuleVO> decorationMeasures;

	@Action(value = "queryDecorationMeasureRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationMeasureRule() throws FLException {

		decorationMeasures = decorationMeasureRuleService.queryDecorationMeasureRule();

		return SUCCESS;
	}

	public List<DecorationMeasureRuleVO> getDecorationMeasures() {
		return decorationMeasures;
	}

	public void setDecorationMeasures(
			List<DecorationMeasureRuleVO> decorationMeasures) {
		this.decorationMeasures = decorationMeasures;
	}

}
