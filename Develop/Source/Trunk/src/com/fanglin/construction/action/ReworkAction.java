/**
 * @File Name		: ReworkAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
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

import com.fanglin.construction.service.ReworkDrawingService;
import com.fanglin.construction.service.ReworkService;
import com.fanglin.construction.vo.ReworkDrawingVO;
import com.fanglin.construction.vo.ReworkVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ReworkAction extends BaseListAction{

	private static final long serialVersionUID = -8798160217884074181L;
	
	@Autowired
	private ReworkService reworkService;
	
	@Autowired
	private ReworkDrawingService reworkDrawingService;
	
	private List<ReworkDrawingVO> reworkDrawings;
	
	private ReworkVO rework;
	
	private ReworkDrawingVO reworkDrawing;
	
	private List<String> rwIds;
	
	@Action(value = "pageReworkByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageReworkByOrderId(){
		
		reworkService.pageReworkByOrderId(getPaging(), getFilters(), rework);
		
		return SUCCESS;
	}
	
	@Action(value = "addRework", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addRework() throws FLException{
		
		rework.setCreaterId(getUserId());
		rework.setCreaterName(getUserName());
		
		reworkService.saveOrUpdateRework(rework);
		
		return SUCCESS;
	}
	
	@Action(value = "updateRework", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRework(){
		
		reworkService.updateRework(rework);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteRework", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteRework(){
		
		reworkService.deleteRework(rwIds);
		
		return SUCCESS;
	}
	
	@Action(value = "queryReworkDrawingByReworkId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryReworkDrawingByReworkId(){
		
		reworkDrawings = reworkDrawingService.queryDrawingByReworkId(reworkDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addReworkDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addReworkDrawing() throws FLException{
		
		int rwdId = reworkDrawingService.saveOrUpdateReworkDrawing(reworkDrawing, getUserName());
		reworkDrawing.setRwdId(rwdId);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteReworkDrawingById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteReworkDrawingById(){
		
		reworkDrawingService.deleteReworkDrawingById(reworkDrawing);
		
		return SUCCESS;
	}
	
	public ReworkVO getRework(){
		return rework;
	}

	public void setRework(ReworkVO rework){
		this.rework = rework;
	}

	public List<ReworkDrawingVO> getReworkDrawings(){
		return reworkDrawings;
	}

	public void setReworkDrawings(List<ReworkDrawingVO> reworkDrawings){
		this.reworkDrawings = reworkDrawings;
	}

	public ReworkDrawingVO getReworkDrawing(){
		return reworkDrawing;
	}

	public void setReworkDrawing(ReworkDrawingVO reworkDrawing){
		this.reworkDrawing = reworkDrawing;
	}

	public List<String> getRwIds(){
		return rwIds;
	}

	public void setRwIds(List<String> rwIds){
		this.rwIds = rwIds;
	}
	
}
