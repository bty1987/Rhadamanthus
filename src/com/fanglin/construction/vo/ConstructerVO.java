package com.fanglin.construction.vo;

import java.sql.Timestamp;

import com.fanglin.personel.vo.UserVO;

public class ConstructerVO implements java.io.Serializable {

	private static final long serialVersionUID = 5071168089649592674L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	private Long crid;

	private String orderId;

	private Long cid;

	private Long csid;

	private Long cnid;

	private UserVO user;

	private Short schedule;

	private Short rate;

	private short rate1;

	private short rate2;

	private String assessment;

	private UserVO creater;

	private Timestamp createTime;

	private Timestamp sendTime;

	private Timestamp finishTime;

	private Short status;

	public ConstructerVO() {
		super();
	}

	public ConstructerVO(UserVO user) {
		super();
		this.user = user;
	}

	public ConstructerVO(UserVO user, UserVO creater) {
		super();
		this.user = user;
		this.creater = creater;
	}

	public Long getCrid() {
		return crid;
	}

	public void setCrid(Long crid) {
		this.crid = crid;
	}

	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public Short getSchedule() {
		return this.schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

	public Short getRate() {
		return this.rate;
	}

	public void setRate(Short rate) {
		this.rate = rate;
	}

	public short getRate1() {
		return rate1;
	}

	public void setRate1(short rate1) {
		this.rate1 = rate1;
	}

	public short getRate2() {
		return rate2;
	}

	public void setRate2(short rate2) {
		this.rate2 = rate2;
	}

	public String getAssessment() {
		return this.assessment;
	}

	public void setAssessment(String assessment) {
		this.assessment = assessment;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Timestamp getSendTime() {
		return sendTime;
	}

	public void setSendTime(Timestamp sendTime) {
		this.sendTime = sendTime;
	}

	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	public Short getStatus() {
		return this.status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}
}