package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class CppointRecordVO implements Serializable {

	private static final long serialVersionUID = -6923098417541930946L;

	private Long cprid;

	private Long cid;

	private Long cpid;

	private Short type;

	private Short pointType;

	private Long balance;

	private Long point;

	private UserBaseVO operater;

	private Timestamp operateTime;

	public CppointRecordVO(UserBaseVO operater) {
		super();
		this.operater = operater;
	}

	public CppointRecordVO() {
		super();
	}

	public Long getCprid() {
		return cprid;
	}

	public void setCprid(Long cprid) {
		this.cprid = cprid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getPointType() {
		return pointType;
	}

	public void setPointType(Short pointType) {
		this.pointType = pointType;
	}

	public Long getBalance() {
		return balance;
	}

	public void setBalance(Long balance) {
		this.balance = balance;
	}

	public Long getPoint() {
		return point;
	}

	public void setPoint(Long point) {
		this.point = point;
	}

	public UserBaseVO getOperater() {
		return operater;
	}

	public void setOperater(UserBaseVO operater) {
		this.operater = operater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

}
