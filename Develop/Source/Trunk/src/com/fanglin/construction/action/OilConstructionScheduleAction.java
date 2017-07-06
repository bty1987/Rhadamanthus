/**
 * @File Name		: OilConstructionScheduleAction.java
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

import com.fanglin.construction.service.OilConstructionScheduleService;
import com.fanglin.construction.service.OilDrawingService;
import com.fanglin.construction.vo.OilConstructionScheduleVO;
import com.fanglin.construction.vo.OilDrawingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OilConstructionScheduleAction extends BaseListAction{

	private static final long serialVersionUID = 1830437899502700213L;
	
	@Autowired
	private OilConstructionScheduleService oilConstructionScheduleService;
	
	@Autowired
	private OilDrawingService oilDrawingService;
	
	private OilConstructionScheduleVO oilConstructionSchedule;
	
	private OilDrawingVO oilDrawing;
	
	private List<OilDrawingVO> oilDrawings;
	
	private List<String> drawingUrls;
	
	@Action(value = "queryOilConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOilConstructionScheduleByOrderId(){
		
		oilConstructionSchedule = oilConstructionScheduleService.queryOilConstructionScheduleByOrderId(oilConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setOilConstructionScheduleForTimeFlag", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setOilConstructionScheduleForTimeFlag(){
		
		oilConstructionScheduleService.setOilConstructionScheduleForTimeFlag(oilConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "setOilConstructionScheduleForInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setOilConstructionScheduleForInfo(){
		
		oilConstructionScheduleService.setOilConstructionScheduleForInfo(oilConstructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "queryOilDrawingByCsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOilDrawingByCsId(){
		
		oilDrawings = oilDrawingService.queryOilDrawingByCsId(oilDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "queryOilDrawingByOcsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOilDrawingByOcsId(){
		
		oilDrawings = oilDrawingService.queryOilDrawingByOcsId(oilDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addOilDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOilDrawing() throws FLException{
		
		oilDrawingService.saveOrUpdateOilDrawing(oilDrawing, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "addOilDrawings", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOilDrawings() throws FLException{
		
		oilDrawings = oilDrawingService.addOilDrawings(oilDrawing, drawingUrls, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "deleteOilDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteOilDrawing(){
		
		oilDrawingService.deleteOilDrawingByOdId(oilDrawing);
		
		return SUCCESS;
	}

	public OilConstructionScheduleVO getOilConstructionSchedule(){
		return oilConstructionSchedule;
	}

	public void setOilConstructionSchedule(OilConstructionScheduleVO oilConstructionSchedule){
		this.oilConstructionSchedule = oilConstructionSchedule;
	}

	public OilDrawingVO getOilDrawing(){
		return oilDrawing;
	}

	public void setOilDrawing(OilDrawingVO oilDrawing){
		this.oilDrawing = oilDrawing;
	}

	public List<OilDrawingVO> getOilDrawings(){
		return oilDrawings;
	}

	public void setOilDrawings(List<OilDrawingVO> oilDrawings){
		this.oilDrawings = oilDrawings;
	}

	public List<String> getDrawingUrls() {
		return drawingUrls;
	}

	public void setDrawingUrls(List<String> drawingUrls) {
		this.drawingUrls = drawingUrls;
	}
	
}
