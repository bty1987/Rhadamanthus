/**
 * @File Name		: ChanConstructionScheduleAction.java
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

import com.fanglin.construction.service.ChanConstructionScheduleService;
import com.fanglin.construction.service.ChanDrawingService;
import com.fanglin.construction.vo.ChanConstructionScheduleVO;
import com.fanglin.construction.vo.ChanDrawingVO;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ChanConstructionScheduleAction extends BaseListAction{

	private static final long serialVersionUID = 1830437899502700213L;
	
	@Autowired
	private ChanConstructionScheduleService chanConstructionScheduleService;
	
	@Autowired
	private ChanDrawingService chanDrawingService;
	
	private ChanConstructionScheduleVO chanConstructionSchedule;
	
	private ConstructionScheduleWorkerVO constructionScheduleWorker;
	
	private ChanDrawingVO chanDrawing;
	
	private List<ChanDrawingVO> chanDrawings;
	
	private List<String> drawingUrls;
	
	@Action(value = "queryChanConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryChanConstructionScheduleByOrderId(){
		
		chanConstructionSchedule = chanConstructionScheduleService.queryChanConstructionScheduleByOrderId(chanConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "updateChanConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateChanConstructionSchedule(){
		
		chanConstructionSchedule.setCcsId(chanConstructionScheduleService.saveOrUpdateChanConstructionSchedule(chanConstructionSchedule));
		
		return SUCCESS;
	}
	
	@Action(value = "setChanConstructionScheduleForTimeFlag", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setChanConstructionScheduleForTimeFlag(){
		
		chanConstructionScheduleService.setChanConstructionScheduleForTimeFlag(chanConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setChanConstructionScheduleForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setChanConstructionScheduleForStatus(){
		
		chanConstructionScheduleService.setChanConstructionScheduleForStatus(chanConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setChanConstructionScheduleForInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setChanConstructionScheduleForInfo(){
		
		chanConstructionScheduleService.setChanConstructionScheduleForInfo(chanConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setChanConstructionScheduleWorker", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setChanConstructionScheduleWorker() throws FLException{
		
		chanConstructionScheduleService.setChanConstructionScheduleWorker(chanConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setChanConstructionScheduleForService", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setChanConstructionScheduleForService(){
		
		chanConstructionScheduleService.setChanConstructionScheduleForService(chanConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setChanConstructionScheduleForSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setChanConstructionScheduleForSalary() throws FLException{
		
		chanConstructionScheduleService.setChanConstructionScheduleForSalary(constructionScheduleWorker);
		
		return SUCCESS;
	}
	
	@Action(value = "queryChanDrawingByCsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryChanDrawingByCsId(){
		
		chanDrawings = chanDrawingService.queryChanDrawingByCsId(chanDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "queryChanDrawingByCcsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryChanDrawingByCcsId(){
		
		chanDrawings = chanDrawingService.queryChanDrawingByCcsId(chanDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addChanDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addChanDrawing() throws FLException{
		
		chanDrawingService.saveOrUpdateChanDrawing(chanDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addChanDrawings", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addChanDrawings() throws FLException{
		
		chanDrawings = chanDrawingService.addChanDrawings(chanDrawing, drawingUrls);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteChanDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteChanDrawing(){
		
		chanDrawingService.deleteChanDrawingByCdId(chanDrawing);
		
		return SUCCESS;
	}

	public ChanConstructionScheduleVO getChanConstructionSchedule(){
		return chanConstructionSchedule;
	}

	public void setChanConstructionSchedule(
			ChanConstructionScheduleVO chanConstructionSchedule){
		this.chanConstructionSchedule = chanConstructionSchedule;
	}

	public ChanDrawingVO getChanDrawing(){
		return chanDrawing;
	}

	public void setChanDrawing(ChanDrawingVO chanDrawing){
		this.chanDrawing = chanDrawing;
	}

	public List<ChanDrawingVO> getChanDrawings(){
		return chanDrawings;
	}

	public void setChanDrawings(List<ChanDrawingVO> chanDrawings){
		this.chanDrawings = chanDrawings;
	}

	public ConstructionScheduleWorkerVO getConstructionScheduleWorker(){
		return constructionScheduleWorker;
	}

	public void setConstructionScheduleWorker(
			ConstructionScheduleWorkerVO constructionScheduleWorker){
		this.constructionScheduleWorker = constructionScheduleWorker;
	}

	public List<String> getDrawingUrls() {
		return drawingUrls;
	}

	public void setDrawingUrls(List<String> drawingUrls) {
		this.drawingUrls = drawingUrls;
	}

}
