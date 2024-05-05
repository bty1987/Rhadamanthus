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
import com.fanglin.data.common.service.DecorationMeasureService;
import com.fanglin.data.common.vo.DecorationMeasureVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationMeasureAction extends BaseListAction {

	private static final long serialVersionUID = 881143796931258310L;

	@Autowired
	private DecorationMeasureService decorationMeasureService;

	private List<DecorationMeasureVO> decorationMeasures;

	@Action(value = "queryDecorationMeasure", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationMeasure() throws FLException {

		decorationMeasures = decorationMeasureService.queryDecorationMeasure();

		return SUCCESS;
	}

	public List<DecorationMeasureVO> getDecorationMeasures() {
		return decorationMeasures;
	}

	public void setDecorationMeasures(List<DecorationMeasureVO> decorationMeasures) {
		this.decorationMeasures = decorationMeasures;
	}

}
