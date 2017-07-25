/**
 * Title: NoticeAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.information.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.NoticeDepartmentService;
import com.fanglin.information.service.NoticeService;
import com.fanglin.information.vo.NoticeDepartmentVO;
import com.fanglin.information.vo.NoticeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NoticeAction extends BaseListAction {

	private static final long serialVersionUID = 2327633841386704953L;
	
	@Autowired
	private NoticeService noticeService;
	
	@Autowired
	private NoticeDepartmentService noticeDepartmentService;
	
	private List<NoticeDepartmentVO> noticeDepartments;
	
	private NoticeVO notice;
	
	private List<Integer> dids;

	@Action(value="pageNotice", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageNotice() throws FLException{
		
		noticeService.pageNotice(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="pageNoticeForSeenByType", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
    public String pageNoticeForSeenByType() throws FLException{
		
        noticeService.pageNoticeForSeenByType(getPaging(), notice, queryUserId());
        
        return SUCCESS;
    }
	
	@Action(value="queryNoticeByNid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryNoticeByNid() throws FLException{
		
		noticeService.queryNoticeByNid(notice);
		
		return SUCCESS;
	}
	
	@Action(value="queryNoticeDepartment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryNoticeDepartment() throws FLException{
		
		noticeDepartments = noticeDepartmentService.queryNoticeDepartment(notice);
		
		return SUCCESS;
	}
	
	@Action(value="addNotice", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addNotice() throws FLException{
		
		noticeService.addNotice(notice, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="updateNotice", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateNotice() throws FLException{
		
		noticeService.updateNotice(notice);
		
		return SUCCESS;
	}
	
	@Action(value="updateNoticeDepartment",results={@Result(name="success",type="json",params={"ignoreHierarchy","false"})},params={"contentType","text/html"})
	public String updateNoticeDepartment() throws FLException{
		
		noticeDepartmentService.updateNoticeDepartment(dids, notice);
		
		return SUCCESS;
	} 
	
	@Action(value="deleteNotice", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteNotice() throws FLException{
		
		noticeService.deleteNotice(notice);
		
		return SUCCESS;
	}

	public List<NoticeDepartmentVO> getNoticeDepartments() {
		return noticeDepartments;
	}

	public void setNoticeDepartments(List<NoticeDepartmentVO> noticeDepartments) {
		this.noticeDepartments = noticeDepartments;
	}

	public NoticeVO getNotice(){
		return notice;
	}

	public void setNotice(NoticeVO notice){
		this.notice = notice;
	}

	public List<Integer> getDids() {
		return dids;
	}

	public void setDids(List<Integer> dids) {
		this.dids = dids;
	}

}
