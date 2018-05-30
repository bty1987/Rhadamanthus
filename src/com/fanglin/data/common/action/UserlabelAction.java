package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.data.common.service.UserlabelService;
import com.fanglin.data.common.vo.LabelVO;
import com.fanglin.data.common.vo.UserlabelVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserlabelAction extends BaseListAction {

	private static final long serialVersionUID = -6066824785113715938L;
	
	@Autowired
	private UserlabelService userlabelService;
	
	private UserlabelVO userlabel;
	
	private List<LabelVO> labels;
	
	private List<UserlabelVO> userlabels;
	
	private List<Integer> lids;
	
	@Action(value="updatelabelling", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updatelabelling(){
		
		userlabelService.updatelabelling(userlabel, lids);
		
		return SUCCESS;
	}
	
	@Action(value="querylabelByuid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String querylabelByuid(){
		
		userlabels = userlabelService.querylabelByuid(userlabel);
		
		return SUCCESS;
	}
	
	@Action(value="queryUserlabel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryUserlabel(){
		
		userlabels = userlabelService.queryUserlabel();
		
		return SUCCESS;
	}
	
	@Action(value="sevalabelling", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String sevalabelling(){
		
		 userlabelService.sevalabelling(userlabel);
		
		return SUCCESS;
	}

	@Action(value="deletelabelling", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deletelabelling(){
		
		 userlabelService.deletelabelling(userlabel);
		
		return SUCCESS;
	}
	
	@Action(value="queryUserLbaelBylids", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryUserLbaelBylids(){
		
		userlabels =  userlabelService.queryUserLbaelBylids(lids);
		
		return SUCCESS;
	}
	
	@Action(value="queryUserLabelByUidValue", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryUserLabelByUidValue(){
		
		userlabels =  userlabelService.queryUserLabelByUidValue(userlabel);
		
		return SUCCESS;
	}
	
	
	public UserlabelVO getUserlabel() {
		return userlabel;
	}

	public void setUserlabel(UserlabelVO userlabel) {
		this.userlabel = userlabel;
	}

	public List<Integer> getLids() {
		return lids;
	}

	public void setLids(List<Integer> lids) {
		this.lids = lids;
	}

	public List<LabelVO> getLabels() {
		return labels;
	}

	public void setLabels(List<LabelVO> labels) {
		this.labels = labels;
	}

	public List<UserlabelVO> getUserlabels() {
		return userlabels;
	}

	public void setUserlabels(List<UserlabelVO> userlabels) {
		this.userlabels = userlabels;
	}
	
}
