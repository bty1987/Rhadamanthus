package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.data.common.service.LabelService;
import com.fanglin.data.common.vo.LabelVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class LabelAction extends BaseListAction {

	private static final long serialVersionUID = -7177943004916200005L;

	@Autowired
	private LabelService labelService;
	
	private List<LabelVO> labels;
	
	private LabelVO label;
	
	@Action(value = "querylabel", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String querylabel(){
		
		labels = labelService.querylabel(label);
		
		return SUCCESS;
	}
	
	@Action(value = "pageLabel", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String pageLabel(){
		
		labelService.pageLabel(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "updataForStatus", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String updataForStatus(){
		
		labelService.updataForStatus(label);
		
		return SUCCESS;
	}
	
	@Action(value = "addLabel", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String addLabel(){
		
		labelService.addLabel(label);
		
		return SUCCESS;
	}
	
	@Action(value = "querylabelBytype", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String querylabelBytype(){
		
		labels = labelService.querylabelBytype(label);
		
		return SUCCESS;
	}

	public List<LabelVO> getLabels() {
		return labels;
	}

	public void setLabels(List<LabelVO> labels) {
		this.labels = labels;
	}

	public LabelVO getLabel() {
		return label;
	}

	public void setLabel(LabelVO label) {
		this.label = label;
	}

}
