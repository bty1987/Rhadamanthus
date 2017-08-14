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
@Table(name = "upgrade", catalog = "upgrade")
public class UpgradePO implements Serializable{

	private static final long serialVersionUID = -6202041259417390L;

	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLUMN_TRIALNO_STR = "trialno";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";
	
	private long ugid;
	
	private String no;
	
	private String trialno;
	
	private Timestamp createTime;
	
	private String content;
	
	private String path;
	
	private long fileSize;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ugid")
	public long getUgid() {
		return ugid;
	}

	public void setUgid(long ugid) {
		this.ugid = ugid;
	}
	
	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}
	
	@Column(name = "trialno")
	public String getTrialno() {
		return trialno;
	}

	public void setTrialno(String trialno) {
		this.trialno = trialno;
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
