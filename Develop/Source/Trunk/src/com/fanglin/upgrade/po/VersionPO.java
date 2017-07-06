package com.fanglin.upgrade.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "version", catalog = "upgrade")
public class VersionPO implements Serializable{

	private static final long serialVersionUID = -3482372700667296973L;
	
	public static final String COLUMN_VERSIONNUMBER_STR = "versionNumber";
	
	public static final String COLUMN_TRIALVERSION_STR = "trialVersion";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";
	
	private long vid;
	
	private String versionNumber;
	
	private String trialVersion;
	
	private Timestamp createTime;
	
	private String content;
	
	private String path;
	
	private long fileSize;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vid")
	public long getVid() {
		return vid;
	}

	public void setVid(long vid) {
		this.vid = vid;
	}

	@Column(name = "versionNumber")
	public String getVersionNumber() {
		return versionNumber;
	}

	public void setVersionNumber(String versionNumber) {
		this.versionNumber = versionNumber;
	}
	
	@Column(name = "trialversion")
	public String getTrialVersion() {
		return trialVersion;
	}

	public void setTrialVersion(String trialVersion) {
		this.trialVersion = trialVersion;
	}

	@Column(name = "createtime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
	@Column(name = "filesize")
	public long getFileSize() {
		return fileSize;
	}

	public void setFileSize(long fileSize) {
		this.fileSize = fileSize;
	}

}
