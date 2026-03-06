package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.po.DecorationPO;

public class MemberVO implements Serializable {

	private static final long serialVersionUID = 1543202163841476255L;

	private String orderId;

	private String phone;

	private String designerPhone;

	private String supervisorPhone;

	private String desigerId;

	private String designer;

	private String supervisorId;

	private String supervisor;

	private Timestamp storeTime;// 到店时间

	private Timestamp contractTime;// 签约时间

	private Short paySacle;// 付款比例

	private Short status;

	private String company;

	/**
	 * 记录唯一标识（基于 doid）
	 * - 主订单：doid（如 "12345"）
	 * - 关联订单：parentDoid-doid（如 "12345-67890"）
	 */
	private String uniqueId;

	/**
	 * 主订单号（被推荐的单号）
	 * - 主订单：此字段为空
	 * - 关联订单：指向主订单的 orderId
	 */
	private String referOrderId;

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

	public String getDesignerPhone() {
		return designerPhone;
	}

	public void setDesignerPhone(String designerPhone) {
		this.designerPhone = designerPhone;
	}

	public String getSupervisorPhone() {
		return supervisorPhone;
	}

	public void setSupervisorPhone(String supervisorPhone) {
		this.supervisorPhone = supervisorPhone;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getStoreTime() {
		return storeTime;
	}

	public void setStoreTime(Timestamp storeTime) {
		this.storeTime = storeTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getContractTime() {
		return contractTime;
	}

	public void setContractTime(Timestamp contractTime) {
		this.contractTime = contractTime;
	}

	public Short getPaySacle() {
		return paySacle;
	}

	public void setPaySacle(Short paySacle) {
		this.paySacle = paySacle;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getUniqueId() {
		return uniqueId;
	}

	public void setUniqueId(String uniqueId) {
		this.uniqueId = uniqueId;
	}

	public String getReferOrderId() {
		return referOrderId;
	}

	public void setReferOrderId(String referOrderId) {
		this.referOrderId = referOrderId;
	}

	public MemberVO init(DecorationPO decorationPO, String companyName) {

		setOrderId(decorationPO.getOrderId());
		setCompany(companyName);
		setPaySacle(decorationPO.getPaySacle());

		if (decorationPO.getDesigner() != null) {
			setDesigerId(decorationPO.getDesigner().getUserId());
			setDesigner(decorationPO.getDesigner().getCurrentName());
			setDesignerPhone(decorationPO.getDesigner().getPhone());
		}

		if (decorationPO.getSupervisor() != null) {
			setSupervisorId(decorationPO.getSupervisor().getUserId());
			setSupervisor(decorationPO.getSupervisor().getCurrentName());
			setSupervisorPhone(decorationPO.getSupervisor().getPhone());
		}

		return this;
	}

}
