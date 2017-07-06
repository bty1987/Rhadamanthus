/**
 * @File Name		: CleaningConstructionScheduleAction.java
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

import com.fanglin.construction.service.CleaningConstructionScheduleService;
import com.fanglin.construction.service.CleaningDrawingService;
import com.fanglin.construction.vo.CleaningConstructionScheduleVO;
import com.fanglin.construction.vo.CleaningDrawingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CleaningConstructionScheduleAction extends BaseListAction{

	private static final long serialVersionUID = 1830437899502700213L;
	
	@Autowired
	private CleaningConstructionScheduleService cleaningConstructionScheduleService;
	
	@Autowired
	private CleaningDrawingService cleaningDrawingService;
	
	private CleaningConstructionScheduleVO cleaningConstructionSchedule;
	
	private CleaningDrawingVO cleaningDrawing;
	
	private List<CleaningDrawingVO> cleaningDrawings;
	
	private List<String> drawingUrls;
	
	@Action(value = "queryCleaningConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCleaningConstructionScheduleByOrderId(){
		
		cleaningConstructionSchedule = cleaningConstructionScheduleService.queryCleaningConstructionScheduleByOrderId(cleaningConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setCleaningConstructionScheduleForTimeFlag", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setCleaningConstructionScheduleForTimeFlag(){
		
		cleaningConstructionScheduleService.setCleaningConstructionScheduleForTimeFlag(cleaningConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setCleaningConstructionScheduleForInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setCleaningConstructionScheduleForInfo(){
		
		cleaningConstructionScheduleService.setCleaningConstructionScheduleForInfo(cleaningConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCleaningDrawingByCsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCleaningDrawingByCsId(){
		
		cleaningDrawings = cleaningDrawingService.queryCleaningDrawingByCsId(cleaningDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCleaningDrawingByCcsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCleaningDrawingByCcsId(){
		
		cleaningDrawings = cleaningDrawingService.queryCleaningDrawingByCcsId(cleaningDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addCleaningDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCleaningDrawing() throws FLException{
		
		cleaningDrawingService.saveOrUpdateCleaningDrawing(cleaningDrawing, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "addCleaningDrawings", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCleaningDrawings() throws FLException{
		
		cleaningDrawings = cleaningDrawingService.addCleaningDrawings(cleaningDrawing, drawingUrls, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "deleteCleaningDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCleaningDrawing(){
		
		cleaningDrawingService.deleteCleaningDrawingByCdId(cleaningDrawing);
		
		return SUCCESS;
	}

	public CleaningConstructionScheduleVO getCleaningConstructionSchedule(){
		return cleaningConstructionSchedule;
	}

	public void setCleaningConstructionSchedule(CleaningConstructionScheduleVO cleaningConstructionSchedule){
		this.cleaningConstructionSchedule = cleaningConstructionSchedule;
	}

	public CleaningDrawingVO getCleaningDrawing(){
		return cleaningDrawing;
	}

	public void setCleaningDrawing(CleaningDrawingVO cleaningDrawing){
		this.cleaningDrawing = cleaningDrawing;
	}

	public List<CleaningDrawingVO> getCleaningDrawings(){
		return cleaningDrawings;
	}

	public void setCleaningDrawings(List<CleaningDrawingVO> cleaningDrawings){
		this.cleaningDrawings = cleaningDrawings;
	}

	public List<String> getDrawingUrls() {
		return drawingUrls;
	}

	public void setDrawingUrls(List<String> drawingUrls) {
		this.drawingUrls = drawingUrls;
	}
	
}
