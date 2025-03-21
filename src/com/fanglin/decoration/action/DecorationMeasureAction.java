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
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.decoration.po.DecorationMeasurePO;
import com.fanglin.decoration.service.DecorationMeasureService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.decoration.vo.DecorationMeasureVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationMeasureAction extends BaseListAction{

	private static final long serialVersionUID = 4776041931383364606L;
	
	@Autowired
	private DecorationMeasureService decorationMeasureService;

	private DecorationMeasureVO decorationMeasure;
	
	private List<DecorationMeasureVO> decorationMeasures;
	
	private DecorationVO decoration;
	
	private List<ConstructionNodeVO> constructionNodes;

	@Action(value = "pageDecorationMeasure", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationMeasure() throws FLException{

		decorationMeasureService.pageDecorationMeasure(getPaging(), getFilters(),decorationMeasure, queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationMeasureForApplay", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationMeasureForApplay() throws FLException{

		decorationMeasureService.pageDecorationMeasureForApplay(getPaging(), getFilters(),decorationMeasure, queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "sendDecorationMeasure", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendDecorationMeasure() throws FLException {

		decorationMeasureService.sendDecorationMeasure(decorationMeasure);

		return SUCCESS;
	}
	
	@Action(value = "confirmDecorationMeasure", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmDecorationMeasure() throws FLException {

		decorationMeasureService.confirmDecorationMeasure(decoration, decorationMeasure);

		return SUCCESS;
	}
	
	@Action(value = "successDecorationMeasure", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String successDecorationMeasure() throws FLException {

		decorationMeasure.setStatus(DecorationMeasurePO.STATUS_SUCCESS_INT);

		decorationMeasureService.successDecorationMeasure(decorationMeasure, constructionNodes, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "failureDecorationMeasure", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String failureDecorationMeasure() throws FLException {

		decorationMeasure.setStatus(DecorationMeasurePO.STATUS_FAIL_INT);

		decorationMeasureService.failureDecorationMeasure(decorationMeasure, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "updateDecorationMeasure", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDrawLine() throws FLException {

		decorationMeasureService.updateDecorationMeasure(decorationMeasure);

		return SUCCESS;
	}
	
	@Action(value = "applayDecorationMeasure", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String resetDrawLine() throws FLException {

		decorationMeasureService.applayDecorationMeasure(decorationMeasure);

		return SUCCESS;
	}

	public DecorationMeasureVO getDecorationMeasure() {
		return decorationMeasure;
	}

	public void setDecorationMeasure(DecorationMeasureVO decorationMeasure) {
		this.decorationMeasure = decorationMeasure;
	}

	public List<DecorationMeasureVO> getDecorationMeasures() {
		return decorationMeasures;
	}

	public void setDecorationMeasures(List<DecorationMeasureVO> decorationMeasures) {
		this.decorationMeasures = decorationMeasures;
	}
	
	public List<ConstructionNodeVO> getConstructionNodes() {
		return constructionNodes;
	}

	public void setConstructionNodes(List<ConstructionNodeVO> constructionNodes) {
		this.constructionNodes = constructionNodes;
	}
	
	
}
