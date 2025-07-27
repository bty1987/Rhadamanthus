package com.fanglin.customer.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "feedbackComplaintProblem", catalog = "customer")
public class FeedbackComplaintProblemPO implements Serializable {

	private static final long serialVersionUID = 7860833340019482929L;

	private long fcpid;

	private String name;

	private long parentId;

	private short level;

	public FeedbackComplaintProblemPO() {
		super();
	}

	public FeedbackComplaintProblemPO(long fcpid) {
		super();
		this.fcpid = fcpid;
	}

	@Id
	@GeneratedValue
	@Column(name = "fcpid")
	public long getFcpid() {
		return fcpid;
	}

	public void setFcpid(long fcpid) {
		this.fcpid = fcpid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "parentId")
	public long getParentId() {
		return parentId;
	}

	public void setParentId(long parentId) {
		this.parentId = parentId;
	}

	@Column(name = "level")
	public short getLevel() {
		return level;
	}

	public void setLevel(short level) {
		this.level = level;
	}

}
