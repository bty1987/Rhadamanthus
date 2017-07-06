/**
 * @File Name		: CarpentConstructionScheduleAction.java
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

import com.fanglin.construction.service.CarpentConstructionScheduleService;
import com.fanglin.construction.service.CarpentDrawingService;
import com.fanglin.construction.vo.CarpentConstructionScheduleVO;
import com.fanglin.construction.vo.CarpentDrawingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CarpentConstructionScheduleAction extends BaseListAction{

	private static final long serialVersionUID = 1830437899502700213L;
	
	@Autowired
	private CarpentConstructionScheduleService carpentConstructionScheduleService;
	
	@Autowired
	private CarpentDrawingService carpentDrawingService;
	
	private CarpentConstructionScheduleVO carpentConstructionSchedule;
	
	private CarpentDrawingVO carpentDrawing;
	
	private List<CarpentDrawingVO> carpentDrawings;
	
	private List<String> drawingUrls;
	
	@Action(value = "queryCarpentConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCarpentConstructionScheduleByOrderId(){
		
		carpentConstructionSchedule = carpentConstructionScheduleService.queryCarpentConstructionScheduleByOrderId(carpentConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setCarpentConstructionScheduleForTimeFlag", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setCarpentConstructionScheduleForTimeFlag(){
		
		carpentConstructionScheduleService.setCarpentConstructionScheduleForTimeFlag(carpentConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setCarpentConstructionScheduleForInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setCarpentConstructionScheduleForInfo(){
		
		carpentConstructionScheduleService.setCarpentConstructionScheduleForInfo(carpentConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCarpentDrawingByCsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCarpentDrawingByCsId(){
		
		carpentDrawings = carpentDrawingService.queryCarpentDrawingByCsId(carpentDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCarpentDrawingByCcsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCarpentDrawingByCcsId(){
		
		carpentDrawings = carpentDrawingService.queryCarpentDrawingByCcsId(carpentDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addCarpentDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCarpentDrawing() throws FLException{
		
		carpentDrawingService.saveOrUpdateCarpentDrawing(carpentDrawing, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "addCarpentDrawings", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCarpentDrawings() throws FLException{
		
		carpentDrawings = carpentDrawingService.addCarpentDrawings(carpentDrawing, drawingUrls, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "deleteCarpentDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCarpentDrawing(){
		
		carpentDrawingService.deleteCarpentDrawingByCdId(carpentDrawing);
		
		return SUCCESS;
	}

	public CarpentConstructionScheduleVO getCarpentConstructionSchedule(){
		return carpentConstructionSchedule;
	}

	public void setCarpentConstructionSchedule(CarpentConstructionScheduleVO carpentConstructionSchedule){
		this.carpentConstructionSchedule = carpentConstructionSchedule;
	}

	public CarpentDrawingVO getCarpentDrawing(){
		return carpentDrawing;
	}

	public void setCarpentDrawing(CarpentDrawingVO carpentDrawing){
		this.carpentDrawing = carpentDrawing;
	}

	public List<CarpentDrawingVO> getCarpentDrawings(){
		return carpentDrawings;
	}

	public void setCarpentDrawings(List<CarpentDrawingVO> carpentDrawings){
		this.carpentDrawings = carpentDrawings;
	}

	public List<String> getDrawingUrls() {
		return drawingUrls;
	}

	public void setDrawingUrls(List<String> drawingUrls) {
		this.drawingUrls = drawingUrls;
	}
	
}
