/**
 * @File Name		: WaterwayCircuitCheckConstructionScheduleAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-3
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

import com.fanglin.construction.service.WaterwayCircuitCheckConstructionScheduleService;
import com.fanglin.construction.service.WaterwayCircuitCheckDrawingService;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.WaterwayCircuitCheckConstructionScheduleVO;
import com.fanglin.construction.vo.WaterwayCircuitCheckConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.WaterwayCircuitCheckDrawingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WaterwayCircuitCheckConstructionScheduleAction extends BaseListAction{

	private static final long serialVersionUID = 7830349457754895244L;
	
	@Autowired
	private WaterwayCircuitCheckConstructionScheduleService waterwayCircuitCheckConstructionScheduleService;
	
	@Autowired
	private WaterwayCircuitCheckDrawingService waterwayCircuitCheckDrawingService;
	
	private WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionSchedule;
	
	private WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawing;
	
	private List<WaterwayCircuitCheckDrawingVO> waterwayCircuitCheckDrawings;
	
	private List<String> drawingUrls;
	
	private List<WaterwayCircuitCheckConstructionScheduleWorkerVO> constructionScheduleWorkers;
	
	private WaterwayCircuitCheckConstructionScheduleWorkerVO waterwayCircuitCheckConstructionScheduleWorker;
	
	private ConstructionScheduleWorkerVO constructionScheduleWorker;
	
	@Action(value = "queryWaterwayCircuitCheckConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWaterwayCircuitCheckConstructionScheduleByOrderId(){
		
		waterwayCircuitCheckConstructionSchedule = waterwayCircuitCheckConstructionScheduleService.queryWaterwayCircuitCheckConstructionScheduleByOrderId(waterwayCircuitCheckConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "updateWaterwayCircuitCheckConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWaterwayCircuitCheckConstructionSchedule(){
		
		waterwayCircuitCheckConstructionScheduleService.saveOrUpdateWaterwayCircuitCheckConstructionSchedule(waterwayCircuitCheckConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setWaterwayCircuitCheckConstructionScheduleForTimeFlag", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setWaterwayCircuitCheckConstructionScheduleForTimeFlag(){
		
		waterwayCircuitCheckConstructionScheduleService.setWaterwayCircuitCheckConstructionScheduleForTimeFlag(waterwayCircuitCheckConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setWaterwayCircuitCheckConstructionScheduleForInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setWaterwayCircuitCheckConstructionScheduleForInfo(){
		
		waterwayCircuitCheckConstructionScheduleService.setWaterwayCircuitCheckConstructionScheduleForInfo(waterwayCircuitCheckConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "queryWaterwayCircuitCheckDrawingByCsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWaterwayCircuitCheckDrawingByCsId(){
		
		waterwayCircuitCheckDrawings = waterwayCircuitCheckDrawingService.queryWaterwayCircuitCheckDrawingByCsId(waterwayCircuitCheckDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "queryWaterwayCircuitCheckDrawingByWcccsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWaterwayCircuitCheckDrawingByWcccsId(){
		
		waterwayCircuitCheckDrawings = waterwayCircuitCheckDrawingService.queryWaterwayCircuitCheckDrawingByWcccsId(waterwayCircuitCheckDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addWaterwayCircuitCheckDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addWaterwayCircuitCheckDrawing() throws FLException{
		
		waterwayCircuitCheckDrawingService.saveOrUpdateWaterwayCircuitCheckDrawing(waterwayCircuitCheckDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addWaterwayCircuitCheckDrawings", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addWaterwayCircuitCheckDrawings() throws FLException{
		
		waterwayCircuitCheckDrawings = waterwayCircuitCheckDrawingService.addwaterWaterwayCircuitCheckDrawings(waterwayCircuitCheckDrawing, drawingUrls);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteWaterwayCircuitCheckDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteWaterwayCircuitCheckDrawing(){
		
		waterwayCircuitCheckDrawingService.deleteWaterwayCircuitCheckDrawingByWccdId(waterwayCircuitCheckDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "queryWaterwayCircuitCheckConstructionScheduleWorker", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWaterwayCircuitCheckConstructionScheduleWorker(){
		
		constructionScheduleWorkers = waterwayCircuitCheckConstructionScheduleService.queryWaterwayCircuitCheckConstructionScheduleWorkerByWcccsId(waterwayCircuitCheckConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "addWaterwayCircuitCheckConstructionScheduleWorker", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addWaterwayCircuitCheckConstructionScheduleWorker() throws FLException{
		
		waterwayCircuitCheckConstructionScheduleService.addWaterwayCircuitCheckConstructionScheduleWorker(waterwayCircuitCheckConstructionScheduleWorker);
		
		return SUCCESS;
	}
	
	@Action(value = "setWaterwayCircuitCheckConstructionScheduleWorkerForSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setWaterwayCircuitCheckConstructionScheduleWorkerForSalary() throws FLException{
		
		waterwayCircuitCheckConstructionScheduleService.setWaterwayCircuitCheckConstructionScheduleWorkerForSalary(constructionScheduleWorker);
		
		return SUCCESS;
	}
	
	@Action(value = "setWaterwayCircuitCheckConstructionScheduleWorkerForRaty", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setWaterwayCircuitCheckConstructionScheduleWorkerForRaty(){
		
		waterwayCircuitCheckConstructionScheduleService.setWaterwayCircuitCheckConstructionScheduleWorkerForRaty(constructionScheduleWorkers);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteWaterwayCircuitCheckConstructionScheduleWorker", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteWaterwayCircuitCheckConstructionScheduleWorker() throws FLException{
		
		waterwayCircuitCheckConstructionScheduleService.deleteWaterwayCircuitCheckConstructionScheduleWorker(waterwayCircuitCheckConstructionScheduleWorker);
		
		return SUCCESS;
	}

	public WaterwayCircuitCheckConstructionScheduleVO getWaterwayCircuitCheckConstructionSchedule(){
		return waterwayCircuitCheckConstructionSchedule;
	}

	public void setWaterwayCircuitCheckConstructionSchedule(
			WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionSchedule){
		this.waterwayCircuitCheckConstructionSchedule = waterwayCircuitCheckConstructionSchedule;
	}

	public WaterwayCircuitCheckDrawingVO getWaterwayCircuitCheckDrawing(){
		return waterwayCircuitCheckDrawing;
	}

	public void setWaterwayCircuitCheckDrawing(
			WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawing){
		this.waterwayCircuitCheckDrawing = waterwayCircuitCheckDrawing;
	}

	public List<WaterwayCircuitCheckDrawingVO> getWaterwayCircuitCheckDrawings(){
		return waterwayCircuitCheckDrawings;
	}

	public void setWaterwayCircuitCheckDrawings(
			List<WaterwayCircuitCheckDrawingVO> waterwayCircuitCheckDrawings){
		this.waterwayCircuitCheckDrawings = waterwayCircuitCheckDrawings;
	}

	public List<WaterwayCircuitCheckConstructionScheduleWorkerVO> getConstructionScheduleWorkers(){
		return constructionScheduleWorkers;
	}

	public void setConstructionScheduleWorkers(
			List<WaterwayCircuitCheckConstructionScheduleWorkerVO> constructionScheduleWorkers){
		this.constructionScheduleWorkers = constructionScheduleWorkers;
	}

	public WaterwayCircuitCheckConstructionScheduleWorkerVO getWaterwayCircuitCheckConstructionScheduleWorker(){
		return waterwayCircuitCheckConstructionScheduleWorker;
	}

	public void setWaterwayCircuitCheckConstructionScheduleWorker(
			WaterwayCircuitCheckConstructionScheduleWorkerVO waterwayCircuitCheckConstructionScheduleWorker){
		this.waterwayCircuitCheckConstructionScheduleWorker = waterwayCircuitCheckConstructionScheduleWorker;
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