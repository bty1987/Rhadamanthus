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

import java.util.HashMap;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.DrawLineService;
import com.fanglin.construction.vo.DrawLineVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
@ParentPackage("base")
@Namespace("/")
@Controller
public class DrawLineAction extends BaseListAction{

	private static final long serialVersionUID = -5435918796969497133L;
	
	@Autowired
	private DrawLineService drawLineService;
	
	private DrawLineVO drawLine;
	
	private List<DrawLineVO> drawLines;
	
	private HashMap<String, HashMap<String, Integer>> drawLineDateCount;
	
	private String date;
	
	@Action(value = "pageDrawLineForPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDrawLineForPlan() throws FLException{
		
		getFilters().add(new Filter("status", "排队", "eq"));
		
		drawLines = drawLineService.pageDrawLine(getPaging(), getFilters(), queryCompany());
	
		return SUCCESS;
	}

	@Action(value = "pageDrawLineForAssign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDrawLineForAssign() throws FLException{
		
		getFilters().add(new Filter("status", "排队", "ne"));
		getFilters().add(new Filter("drawLineGroup", drawLine.getDrawLineGroup(), "eq"));
		
		drawLines = drawLineService.pageDrawLine(getPaging(), getFilters(), queryCompany());
	
		return SUCCESS;
	}
	
	@Action(value = "queryDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDrawLine() throws FLException{
		
		drawLines = drawLineService.queryDrawLine(getFilters(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "countDrawLineByDate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countDrawLineByDate() throws FLException{
		
		drawLineDateCount = drawLineService.countDrawLineByDate(drawLine, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "applayDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String applayDecorationOrderDrawLine() throws FLException{
		
		drawLineService.applayDrawLine(drawLine, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "resetDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String resetDrawLine() throws FLException{
		
		drawLineService.resetDrawLine(drawLine, queryCompany());
	
		return SUCCESS;
	}
	
	@Action(value = "setDrawLineForSuccess", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setDrawLineForSuccess() throws FLException{
		
		drawLine.setStatus("放线成功");
		
		drawLineService.updateDrawLineForStatus(drawLine, queryUserId(), queryCompany());
	
		return SUCCESS;
	}
	
	@Action(value = "setDrawLineForFailure", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setDrawLineForFailure() throws FLException{
		
		drawLine.setStatus("放线失败");
		
		drawLineService.updateDrawLineForStatus(drawLine, queryUserId(), queryCompany());
	
		return SUCCESS;
	}
	
	public void setDrawLine(DrawLineVO drawLine){
		this.drawLine = drawLine;
	}

	public DrawLineVO getDrawLine(){
		return drawLine;
	}

	public void setDrawLines(List<DrawLineVO> drawLines){
		this.drawLines = drawLines;
	}

	public List<DrawLineVO> getDrawLines(){
		return drawLines;
	}

	public void setDrawLineDateCount(HashMap<String, HashMap<String, Integer>> drawLineDateCount){
		this.drawLineDateCount = drawLineDateCount;
	}

	public HashMap<String, HashMap<String, Integer>> getDrawLineDateCount(){
		return drawLineDateCount;
	}

	public String getDate(){
		return date;
	}

	public void setDate(String date){
		this.date = date;
	}

}
