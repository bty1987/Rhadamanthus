package com.fanglin.customer.po;

import java.io.Serializable;
import java.sql.Timestamp;

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
@Table(name = "vrecord", catalog = "customer")
public class VrecordPO implements Serializable {

	private static final long serialVersionUID = -5274737264832258573L;

	public static final String COLUMN_VID_STRING = "vid";

	private long vrid;

	private long vid;

	private UserPO creater;

	private Timestamp createTime;

	private String comment;

	public VrecordPO() {
		super();
	}

	public VrecordPO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue
	@Column(name = "vrid")
	public long getVrid() {
		return vrid;
	}

	public void setVrid(long vrid) {
		this.vrid = vrid;
	}

	@Column(name = "vid")
	public long getVid() {
		return vid;
	}

	public void setVid(long vid) {
		this.vid = vid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
