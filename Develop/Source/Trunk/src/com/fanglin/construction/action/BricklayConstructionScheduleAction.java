/**
 * @File Name		: BricklayConstructionScheduleAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-29
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

import com.fanglin.construction.service.BricklayConstructionScheduleService;
import com.fanglin.construction.service.BricklayDrawingService;
import com.fanglin.construction.vo.BricklayConstructionScheduleVO;
import com.fanglin.construction.vo.BricklayDrawingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BricklayConstructionScheduleAction extends BaseListAction{

	private static final long serialVersionUID = 1830437899502700213L;
	
	@Autowired
	private BricklayConstructionScheduleService bricklayConstructionScheduleService;
	
	@Autowired
	private BricklayDrawingService bricklayDrawingService;
	
	private BricklayConstructionScheduleVO bricklayConstructionSchedule;
	
	private BricklayDrawingVO bricklayDrawing;
	
	private List<BricklayDrawingVO> bricklayDrawings;
	
	private List<String> drawingUrls;
	
	@Action(value = "queryBricklayConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBricklayConstructionScheduleByOrderId(){
		
		bricklayConstructionSchedule = bricklayConstructionScheduleService.queryBricklayConstructionScheduleByOrderId(bricklayConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "updateBricklayConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBricklayConstructionSchedule(){
		
		bricklayConstructionScheduleService.saveOrUpdateBricklayConstructionSchedule(bricklayConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setBricklayConstructionScheduleForTimeFlag", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setBricklayConstructionScheduleForTimeFlag(){
		
		bricklayConstructionScheduleService.setBricklayConstructionScheduleForTimeFlag(bricklayConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setBricklayConstructionScheduleForInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setBricklayConstructionScheduleForInfo(){
		
		bricklayConstructionScheduleService.setBricklayConstructionScheduleForInfo(bricklayConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "queryBricklayDrawingByCsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBricklayDrawingByCsId(){
		
		bricklayDrawings = bricklayDrawingService.queryBricklayDrawingByCsId(bricklayDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "queryBricklayDrawingByBcsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBricklayDrawingByBcsId(){
		
		bricklayDrawings = bricklayDrawingService.queryBricklayDrawingByBcsdId(bricklayDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addBricklayDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBricklayDrawing() throws FLException{
		
		bricklayDrawingService.saveOrUpdateBricklayDrawing(bricklayDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addBricklayDrawings", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBricklayDrawings() throws FLException{
		
		bricklayDrawings = bricklayDrawingService.addbrBricklayDrawings(bricklayDrawing, drawingUrls);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteBricklayDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBricklayDrawing(){
		
		bricklayDrawingService.deleteBrickLayDrawingByBdId(bricklayDrawing);
		
		return SUCCESS;
	}

	public BricklayConstructionScheduleVO getBricklayConstructionSchedule(){
		return bricklayConstructionSchedule;
	}

	public void setBricklayConstructionSchedule(BricklayConstructionScheduleVO bricklayConstructionSchedule){
		this.bricklayConstructionSchedule = bricklayConstructionSchedule;
	}

	public BricklayDrawingVO getBricklayDrawing(){
		return bricklayDrawing;
	}

	public void setBricklayDrawing(BricklayDrawingVO bricklayDrawing){
		this.bricklayDrawing = bricklayDrawing;
	}

	public List<BricklayDrawingVO> getBricklayDrawings(){
		return bricklayDrawings;
	}

	public void setBricklayDrawings(List<BricklayDrawingVO> bricklayDrawings){
		this.bricklayDrawings = bricklayDrawings;
	}

	public List<String> getDrawingUrls() {
		return drawingUrls;
	}

	public void setDrawingUrls(List<String> drawingUrls) {
		this.drawingUrls = drawingUrls;
	}
	
}
