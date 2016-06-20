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
import com.fanglin.information.service.NoticeService;
import com.fanglin.information.vo.NoticeVO;
import com.fanglin.personel.vo.UserVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NoticeAction extends BaseListAction {

	private static final long serialVersionUID = 2327633841386704953L;
	
	@Autowired
	private NoticeService noticeService;
	
	private NoticeVO notice;
	
	private List<NoticeVO> noticeList;
	
	private List<Integer> noticeIds;
	
	@Action(value="pageNotice", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageNotice() throws FLException{
		
		noticeService.pageNotice(getPaging(), getFilters(), getUserId());
		
		return SUCCESS;
	}
	
	@Action(value="pageNoticeForDeptAValid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
    public String pageNoticeForDeptAValid() throws FLException{
		
        noticeService.pageNoticeForDeptAValid(getPaging(), notice, getUserId());
        
        return SUCCESS;
    }
	
	@Action(value="queryNoticeForValid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryNoticeForValid(){
		
		noticeList = noticeService.queryNoticeForValid(notice.getType());
		
		return SUCCESS;
	}
	
	@Action(value="queryNoticeById", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryNoticeById(){
		
		noticeService.queryNoticeById(notice.getNoticeId());
		
		return SUCCESS;
	}
	
	@Action(value="addNotice", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addNotice() throws FLException{
		
		notice.setUser(new UserVO(getUserId()));
		noticeService.saveOrUpdateNotice(notice);
		
		return SUCCESS;
	}
	
	@Action(value="updateNotice", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateNotice(){
		
		noticeService.saveOrUpdateNotice(notice);
		
		return SUCCESS;
	}
	
	@Action(value="deleteNotice", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteNotice(){
		
		noticeService.deleteNotice(getNoticeIds());
		
		return SUCCESS;
	}
	
	public NoticeVO getNotice(){
		return notice;
	}

	public void setNotice(NoticeVO notice){
		this.notice = notice;
	}

	public List<Integer> getNoticeIds(){
		return noticeIds;
	}

	public void setNoticeIds(List<Integer> noticeIds){
		this.noticeIds = noticeIds;
	}

	public List<NoticeVO> getNoticeList(){
		return noticeList;
	}

	public void setNoticeList(List<NoticeVO> noticeList){
		this.noticeList = noticeList;
	}

}
