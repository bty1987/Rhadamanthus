package com.fanglin.construction.vo;

import java.sql.Timestamp;

import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.personel.po.UserPO;

public class ConstructerVO implements java.io.Serializable {

	private static final long serialVersionUID = 5071168089649592674L;
	public static final String COLUMN_ORDERID_STR = "orderId";
	private Integer cid;
	private Integer csId;	//工程id
	private ConstructionScheduleVO	constructionVO;
	private String orderId;
	private UserPO	user;
	private Integer schedule;
	private float salary;
	private short rate;
	private String assessment;
	private UserPO creater;
	private Timestamp createTime;
	private short status;

	
	public ConstructerVO() {
		super();
	}

	public ConstructerVO(UserPO user) {
		super();
		this.user = user;
	}

	public Integer getCid() {
		return this.cid;
	}

	public void setCid(Integer cid) {
		this.cid = cid;
	}

	public Integer getCsId() {
		return this.csId;
	}

	public void setCsId(Integer csId) {
		this.csId = csId;
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

	public float getSalary() {
		return this.salary;
	}

	public void setSalary(float salary) {
		this.salary = salary;
	}

	public short getRate() {
		return this.rate;
	}

	public void setRate(short rate) {
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

	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public ConstructionScheduleVO getConstructionVO() {
		return constructionVO;
	}

	public void setConstructionVO(ConstructionScheduleVO constructionVO) {
		this.constructionVO = constructionVO;
	}

	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}
	
	

}