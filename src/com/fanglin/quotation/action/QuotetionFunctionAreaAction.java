package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotetionFunctionAreaService;
import com.fanglin.quotation.vo.QuotetionFunctionAreaParamVO;
import com.fanglin.quotation.vo.QuotetionFunctionAreaVO;
import com.fanglin.quotation.vo.QuotetionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotetionFunctionAreaAction extends BaseListAction {

	private static final long serialVersionUID = 5584087022561687817L;

	@Autowired
	private QuotetionFunctionAreaService quotetionFunctionAreaService;

	private QuotetionVO quotetion;

	private List<QuotetionFunctionAreaVO> quotetionFunctionAreas;

	private QuotetionFunctionAreaVO quotetionFunctionArea;

	private List<Long> functionAreaIds;

	// 创建功能区时的参数列表
	private List<QuotetionFunctionAreaParamVO> functionAreaParams;

	@Action(value = "queryQuotetionFunctionAreaByQid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotetionFunctionAreaByQid() throws FLException {

		quotetionFunctionAreas = quotetionFunctionAreaService.queryQuotetionFunctionAreaByQid(quotetion);

		return SUCCESS;
	}

	@Action(value = "addQuotetionFuctionArea", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotetionFuctionArea() throws FLException {

		quotetionFunctionAreas = quotetionFunctionAreaService.addQuotetionFuctionArea(quotetionFunctionAreas, quotetion);

		return SUCCESS;
	}

	@Action(value = "updateQuotetionFunctionArea", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotetionFunctionArea() throws FLException {

		quotetionFunctionAreaService.updateQuotetionFunctionArea(quotetionFunctionArea, quotetion);

		return SUCCESS;
	}

	@Action(value = "deleteQuotetionFunctionArea", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotetionFunctionArea() throws FLException {

		quotetionFunctionAreaService.deleteQuotetionFunctionArea(quotetionFunctionArea, quotetion);

		return SUCCESS;
	}

	@Action(value = "copyQuotetionFunctionArea", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String copyQuotetionFunctionArea() throws FLException {

		quotetionFunctionAreaService.copyQuotetionFunctionArea(quotetionFunctionArea, quotetion);

		return SUCCESS;
	}

	public QuotetionVO getQuotetion() {
		return quotetion;
	}

	public void setQuotetion(QuotetionVO quotetion) {
		this.quotetion = quotetion;
	}

	public List<QuotetionFunctionAreaVO> getQuotetionFunctionAreas() {
		return quotetionFunctionAreas;
	}

	public void setQuotetionFunctionAreas(List<QuotetionFunctionAreaVO> quotetionFunctionAreas) {
		this.quotetionFunctionAreas = quotetionFunctionAreas;
	}

	public QuotetionFunctionAreaVO getQuotetionFunctionArea() {
		return quotetionFunctionArea;
	}

	public void setQuotetionFunctionArea(QuotetionFunctionAreaVO quotetionFunctionArea) {
		this.quotetionFunctionArea = quotetionFunctionArea;
	}

	public List<Long> getFunctionAreaIds() {
		return functionAreaIds;
	}

	public void setFunctionAreaIds(List<Long> functionAreaIds) {
		this.functionAreaIds = functionAreaIds;
	}

	public List<QuotetionFunctionAreaParamVO> getFunctionAreaParams() {
		return functionAreaParams;
	}

	public void setFunctionAreaParams(List<QuotetionFunctionAreaParamVO> functionAreaParams) {
		this.functionAreaParams = functionAreaParams;
	}

}
