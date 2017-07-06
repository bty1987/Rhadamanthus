package com.fanglin.upgrade.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class VersionVO implements Serializable{

	private static final long serialVersionUID = -1793564648176417285L;
	
	private Long vid;
	
	private String versionNumber;
	
	private String trialVersion;
	
	private Timestamp createTime;
	
	private String content;
	
	private String path;
	
	private Long fileSize;

	public Long getVid() {
		return vid;
	}

	public void setVid(Long vid) {
		this.vid = vid;
	}

	public String getVersionNumber() {
		return versionNumber;
	}

	public void setVersionNumber(String versionNumber) {
		this.versionNumber = versionNumber;
	}

	public String getTrialVersion() {
		return trialVersion;
	}

	public void setTrialVersion(String trialVersion) {
		this.trialVersion = trialVersion;
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
