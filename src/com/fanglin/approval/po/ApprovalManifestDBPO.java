package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalmanifestdb", catalog = "approval")
public class ApprovalManifestDBPO implements java.io.Serializable {

	private static final long serialVersionUID = 6360075646482677701L;

	public static final String COLUMN_AID_STR = "aid";

	private long amdbid;
	
	private int aid;
	
	private Timestamp manifestTime;
	
	private String comment;
	
	private String attachment;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "amdbid")
	public long getAmdbid() {
		return amdbid;
	}

	public void setAmdbid(long amdbid) {
		this.amdbid = amdbid;
	}

	@Column(name = "aid")
	public int getAid() {
		return aid;
	}

	public void setAid(int aid) {
		this.aid = aid;
	}

	@Column(name = "manifestTime")
	public Timestamp getManifestTime() {
		return manifestTime;
	}

	public void setManifestTime(Timestamp manifestTime) {
		this.manifestTime = manifestTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
	@Column(name = "attachment")
	public String getAttachment() {
		return attachment;
	}

	public void setAttachment(String attachment) {
		this.attachment = attachment;
	}

}
