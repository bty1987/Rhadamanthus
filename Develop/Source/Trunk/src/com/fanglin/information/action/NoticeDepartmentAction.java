package com.fanglin.information.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

import com.fanglin.information.service.NoticeDepartmentService;
import com.fanglin.information.vo.NoticeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NoticeDepartmentAction extends BaseListAction {
	
	private static final long serialVersionUID = 1302651384730072754L;

	@Autowired
	private NoticeDepartmentService noticeDepartmentService;
		
	private NoticeVO notice;
	
	@Action(value="queryNoticeDepartmentByNoticeIdandDepartment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryNoticeDepartmentByNoticeIdandDepartment() throws FLException{
		 noticeDepartmentService.queryNoticeDepartmentByNoticeIdandDepartment(getPaging(), notice, queryUserId());
		 return SUCCESS;
	}

	public NoticeVO getNotice() {
		return notice;
	}

	public void setNotice(NoticeVO notice) {
		this.notice = notice;
	}
}
