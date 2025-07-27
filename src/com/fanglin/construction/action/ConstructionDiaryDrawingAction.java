package com.fanglin.construction.action;

import java.util.List;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.construction.service.ConstructionDiaryDrawingService;
import com.fanglin.construction.vo.ConstructionDiaryDrawingVO;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionDiaryDrawingAction extends BaseListAction {

	private static final long serialVersionUID = 1830437899502700214L;

	@Autowired
	private ConstructionDiaryDrawingService constructionDiaryDrawingService;

	private ConstructionDiaryDrawingVO constructionDiaryDrawing;

	private ConstructionVO construction;

	private ConstructionScheduleVO constructionSchedule;

	private List<ConstructionDiaryDrawingVO> constructionDiaryDrawings;

	@Action(value = "queryConstructionDiaryDrawingByCdid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionDiaryDrawingByCdid() {

		constructionDiaryDrawings = constructionDiaryDrawingService.queryConstructionDiaryDrawingByCdid(constructionDiaryDrawing);

		return SUCCESS;
	}

	@Action(value = "addConstructionDiaryDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionDiaryDrawing() throws FLException {

		long cddid = constructionDiaryDrawingService.addConstructionDiaryDrawing(constructionDiaryDrawing, queryUserId(), queryCompany());

		constructionDiaryDrawing.setCddid(cddid);
		
		return SUCCESS;
	}

	@Action(value = "deleteConstructionDiaryDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteConstructionDiaryDrawing() {

		constructionDiaryDrawingService.deleteConstructionDiaryDrawingByCddid(constructionDiaryDrawing);

		return SUCCESS;
	}

	public ConstructionDiaryDrawingVO getConstructionDiaryDrawing() {
		return constructionDiaryDrawing;
	}

	public void setConstructionDiaryDrawing(ConstructionDiaryDrawingVO constructionDiaryDrawing) {
		this.constructionDiaryDrawing = constructionDiaryDrawing;
	}

	public ConstructionVO getConstruction() {
		return construction;
	}

	public ConstructionScheduleVO getConstructionSchedule() {
		return constructionSchedule;
	}

	public void setConstructionSchedule(ConstructionScheduleVO constructionSchedule) {
		this.constructionSchedule = constructionSchedule;
	}

	public void setConstruction(ConstructionVO construction) {
		this.construction = construction;
	}

	public List<ConstructionDiaryDrawingVO> getConstructionDiaryDrawings() {
		return constructionDiaryDrawings;
	}

	public void setConstructionDiaryDrawings(List<ConstructionDiaryDrawingVO> constructionDiaryDrawings) {
		this.constructionDiaryDrawings = constructionDiaryDrawings;
	}

}
