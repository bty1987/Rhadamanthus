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
@Table(name = "feedbackcomplaint", catalog = "customer")
public class FeedbackComplaintPO implements Serializable {

	private static final long serialVersionUID = -8821043360016894371L;

	public static final Short RESULTS_COMPLETE = 0;

	public static final Short RESULTS_REVOKE = 1;

	public static final Short RESULTS_UNDETERMINED = 2;

	public static final Short RESULTS_SURE = 3;

	public static final Short RESULTS_LEGAL_AFFAIRS = 4;

	private long fcid;

	private long fid;

	private String orderId;

	private short source;

	private String phone;

	private UserPO servicer;

	private UserPO materialer;

	private short upgrade;

	private short urgency;

	private String deptType;

	private UserPO creater;

	private Timestamp createTime;

	private String content;

	private String appeal;
	
	private short results;

	private Timestamp finishTime;

	@Id
	@GeneratedValue
	@Column(name = "fcid")
	public long getFcid() {
		return fcid;
	}

	public void setFcid(long fcid) {
		this.fcid = fcid;
	}

	@Column(name = "fid")
	public Long getFid() {
		return fid;
	}

	public void setFid(Long fid) {
		this.fid = fid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "source")
	public short getSource() {
		return source;
	}

	public void setSource(short source) {
		this.source = source;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "suid", referencedColumnName = "uid")
	public UserPO getServicer() {
		return servicer;
	}

	public void setServicer(UserPO servicer) {
		this.servicer = servicer;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "muid", referencedColumnName = "uid")
	public UserPO getMaterialer() {
		return materialer;
	}

	public void setMaterialer(UserPO materialer) {
		this.materialer = materialer;
	}

	@Column(name = "upgrade")
	public short getUpgrade() {
		return upgrade;
	}

	public void setUpgrade(short upgrade) {
		this.upgrade = upgrade;
	}

	@Column(name = "urgency")
	public short getUrgency() {
		return urgency;
	}

	public void setUrgency(short urgency) {
		this.urgency = urgency;
	}

	@Column(name = "deptType")
	public String getDeptType() {
		return deptType;
	}

	public void setDeptType(String deptType) {
		this.deptType = deptType;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
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

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "appeal")
	public String getAppeal() {
		return appeal;
	}

	public void setAppeal(String appeal) {
		this.appeal = appeal;
	}

	@Column(name = "results")
	public short getResults() {
		return results;
	}

	public void setResults(short results) {
		this.results = results;
	}
	
	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}
}
