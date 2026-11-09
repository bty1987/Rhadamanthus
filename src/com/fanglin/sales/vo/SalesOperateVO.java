package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.personel.vo.UserBaseVO;

public class SalesOperateVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private long soid;

	private long sid;

	private String no;

	private String orderId;

	private short type;

	private UserBaseVO operater;

	private Timestamp operateTime;

	private String comment;

	private int company;

	public SalesOperateVO() {
	}

	public SalesOperateVO(UserBaseVO operater) {
		this.operater = operater;
	}

	public long getSoid() {
		return soid;
	}

	public void setSoid(long soid) {
		this.soid = soid;
	}

	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public UserBaseVO getOperater() {
		return operater;
	}

	public void setOperater(UserBaseVO operater) {
		this.operater = operater;
	}

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

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
}
