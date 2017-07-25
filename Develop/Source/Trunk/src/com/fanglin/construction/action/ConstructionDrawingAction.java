/**
 * @File Name		: ConstructionAction.java
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

import com.fanglin.construction.service.ConstructionDrawingService;
import com.fanglin.construction.vo.ConstructionDrawingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;


@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionDrawingAction extends BaseListAction{

	private static final long serialVersionUID = 1830437899502700214L;
	
	@Autowired
	private ConstructionDrawingService constructionDrawingService;
	
	private ConstructionDrawingVO constructionDrawing;
	
	private List<ConstructionDrawingVO> constructionDrawings;
	
	private List<String> drawingUrls;
	
	@Action(value = "queryConstructionDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionDrawing(){
		
		constructionDrawings = constructionDrawingService.queryConstructionDrawing(constructionDrawing);
		
		return SUCCESS;
	}
	
	@Action(value = "addConstructionDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionDrawing() throws FLException{
		
		constructionDrawingService.addConstructionDrawing(constructionDrawing, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "addConstructionDrawings", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionDrawings() throws FLException{
		
		constructionDrawings = constructionDrawingService.addConstructionDrawings(constructionDrawing, drawingUrls, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "deleteConstructionDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteConstructionDrawing(){
		
		constructionDrawingService.deleteConstructionDrawingByCdId(constructionDrawing);
		
		return SUCCESS;
	}
	
	public ConstructionDrawingVO getConstructionDrawing() {
		return constructionDrawing;
	}

	public void setConstructionDrawing(ConstructionDrawingVO constructionDrawing) {
		this.constructionDrawing = constructionDrawing;
	}

	public List<ConstructionDrawingVO> getConstructionDrawings() {
		return constructionDrawings;
	}

	public void setConstructionDrawings(
			List<ConstructionDrawingVO> constructionDrawings) {
		this.constructionDrawings = constructionDrawings;
	}

	public List<String> getDrawingUrls() {
		return drawingUrls;
	}

	public void setDrawingUrls(List<String> drawingUrls) {
		this.drawingUrls = drawingUrls;
	}
	
}
