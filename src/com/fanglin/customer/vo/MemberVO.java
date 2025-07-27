package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.decoration.po.DecorationPO;

public class MemberVO implements Serializable {

	private static final long serialVersionUID = 1543202163841476255L;

	private String orderId;

	private String phone;

	private String desigerId;

	private String designer;

	private String supervisorId;

	private String supervisor;

	private Timestamp storeTime;//到店时间

	private Timestamp contractTime;//签约时间

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getDesigerId() {
		return desigerId;
	}

	public void setDesigerId(String desigerId) {
		this.desigerId = desigerId;
	}

	public String getDesigner() {
		return designer;
	}

	public void setDesigner(String designer) {
		this.designer = designer;
	}

	public String getSupervisorId() {
		return supervisorId;
	}

	public void setSupervisorId(String supervisorId) {
		this.supervisorId = supervisorId;
	}

	public String getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(String supervisor) {
		this.supervisor = supervisor;
	}

	public Timestamp getStoreTime() {
		return storeTime;
	}

	public void setStoreTime(Timestamp storeTime) {
		this.storeTime = storeTime;
	}

	public Timestamp getContractTime() {
		return contractTime;
	}

	public void setContractTime(Timestamp contractTime) {
		this.contractTime = contractTime;
	}

	public MemberVO init(DecorationPO decorationPO) {

		setOrderId(decorationPO.getOrderId());

		if (decorationPO.getDesigner() != null) {
			setDesigerId(decorationPO.getDesigner().getUserId());
			setDesigner(decorationPO.getDesigner().getCurrentName());
		}

		if (decorationPO.getSupervisor() != null) {
			setSupervisorId(decorationPO.getSupervisor().getUserId());
			setSupervisor(decorationPO.getSupervisor().getCurrentName());
		}

		return this;
	}

}
