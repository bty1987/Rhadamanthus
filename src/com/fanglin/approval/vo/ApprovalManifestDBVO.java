package com.fanglin.approval.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class ApprovalManifestDBVO implements java.io.Serializable {

	private static final long serialVersionUID = -1448433204227173452L;
	
	private Long amdbid;
	
	private Integer aid;
	
	private Timestamp manifestTime;
	
	private String comment;
	
	private String attachment;

	public Long getAmdbid() {
		return amdbid;
	}

	public void setAmdbid(Long amdbid) {
		this.amdbid = amdbid;
	}

	public Integer getAid() {
		return aid;
	}

	public void setAid(Integer aid) {
		this.aid = aid;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getManifestTime() {
		return manifestTime;
	}

	public void setManifestTime(Timestamp manifestTime) {
		this.manifestTime = manifestTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getAttachment() {
		return attachment;
	}

	public void setAttachment(String attachment) {
		this.attachment = attachment;
	}

}
