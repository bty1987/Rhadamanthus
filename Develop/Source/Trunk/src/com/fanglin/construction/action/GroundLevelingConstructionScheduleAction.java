/**
 * @File Name		: GroundLevelingConstructionScheduleAction.java
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

import com.fanglin.construction.service.GroundLevelingConstructionScheduleService;
import com.fanglin.construction.service.GroundLevelingDrawingService;
import com.fanglin.construction.vo.GroundLevelingConstructionScheduleVO;
import com.fanglin.construction.vo.GroundLevelingDrawingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class GroundLevelingConstructionScheduleAction extends BaseListAction{

	private static final long serialVersionUID = 1830437899502700213L;
	
	@Autowired
	private GroundLevelingConstructionScheduleService groundLevelingConstructionScheduleService;
	
	@Autowired
	private GroundLevelingDrawingService groundLevelingDrawingService;
	
	private GroundLevelingConstructionScheduleVO groundLevelingConstructionSchedule;
	
	private GroundLevelingDrawingVO groundLevelingDrawing;
	
	private List<GroundLevelingDrawingVO> groundLevelingDrawings;
	
	private List<String> drawingUrls;
	
	@Action(value = "queryGroundLevelingConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGroundLevelingConstructionScheduleByOrderId(){
		
		groundLevelingConstructionSchedule = groundLevelingConstructionScheduleService.queryGroundLevelingConstructionScheduleByOrderId(groundLevelingConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setGroundLevelingConstructionScheduleForTimeFlag", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setGroundLevelingConstructionScheduleForTimeFlag(){
		
		groundLevelingConstructionScheduleService.setGroundLevelingConstructionScheduleForTimeFlag(groundLevelingConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setGroundLevelingConstructionScheduleForInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setGroundLevelingConstructionScheduleForInfo(){
		
		groundLevelingConstructionScheduleService.setGroundLevelingConstructionScheduleForInfo(groundLevelingConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "queryGroundLevelingDrawingByCsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGroundLevelingDrawingByCsId(){
		
		groundLevelingDrawings = groundLevelingDrawingService.queryGroundLevelingDrawingByCsId(groundLevelingDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "queryGroundLevelingDrawingByGlcsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGroundLevelingDrawingByGlcsId(){
		
		groundLevelingDrawings = groundLevelingDrawingService.queryGroundLevelingDrawingByGlcsId(groundLevelingDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addGroundLevelingDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addGroundLevelingDrawing() throws FLException{
		
		groundLevelingDrawingService.saveOrUpdateGroundLevelingDrawing(groundLevelingDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addGroundLevelingDrawings", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addGroundLevelingDrawings() throws FLException{
		
		groundLevelingDrawings = groundLevelingDrawingService.addGroundLevelingDrawings(groundLevelingDrawing, drawingUrls);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteGroundLevelingDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteGroundLevelingDrawing(){
		
		groundLevelingDrawingService.deleteGroundLevelingDrawingByGldId(groundLevelingDrawing);
		
		return SUCCESS;
	}

	public GroundLevelingConstructionScheduleVO getGroundLevelingConstructionSchedule(){
		return groundLevelingConstructionSchedule;
	}

	public void setGroundLevelingConstructionSchedule(GroundLevelingConstructionScheduleVO groundLevelingConstructionSchedule){
		this.groundLevelingConstructionSchedule = groundLevelingConstructionSchedule;
	}

	public GroundLevelingDrawingVO getGroundLevelingDrawing(){
		return groundLevelingDrawing;
	}

	public void setGroundLevelingDrawing(GroundLevelingDrawingVO groundLevelingDrawing){
		this.groundLevelingDrawing = groundLevelingDrawing;
	}

	public List<GroundLevelingDrawingVO> getGroundLevelingDrawings(){
		return groundLevelingDrawings;
	}

	public void setGroundLevelingDrawings(List<GroundLevelingDrawingVO> groundLevelingDrawings){
		this.groundLevelingDrawings = groundLevelingDrawings;
	}
	
	public List<String> getDrawingUrls() {
		return drawingUrls;
	}

	public void setDrawingUrls(List<String> drawingUrls) {
		this.drawingUrls = drawingUrls;
	}
	
}
