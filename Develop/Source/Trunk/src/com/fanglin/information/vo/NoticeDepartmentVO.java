package com.fanglin.information.vo;

import java.io.Serializable;


public class NoticeDepartmentVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7120910110224076414L;
	private long ndid;
	private NoticeVO notice;
	private Integer department;
	
	public NoticeDepartmentVO(NoticeVO notice) {
		//super();
		this.notice = notice;
	}
	public long getNdid() {
		return ndid;
	}
	public void setNdid(long ndid) {
		this.ndid = ndid;
	}
	public NoticeDepartmentVO(){}
	
	
	public NoticeDepartmentVO(long ndid, NoticeVO notice, Integer department) {
		//super();
		this.ndid = ndid;
		this.notice = notice;
		this.department = department;
	}
	public NoticeVO getNotice() {
		return notice;
	}
	public void setNotice(NoticeVO notice) {
		this.notice = notice;
	}
	public Integer getDepartment() {
		return department;
	}
	public void setDepartment(Integer department) {
		this.department = department;
	}

	
	
	
}
