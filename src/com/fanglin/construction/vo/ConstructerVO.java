package com.fanglin.construction.vo;

import java.sql.Timestamp;

import com.fanglin.personel.vo.UserVO;

public class ConstructerVO implements java.io.Serializable {

	private static final long serialVersionUID = 5071168089649592674L;
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	private Long crid;
	
	private Long cid;	
	
	private String orderId;
	
	private UserVO	user;
	
	private Integer schedule;
	
	private Short rate;
	
	private String assessment;
	
	private UserVO creater;
	
	private Timestamp createTime;
	
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

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Integer getSchedule() {
		return this.schedule;
	}

	public void setSchedule(Integer schedule) {
		this.schedule = schedule;
	}

	public Short getRate() {
		return this.rate;
	}

	public void setRate(Short rate) {
		this.rate = rate;
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