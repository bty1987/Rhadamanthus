package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.construction.service.ConstructionDiaryService;
import com.fanglin.construction.vo.ConstructionDiaryDrawingVO;
import com.fanglin.construction.vo.ConstructionDiaryVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionDiaryAction extends BaseListAction {

	private static final long serialVersionUID = 3579553772365688947L;

	@Autowired
	private ConstructionDiaryService constructionDiaryService;

	private ConstructionDiaryVO constructionDiary;
	
	private List<ConstructionDiaryVO> constructionDiarys;

	private ConstructionDiaryDrawingVO constructionDiaryDrawing;
	
	@Action(value = "pageConstructionDiary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionDiary() throws FLException {

		constructionDiaryService.pageConstructionDiary(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "queryConstructionDiary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionDiary() throws FLException {

		constructionDiarys = constructionDiaryService.queryConstructionDiary(constructionDiary);

		return SUCCESS;
	}
	
	@Action(value = "addConstructionDiary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionDiary() throws FLException {

		constructionDiaryService.addConstructionDiary(constructionDiary,constructionDiaryDrawing, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public ConstructionDiaryVO getConstructionDiary() {
		return constructionDiary;
	}

	public void setConstructionDiary(ConstructionDiaryVO constructionDiary) {
		this.constructionDiary = constructionDiary;
	}
	
	public ConstructionDiaryDrawingVO getConstructionDiaryDrawing() {
		return constructionDiaryDrawing;
	}

	public void setConstructionDiaryDrawing(ConstructionDiaryDrawingVO constructionDiaryDrawing) {
		this.constructionDiaryDrawing = constructionDiaryDrawing;
	}

	public List<ConstructionDiaryVO> getConstructionDiarys() {
		return constructionDiarys;
	}

	public void setConstructionDiarys(List<ConstructionDiaryVO> constructionDiarys) {
		this.constructionDiarys = constructionDiarys;
	}
}
