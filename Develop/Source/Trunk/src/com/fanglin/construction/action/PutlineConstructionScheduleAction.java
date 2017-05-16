/**
 * @File Name		: PutlineConstructionScheduleAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-2
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

import com.fanglin.construction.service.PutlineConstructionScheduleService;
import com.fanglin.construction.service.PutlineDrawingService;
import com.fanglin.construction.vo.PutlineConstructionScheduleVO;
import com.fanglin.construction.vo.PutlineDrawingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PutlineConstructionScheduleAction extends BaseListAction{

	private static final long serialVersionUID = -8859191009003512536L;
	
	@Autowired
	private PutlineConstructionScheduleService putlineConstructionScheduleService;
	
	@Autowired
	private PutlineDrawingService putlineDrawingService;
	
	private PutlineConstructionScheduleVO putlineConstructionSchedule;
	
	private PutlineDrawingVO putlineDrawing;
	
	private List<PutlineDrawingVO> putlineDrawings;
	
	private List<String> drawingUrls;
	
	@Action(value = "queryPutlineConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPutlineConstructionScheduleByOrderId(){
		
		putlineConstructionSchedule = putlineConstructionScheduleService.queryPutlineConstructionScheduleByOrderId(putlineConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "updatePutlineConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePutlineConstructionSchedule(){
		
		putlineConstructionScheduleService.saveOrUpdatePutlineConstructionSchedule(putlineConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setPutlineConstructionScheduleForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setPutlineConstructionScheduleForStatus() throws FLException{
		
		putlineConstructionScheduleService.setPutlineConstructionScheduleForStatus(putlineConstructionSchedule, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "setPutlineConstructionScheduleForInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setPutlineConstructionScheduleForInfo(){
		
		putlineConstructionScheduleService.setPutlineConstructionScheduleForInfo(putlineConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "queryPutlineDrawingByCsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPutlineDrawingByCsId(){
		
		putlineDrawings = putlineDrawingService.queryPutlineDrawingByCsId(putlineDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "queryPutlineDrawingByPlcsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPutlineDrawingByPlcsId(){
		
		putlineDrawings = putlineDrawingService.queryPutlineDrawingByPlcsId(putlineDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addPutlineDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPutlineDrawing() throws FLException{
		
		putlineDrawingService.saveOrUpdatePutlineDrawing(putlineDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addPutlineDrawings", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPutlineDrawings() throws FLException{
		
		putlineDrawings = putlineDrawingService.addPutlineDrawings(putlineDrawing, drawingUrls);
		
		return SUCCESS;
	}
	
	@Action(value = "deletePutlineDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePutlineDrawing(){
		
		putlineDrawingService.deletePutlineDrawingByPldId(putlineDrawing);
		
		return SUCCESS;
	}

	public PutlineConstructionScheduleVO getPutlineConstructionSchedule(){
		return putlineConstructionSchedule;
	}

	public void setPutlineConstructionSchedule(
			PutlineConstructionScheduleVO putlineConstructionSchedule){
		this.putlineConstructionSchedule = putlineConstructionSchedule;
	}

	public PutlineDrawingVO getPutlineDrawing(){
		return putlineDrawing;
	}

	public void setPutlineDrawing(PutlineDrawingVO putlineDrawing){
		this.putlineDrawing = putlineDrawing;
	}

	public List<PutlineDrawingVO> getPutlineDrawings(){
		return putlineDrawings;
	}

	public void setPutlineDrawings(List<PutlineDrawingVO> putlineDrawings){
		this.putlineDrawings = putlineDrawings;
	}

	public List<String> getDrawingUrls() {
		return drawingUrls;
	}

	public void setDrawingUrls(List<String> drawingUrls) {
		this.drawingUrls = drawingUrls;
	}

}
