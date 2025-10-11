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
import com.fanglin.quotation.service.QeasureService;
import com.fanglin.quotation.vo.QeasureFunctionAreaVO;
import com.fanglin.quotation.vo.QeasureVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QeasureAction extends BaseListAction {

	private static final long serialVersionUID = 6572041523837798241L;

	@Autowired
	private QeasureService qeasureService;

	private List<QeasureVO> qeasures;

	private List<QeasureFunctionAreaVO> qeasureFunctionAreas;

	private QeasureVO qeasure;

	private QeasureFunctionAreaVO qeasureFunctionArea;

	@Action(value = "pageQeasure", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQeasure() throws FLException {

		qeasureService.pageQeasure(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryQeasureByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQeasureByOrderId() throws FLException {

		qeasures = qeasureService.queryQeasureByOrderId(qeasure);

		return SUCCESS;
	}

	@Action(value = "queryQeasureByQmid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQeasureBySid() throws FLException {

		qeasure = qeasureService.queryQeasureByQmid(qeasure);

		return SUCCESS;
	}

	@Action(value = "queryQeasureFunctionArea", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQeasureFunctionArea() throws FLException {

		qeasureFunctionAreas = qeasureService.queryQeasureFunctionArea(qeasureFunctionArea);

		return SUCCESS;
	}

	@Action(value = "queryQeasureFunctionAreaByQmid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQeasureFunctionAreaByQmid() throws FLException {

		qeasureFunctionArea = qeasureService.queryQeasureFunctionAreaByQmid(qeasureFunctionArea);

		return SUCCESS;
	}

	@Action(value = "makeQeasure", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeQeasure() throws FLException {

		qeasureService.makeQeasure(qeasure, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "makeQeasureFunctionArea", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeQeasureFunctionArea() throws FLException {

		qeasureService.makeQeasure(qeasure, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "handleQeasure", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String handleQeasure() throws FLException {

		qeasureService.handleQeasure(qeasure);

		return SUCCESS;
	}

	@Action(value = "handleQeasureFunctionArea", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String handleQeasureFunctionArea() throws FLException {

		qeasureService.handleQeasureFunctionArea(qeasureFunctionArea);

		return SUCCESS;
	}

	public QeasureVO getQeasure() {
		return qeasure;
	}

	public void setQeasure(QeasureVO qeasure) {
		this.qeasure = qeasure;
	}

	public List<QeasureVO> getQeasures() {
		return qeasures;
	}

	public void setQeasures(List<QeasureVO> qeasures) {
		this.qeasures = qeasures;
	}

	public List<QeasureFunctionAreaVO> getQeasureFunctionAreas() {
		return qeasureFunctionAreas;
	}

	public void setQeasureFunctionAreas(List<QeasureFunctionAreaVO> qeasureFunctionAreas) {
		this.qeasureFunctionAreas = qeasureFunctionAreas;
	}

	public QeasureFunctionAreaVO getQeasureFunctionArea() {
		return qeasureFunctionArea;
	}

	public void setQeasureFunctionArea(QeasureFunctionAreaVO qeasureFunctionArea) {
		this.qeasureFunctionArea = qeasureFunctionArea;
	}

}
