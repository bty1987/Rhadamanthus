package com.fanglin.decoration.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.decoration.vo.DecorationContractRecordVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "decorationcontractrecord", catalog = "decoration")
public class DecorationContractRecordPO implements Serializable {

	private static final long serialVersionUID = 1L;

	private long dcrid;

	private String orderId;

	private Timestamp commitTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private String comment;

	public DecorationContractRecordPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dcrid")
	public long getDcrid() {
		return dcrid;
	}

	public void setDcrid(long dcrid) {
		this.dcrid = dcrid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "commitTime")
	public Timestamp getCommitTime() {
		return commitTime;
	}

	public void setCommitTime(Timestamp commitTime) {
		this.commitTime = commitTime;
	}

	@Column(name = "startTime")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	@Column(name = "comment", length = 512)
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public DecorationContractRecordVO ptv() {
		return ptv(new DecorationContractRecordVO());
	}

	public DecorationContractRecordVO ptv(DecorationContractRecordVO vo) {
		BeanUtil.copyProperties(this, vo);
		return vo;
	}

}
