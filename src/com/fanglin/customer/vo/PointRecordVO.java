package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class PointRecordVO implements Serializable {

	private static final long serialVersionUID = -6923098417541930946L;

	private Long recordId;

	private Long cid;

	private Long accountId;

	private Short type;

	private Short pointType;

	private Short status;

	private Long balance;

	private Long point;

	private Long decorationPoint;

	private Long materialPoint;

	private Long operatePoint;

	private UserBaseVO operater;

	private Timestamp operateTime;

	public PointRecordVO(UserBaseVO operater) {
		super();
		this.operater = operater;
	}

	public PointRecordVO() {
		super();
	}

	public Long getRecordId() {
		return recordId;
	}

	public void setRecordId(Long recordId) {
		this.recordId = recordId;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
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

	public Long getDecorationPoint() {
		return decorationPoint;
	}

	public void setDecorationPoint(Long decorationPoint) {
		this.decorationPoint = decorationPoint;
	}

	public Long getMaterialPoint() {
		return materialPoint;
	}

	public void setMaterialPoint(Long materialPoint) {
		this.materialPoint = materialPoint;
	}

	public Long getOperatePoint() {
		return operatePoint;
	}

	public void setOperatePoint(Long operatePoint) {
		this.operatePoint = operatePoint;
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
