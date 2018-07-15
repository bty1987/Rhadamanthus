package com.fanglin.store.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.store.service.EvaluateService;
import com.fanglin.store.vo.EvaluateVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class EvaluateAction extends BaseListAction{

	private static final long serialVersionUID = -6818679723083046266L;
	
	@Autowired
	private EvaluateService evaluateService;
	
	private EvaluateVO evaluate;
	
	private List<EvaluateVO> evaluates; 
	
	@Action(value="pageEvaluate", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageEvaluate(){
		
		evaluateService.pageEvaluate(getPaging(), getFilters());
		
		return SUCCESS;
		
	}
		
	@Action(value="addEvaluate", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addEvaluate(){
		
		evaluateService.addEvaluate(evaluates);
		
		return SUCCESS;
		
	}

	public EvaluateVO getEvaluate() {
		return evaluate;
	}

	public void setEvaluate(EvaluateVO evaluate) {
		this.evaluate = evaluate;
	}

	public List<EvaluateVO> getEvaluates() {
		return evaluates;
	}

	public void setEvaluates(List<EvaluateVO> evaluates) {
		this.evaluates = evaluates;
	}

}
