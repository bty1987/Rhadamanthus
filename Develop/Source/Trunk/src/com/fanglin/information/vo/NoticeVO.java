/**
 * Title: NoticeVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.information.vo;

import java.io.Serializable;

import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.personel.vo.UserVO;

public class NoticeVO implements Serializable {

	private static final long serialVersionUID = 134049609579042097L;

	private Integer noticeId;
	
	private UserVO user;
	
	private DepartmentVO dept;
	
	private String theme;
	
	private String type;
	
	private String priority;
	
	private String startTime;
	
	private String endTime;
	
	private String publishTime;
	
	private String isPublic;
	
	private String contents;
	
	private String contentsText;
	
	private String filePath;
	
	public NoticeVO(){
		super();
	}

	public Integer getNoticeId(){
		return noticeId;
	}

	public void setNoticeId(Integer noticeId){
		this.noticeId = noticeId;
	}

	public UserVO getUser(){
		return user;
	}

	public void setUser(UserVO user){
		this.user = user;
	}

	public DepartmentVO getDept(){
		return dept;
	}

	public void setDept(DepartmentVO dept){
		this.dept = dept;
	}

	public String getTheme(){
		return theme;
	}

	public void setTheme(String theme){
		this.theme = theme;
	}

	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	public String getPriority(){
		return priority;
	}

	public void setPriority(String priority){
		this.priority = priority;
	}

	public String getStartTime(){
		return startTime;
	}

	public void setStartTime(String startTime){
		this.startTime = startTime;
	}

	public String getEndTime(){
		return endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	public String getPublishTime(){
		return publishTime;
	}

	public void setPublishTime(String publishTime){
		this.publishTime = publishTime;
	}

	public String getIsPublic(){
		return isPublic;
	}

	public void setIsPublic(String isPublic){
		this.isPublic = isPublic;
	}

	public String getContents(){
		return contents;
	}

	public void setContents(String contents){
		this.contents = contents;
	}

	public String getContentsText(){
		return contentsText;
	}

	public void setContentsText(String contentsText){
		this.contentsText = contentsText;
	}

	public String getFilePath(){
		return filePath;
	}

	public void setFilePath(String filePath){
		this.filePath = filePath;
	}

}
