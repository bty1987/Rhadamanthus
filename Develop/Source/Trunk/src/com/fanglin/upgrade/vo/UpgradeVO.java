package com.fanglin.upgrade.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class UpgradeVO implements Serializable{

	private static final long serialVersionUID = -2055209315930136686L;

	private Long ugid;
	
	private String no;
	
	private String trialno;
	
	private Timestamp createTime;
	
	private String content;
	
	private String path;
	
	private Long fileSize;

	public Long getUgid() {
		return ugid;
	}

	public void setUgid(Long ugid) {
		this.ugid = ugid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getTrialno() {
		return trialno;
	}

	public void setTrialno(String trialno) {
		this.trialno = trialno;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Long getFileSize() {
		return fileSize;
	}

	public void setFileSize(Long fileSize) {
		this.fileSize = fileSize;
	}
	
}
