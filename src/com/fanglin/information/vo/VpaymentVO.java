package com.fanglin.information.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class VpaymentVO implements Serializable{

	private static final long serialVersionUID = 6240866246932423141L;

	private Long vpid;
	
	private String mno;
	
	private UserBaseVO creater;
	
	private Timestamp createTime;
	
	private UserBaseVO collecter;
	
	private Timestamp collectTime;
	
	private Short type;
	
	private String brand;
	
	private Float money;
	
	private Short way;
	
	private String receipt;
	
	private String comment;
	
	public VpaymentVO() {
		super();
	}

	public VpaymentVO(UserBaseVO creater, UserBaseVO collecter) {
		super();
		this.creater = creater;
		this.collecter = collecter;
	}

	public Long getVpid() {
		return vpid;
	}

	public void setVpid(Long vpid) {
		this.vpid = vpid;
	}

	public String getMno() {
		return mno;
	}

	public void setMno(String mno) {
		this.mno = mno;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserBaseVO collecter) {
		this.collecter = collecter;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public Float getMoney() {
		return money;
	}

	public void setMoney(Float money) {
		this.money = money;
	}

	public Short getWay() {
		return way;
	}

	public void setWay(Short way) {
		this.way = way;
	}

	public String getReceipt() {
		return receipt;
	}

	public void setReceipt(String receipt) {
		this.receipt = receipt;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
