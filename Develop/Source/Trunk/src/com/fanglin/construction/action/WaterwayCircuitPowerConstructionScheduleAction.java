/**
 * @File Name		: WaterwayCircuitPowerConstructionScheduleAction.java
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

import com.fanglin.construction.service.WaterwayCircuitPowerConstructionScheduleService;
import com.fanglin.construction.service.WaterwayCircuitPowerDrawingService;
import com.fanglin.construction.vo.WaterwayCircuitPowerConstructionScheduleVO;
import com.fanglin.construction.vo.WaterwayCircuitPowerDrawingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WaterwayCircuitPowerConstructionScheduleAction extends BaseListAction{

	private static final long serialVersionUID = 7830349457754895244L;
	
	@Autowired
	private WaterwayCircuitPowerConstructionScheduleService waterwayCircuitPowerConstructionScheduleService;
	
	@Autowired
	private WaterwayCircuitPowerDrawingService waterwayCircuitPowerDrawingService;
	
	private WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionSchedule;
	
	private WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawing;
	
	private List<WaterwayCircuitPowerDrawingVO> waterwayCircuitPowerDrawings;
	
	private List<String> drawingUrls;
	
	@Action(value = "queryWaterwayCircuitPowerConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWaterwayCircuitPowerConstructionScheduleByOrderId(){
		
		waterwayCircuitPowerConstructionSchedule = waterwayCircuitPowerConstructionScheduleService.queryWaterwayCircuitPowerConstructionScheduleByOrderId(waterwayCircuitPowerConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "updateWaterwayCircuitPowerConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWaterwayCircuitPowerConstructionSchedule(){
		
		waterwayCircuitPowerConstructionScheduleService.saveOrUpdateWaterwayCircuitPowerConstructionSchedule(waterwayCircuitPowerConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setWaterwayCircuitPowerConstructionScheduleForTimeFlag", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setWaterwayCircuitPowerConstructionScheduleForTimeFlag(){
		
		waterwayCircuitPowerConstructionScheduleService.setWaterwayCircuitPowerConstructionScheduleForTimeFlag(waterwayCircuitPowerConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setWaterwayCircuitPowerConstructionScheduleInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setWaterwayCircuitPowerConstructionScheduleInfo(){
		
		waterwayCircuitPowerConstructionScheduleService.setWaterwayCircuitPowerConstructionScheduleForInfo(waterwayCircuitPowerConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "queryWaterwayCircuitPowerDrawingByCsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWaterwayCircuitPowerDrawingByCsId(){
		
		waterwayCircuitPowerDrawings = waterwayCircuitPowerDrawingService.queryWaterwayCircuitPowerDrawingByCsId(waterwayCircuitPowerDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "queryWaterwayCircuitPowerDrawingByWcpcsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWaterwayCircuitPowerDrawingByWcpcsId(){
		
		waterwayCircuitPowerDrawings = waterwayCircuitPowerDrawingService.queryWaterwayCircuitPowerDrawingByWcpcsId(waterwayCircuitPowerDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addWaterwayCircuitPowerDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addWaterwayCircuitPowerDrawing() throws FLException{
		
		waterwayCircuitPowerDrawingService.saveOrUpdateWaterwayCircuitPowerDrawing(waterwayCircuitPowerDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addWaterwayCircuitPowerDrawings", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addWaterwayCircuitPowerDrawings() throws FLException{
		
		waterwayCircuitPowerDrawings = waterwayCircuitPowerDrawingService.addWaterwayCircuitPowerDrawings(waterwayCircuitPowerDrawing, drawingUrls);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteWaterwayCircuitPowerDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteWaterwayCircuitPowerDrawing(){
		
		waterwayCircuitPowerDrawingService.deleteWaterwayCircuitPowerDrawingByWcpdId(waterwayCircuitPowerDrawing);
		
		return SUCCESS;
	}

	public WaterwayCircuitPowerConstructionScheduleVO getWaterwayCircuitPowerConstructionSchedule(){
		return waterwayCircuitPowerConstructionSchedule;
	}

	public void setWaterwayCircuitPowerConstructionSchedule(
			WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionSchedule){
		this.waterwayCircuitPowerConstructionSchedule = waterwayCircuitPowerConstructionSchedule;
	}

	public WaterwayCircuitPowerDrawingVO getWaterwayCircuitPowerDrawing(){
		return waterwayCircuitPowerDrawing;
	}

	public void setWaterwayCircuitPowerDrawing(
			WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawing){
		this.waterwayCircuitPowerDrawing = waterwayCircuitPowerDrawing;
	}

	public List<WaterwayCircuitPowerDrawingVO> getWaterwayCircuitPowerDrawings(){
		return waterwayCircuitPowerDrawings;
	}

	public void setWaterwayCircuitPowerDrawings(
			List<WaterwayCircuitPowerDrawingVO> waterwayCircuitPowerDrawings){
		this.waterwayCircuitPowerDrawings = waterwayCircuitPowerDrawings;
	}

	public List<String> getDrawingUrls() {
		return drawingUrls;
	}

	public void setDrawingUrls(List<String> drawingUrls) {
		this.drawingUrls = drawingUrls;
	}

}