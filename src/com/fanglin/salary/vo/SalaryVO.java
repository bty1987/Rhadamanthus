package com.fanglin.salary.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class SalaryVO implements Serializable {

	private static final long serialVersionUID = 7126472132309882472L;

	private Long sid;

	private UserBaseVO user;

	private Timestamp createTime;

	private Short type;

	private Short onetype;

	private Short twotype;

	private Short thrtype;

	private Float money;

	private Short status;

	private UserBaseVO operater;

	private Timestamp operateTime;

	private String comment;
	
	public SalaryVO(){
		super();
	}
	
	public SalaryVO(UserBaseVO user,UserBaseVO operater){
		super();
		this.user=user;
		this.operater=operater;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getOnetype() {
		return onetype;
	}

	public void setOnetype(Short onetype) {
		this.onetype = onetype;
	}

	public Short getTwotype() {
		return twotype;
	}

	public void setTwotype(Short twotype) {
		this.twotype = twotype;
	}

	public Short getThrtype() {
		return thrtype;
	}

	public void setThrtype(Short thrtype) {
		this.thrtype = thrtype;
	}

	public Float getMoney() {
		return money;
	}

	public void setMoney(Float money) {
		this.money = money;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public UserBaseVO getOperater() {
		return operater;
	}

	public void setOperater(UserBaseVO operater) {
		this.operater = operater;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
