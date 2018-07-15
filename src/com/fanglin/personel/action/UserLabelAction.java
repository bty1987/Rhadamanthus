package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.data.common.vo.LabelVO;
import com.fanglin.personel.service.UserLabelService;
import com.fanglin.personel.vo.UserLabelVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserLabelAction extends BaseListAction {

	private static final long serialVersionUID = -6066824785113715938L;
	
	@Autowired
	private UserLabelService userlabelService;
	
	private UserLabelVO userlabel;
	
	private List<LabelVO> labels;
	
	private List<UserLabelVO> userlabels;
	
	private List<Integer> userLabel;
	
	@Action(value="queryUserLabelByUid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryUserLabelByUid(){
		
		userlabels = userlabelService.queryUserLabelByUid(userlabel);
		
		return SUCCESS;
	}
	
	@Action(value="pickUserLabel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pickUserLabel(){
		
		userlabels =  userlabelService.pickUserLabel(userLabel);
		
		return SUCCESS;
	}
	
	@Action(value="addUserLabel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addUserLabel(){
		
		 userlabelService.addUserLabel(userlabel);
		
		return SUCCESS;
	}

	@Action(value="deleteUserLabel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteUserLabel(){
		
		 userlabelService.deleteUserLabel(userlabel);
		
		return SUCCESS;
	}
	
	public UserLabelVO getUserlabel() {
		return userlabel;
	}

	public void setUserlabel(UserLabelVO userlabel) {
		this.userlabel = userlabel;
	}

	public List<LabelVO> getLabels() {
		return labels;
	}

	public void setLabels(List<LabelVO> labels) {
		this.labels = labels;
	}

	public List<UserLabelVO> getUserlabels() {
		return userlabels;
	}

	public void setUserlabels(List<UserLabelVO> userlabels) {
		this.userlabels = userlabels;
	}

	public List<Integer> getUserLabel() {
		return userLabel;
	}

	public void setUserLabel(List<Integer> userLabel) {
		this.userLabel = userLabel;
	}
	
}
