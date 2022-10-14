/**
 * Title: NoticePO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
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

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "notice", catalog = "information")
public class NoticePO implements Serializable {

	private static final long serialVersionUID = 134049609579042097L;

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String NOTICE_STATUS_VALID_STR = "有效";

	public static final String NOTICE_STATUS_INVALID_STR = "失效";

	public static final short ISPUBLIC_PUBLIC_INT = 0;

	public static final short PRIORITY_ORDINARY_INT = 0; // 普通

	public static final short PRIORITY_IMPORTANT_INT = 1; // 重要

	public static final short PRIORITY_URGENT_INT = 2; // 紧急

	public static final short TYPE_NOTICE_INT = 1; // 通知

	public static final short TYPE_ACTIVITY_INT = 2; // 活动

	public static final short ISPUBLIC_OPEN_INT = 0; // 公开

	public static final short ISPUBLIC_DEPARTMENTOPEN_INT = 1; // 部门公开

	private long nid;

	private UserPO creater;

	private String theme;

	private short type;

	private short priority;

	private String startTime;

	private String endTime;

	private String publishTime;

	private short isPublic;

	private String contents;

	private String depts;

	private String filePath;

	private int company;

	private String fileName;

	public NoticePO() {
		super();
	}

	public NoticePO(UserPO creater) {
		this.creater = creater;
	}

	@Id
	@GeneratedValue
	@Column(name = "nid")
	public long getNid() {
		return nid;
	}

	public void setNid(long nid) {
		this.nid = nid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "theme")
	public String getTheme() {
		return theme;
	}

	public void setTheme(String theme) {
		this.theme = theme;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "priority")
	public short getPriority() {
		return priority;
	}

	public void setPriority(short priority) {
		this.priority = priority;
	}

	@Column(name = "startTime")
	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	@Column(name = "publishTime")
	public String getPublishTime() {
		return publishTime;
	}

	public void setPublishTime(String publishTime) {
		this.publishTime = publishTime;
	}

	@Column(name = "isPublic")
	public short getIsPublic() {
		return isPublic;
	}

	public void setIsPublic(short isPublic) {
		this.isPublic = isPublic;
	}

	@Column(name = "contents")
	public String getContents() {
		return contents;
	}

	public void setContents(String contents) {
		this.contents = contents;
	}

	@Column(name = "depts")
	public String getDepts() {
		return depts;
	}

	public void setDepts(String depts) {
		this.depts = depts;
	}

	@Column(name = "filePath")
	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "fileName")
	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

}
