/**
 * Title: NoticePO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.information.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.department.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "notice", catalog = "platform")
public class NoticePO implements Serializable {

	private static final long serialVersionUID = 134049609579042097L;
	
	public static final String NOTICE_STATUS_VALID_STR = "有效";
	
	public static final String NOTICE_STATUS_INVALID_STR = "失效";

	private Integer noticeId;
	
	private UserPO user;
	
	private DepartmentPO dept;
	
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
	
	public NoticePO(){
		super();
	}

	@Id
	@GeneratedValue
	@Column(nullable = false)
	public Integer getNoticeId(){
		return noticeId;
	}

	public void setNoticeId(Integer noticeId){
		this.noticeId = noticeId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
	public UserPO getUser(){
		return user;
	}

	public void setUser(UserPO user){
		this.user = user;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deptId", referencedColumnName = "deptId", nullable = false)
	public DepartmentPO getDept(){
		return dept;
	}

	public void setDept(DepartmentPO dept){
		this.dept = dept;
	}

	@Column(nullable = false)
	public String getTheme(){
		return theme;
	}

	public void setTheme(String theme){
		this.theme = theme;
	}

	@Column(nullable = false)
	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	@Column(nullable = false)
	public String getPriority(){
		return priority;
	}

	public void setPriority(String priority){
		this.priority = priority;
	}

	@Column(nullable = false)
	public String getStartTime(){
		return startTime;
	}

	public void setStartTime(String startTime){
		this.startTime = startTime;
	}

	@Column(nullable = false)
	public String getEndTime(){
		return endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	@Column(nullable = false)
	public String getPublishTime(){
		return publishTime;
	}

	public void setPublishTime(String publishTime){
		this.publishTime = publishTime;
	}

	@Column(nullable = false)
	public String getIsPublic(){
		return isPublic;
	}

	public void setIsPublic(String isPublic){
		this.isPublic = isPublic;
	}

	@Column(nullable = false)
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
