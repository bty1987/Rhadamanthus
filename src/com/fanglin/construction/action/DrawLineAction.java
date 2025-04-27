/**
 * @File Name	: DrawLine.java
 * @Package   	: com.fanglin.action.order
 * @Version		: 1.0
 * @Date		: 2014-8-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.po.DrawLinePO;
import com.fanglin.construction.service.DrawLineService;
import com.fanglin.construction.vo.DrawLineVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ConstructionNodeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DrawLineAction extends BaseListAction {

	private static final long serialVersionUID = 8955425553415726162L;

	@Autowired
	private DrawLineService drawLineService;

	private DrawLineVO drawLine;

	private List<DrawLineVO> drawLines;

	private List<?> count;

	private List<ConstructionNodeVO> constructionNodes;

	@Action(value = "pageDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDrawLine() throws FLException {

		drawLines = drawLineService.pageDrawLine(getPaging(), getFilters(), drawLine, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDrawLine() throws FLException {

		drawLines = drawLineService.queryDrawLine(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "countDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countDrawLine() throws FLException {

		count = drawLineService.countDrawLine(drawLine, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDrawLine() throws FLException {

		drawLineService.updateDrawLine(drawLine);

		return SUCCESS;
	}

	@Action(value = "applayDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String applayDecorationOrderDrawLine() throws FLException {

		drawLineService.applayDrawLine(drawLine, queryUserId());

		return SUCCESS;
	}

	@Action(value = "resetDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String resetDrawLine() throws FLException {

		drawLineService.resetDrawLine(drawLine);

		return SUCCESS;
	}

	@Action(value = "pretreatDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pretreatDrawLine() throws FLException {

		drawLineService.pretreatDrawLine(drawLine, constructionNodes, queryUserId());

		return SUCCESS;
	}

	@Action(value = "successDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String successDrawLine() throws FLException {

		drawLine.setStatus(DrawLinePO.STATUS_SUCCESS_INT);

		drawLineService.successDrawLine(drawLine, constructionNodes, queryUserId());

		return SUCCESS;
	}

	@Action(value = "failureDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String failureDrawLine() throws FLException {

		drawLine.setStatus(DrawLinePO.STATUS_FAIL_INT);

		drawLineService.failureDrawLine(drawLine, queryUserId());

		return SUCCESS;
	}

	public void setDrawLine(DrawLineVO drawLine) {
		this.drawLine = drawLine;
	}

	public DrawLineVO getDrawLine() {
		return drawLine;
	}

	public void setDrawLines(List<DrawLineVO> drawLines) {
		this.drawLines = drawLines;
	}

	public List<DrawLineVO> getDrawLines() {
		return drawLines;
	}

	public List<?> getCount() {
		return count;
	}

	public void setCount(List<?> count) {
		this.count = count;
	}

	public List<ConstructionNodeVO> getConstructionNodes() {
		return constructionNodes;
	}

	public void setConstructionNodes(List<ConstructionNodeVO> constructionNodes) {
		this.constructionNodes = constructionNodes;
	}

}
