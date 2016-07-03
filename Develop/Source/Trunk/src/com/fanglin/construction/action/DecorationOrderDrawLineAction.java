/**
 * @File Name		: DrawLine.java
 * @Package   	: com.fanglin.action.order
 * @Version		: 1.0
 * @Date			: 2014-8-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.DecorationOrderDrawLineService;
import com.fanglin.construction.vo.DecorationOrderDrawLineVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationOrderDrawLineAction extends BaseListAction{

	private static final long serialVersionUID = -5435918796969497133L;
	
	@Autowired
	private DecorationOrderDrawLineService decorationOrderDrawLineService;
	
	private DecorationOrderDrawLineVO drawLine;
	
	private List<DecorationOrderDrawLineVO> drawLines;
	
	private HashMap<String, HashMap<String, Integer>> drawLineDateCount;
	
	private String date;
	
	@Action(value = "pageDecorationOrderByPersonInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderByPersonInfo(){
		
		decorationOrderDrawLineService.pageDecorationOrderByPersonInfo(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "pageDecorationOrderDrawLineForPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderDrawLineForPlan(){
		
		List<FilterVO> _filters = new ArrayList<FilterVO>();
		
		_filters.add(new FilterVO("status", "排队", "eq"));
		
		if(getFilters() != null){
			_filters.addAll(getFilters());
		}
		
		drawLines = decorationOrderDrawLineService.pageDecorationOrderDrawLine(getPaging(), _filters);
	
		return SUCCESS;
	}

	@Action(value = "pageDecorationOrderDrawLineForAssign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderDrawLineForAssign(){
		
		List<FilterVO> _filters = new ArrayList<FilterVO>();
		
		_filters.add(new FilterVO("status", "排队", "ne"));
		_filters.add(new FilterVO("drawLineGroup", drawLine.getDrawLineGroup(), "eq"));
		
		if(getFilters() != null){
			_filters.addAll(getFilters());
		}
		
		drawLines = decorationOrderDrawLineService.pageDecorationOrderDrawLine(getPaging(), _filters);
	
		return SUCCESS;
	}
	
	@Action(value = "queryDecorationOrderDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationOrderDrawLine(){
		
		drawLines = decorationOrderDrawLineService.queryDecorationOrderDrawLine(getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDecorationOrderDrawLineForCountByDate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationOrderDrawLineForCountByDate(){
		
		drawLineDateCount = decorationOrderDrawLineService.queryDecorationOrderDrawLineForCountByDate(drawLine);
		
		return SUCCESS;
	}
	
	@Action(value = "saveDecorationOrderDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String saveDecorationOrderDrawLine() throws FLException{
		
		decorationOrderDrawLineService.editDecorationOrderDrawLine(drawLine);
	
		return SUCCESS;
	}
	
	@Action(value = "applayDecorationOrderDrawLine", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String applayDecorationOrderDrawLine() throws FLException{
		
		drawLine.setApplayUserId(getUserId());
		
		decorationOrderDrawLineService.applayDecorationOrderDrawLine(drawLine);
		
		return SUCCESS;
	}
	
	@Action(value = "drawLineForSuccess", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String drawLineForSuccess() throws FLException{
		
		drawLine.setStatus("放线成功");
		
		decorationOrderDrawLineService.saveDecorationOrderDrawLineForStatus(drawLine, getUserId());
	
		return SUCCESS;
	}
	
	@Action(value = "drawLineForFailure", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String drawLinesForFailure() throws FLException{
		
		drawLine.setStatus("放线失败");
		
		decorationOrderDrawLineService.saveDecorationOrderDrawLineForStatus(drawLine, getUserId());
	
		return SUCCESS;
	}
	
	public void setDrawLine(DecorationOrderDrawLineVO drawLine){
		this.drawLine = drawLine;
	}

	public DecorationOrderDrawLineVO getDrawLine(){
		return drawLine;
	}

	public void setDrawLines(List<DecorationOrderDrawLineVO> drawLines){
		this.drawLines = drawLines;
	}

	public List<DecorationOrderDrawLineVO> getDrawLines(){
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
