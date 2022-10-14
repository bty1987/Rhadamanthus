package com.fanglin.quotation.po;

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

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "normtion", catalog = "quotation")
public class NormtionDO implements Serializable {

	private static final long serialVersionUID = -5581027521647679878L;

	private long nid;

	private DecorationPO decoration;

	private long qid;

	private long moodTotal;

	private long mriceTotal;

	private int moodPrintNum;

	private int mricePriceNum;

	private short status;

	private Timestamp createTime;

	private UserPO creater;

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
	@JoinColumn(nullable = true, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "moodTotal")
	public long getMoodTotal() {
		return moodTotal;
	}

	public void setMoodTotal(long moodTotal) {
		this.moodTotal = moodTotal;
	}

	@Column(name = "mriceTotal")
	public long getMriceTotal() {
		return mriceTotal;
	}

	public void setMriceTotal(long mriceTotal) {
		this.mriceTotal = mriceTotal;
	}

	@Column(name = "moodPrintNum")
	public int getMoodPrintNum() {
		return moodPrintNum;
	}

	public void setMoodPrintNum(int moodPrintNum) {
		this.moodPrintNum = moodPrintNum;
	}

	@Column(name = "mricePriceNum")
	public int getMricePriceNum() {
		return mricePriceNum;
	}

	public void setMricePriceNum(int mricePriceNum) {
		this.mricePriceNum = mricePriceNum;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}
}
