package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotationnorm", catalog = "quotation")
public class QuotationNormPO implements Serializable {

	private static final long serialVersionUID = 6717294534034384261L;

	private long qnid;

	private long qid;

	private long moodTotal;

	private long mriceTotal;

	private int moodPrintNum;

	private int mricePriceNum;

	private short status;

	public QuotationNormPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "qnid")
	public long getQnid() {
		return qnid;
	}

	public void setQnid(long qnid) {
		this.qnid = qnid;
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

}
