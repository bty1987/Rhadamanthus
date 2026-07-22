package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class DecorationAccountStatusVO implements Serializable {

	private static final long serialVersionUID = 1260377686154918026L;

	private Long dasid;

	private String orderId;

	private Integer company;

	private Short status;

	private Short signStatus;

	private Short salesStatus;

	private Short constructionStatus;

	private Short selectionStatus;

	private Short decorationPaymentStatus;

	private Short salesPaymentStatus;

	private Short decorationPaymentScale;

	private Short decorationPaymentTarget;

	private Short salesPaymentScale;

	private Short salesPaymentTarget;

	private Long constructionCnid;

	private String constructionName;

	private Integer salesUnfinish;

	private Integer selectionUnfinish;

	private Timestamp updateTime;

	private String comment;

	public Long getDasid() {
		return dasid;
	}

	public void setDasid(Long dasid) {
		this.dasid = dasid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getSignStatus() {
		return signStatus;
	}

	public void setSignStatus(Short signStatus) {
		this.signStatus = signStatus;
	}

	public Short getSalesStatus() {
		return salesStatus;
	}

	public void setSalesStatus(Short salesStatus) {
		this.salesStatus = salesStatus;
	}

	public Short getConstructionStatus() {
		return constructionStatus;
	}

	public void setConstructionStatus(Short constructionStatus) {
		this.constructionStatus = constructionStatus;
	}

	public Short getSelectionStatus() {
		return selectionStatus;
	}

	public void setSelectionStatus(Short selectionStatus) {
		this.selectionStatus = selectionStatus;
	}

	public Short getDecorationPaymentStatus() {
		return decorationPaymentStatus;
	}

	public void setDecorationPaymentStatus(Short decorationPaymentStatus) {
		this.decorationPaymentStatus = decorationPaymentStatus;
	}

	public Short getSalesPaymentStatus() {
		return salesPaymentStatus;
	}

	public void setSalesPaymentStatus(Short salesPaymentStatus) {
		this.salesPaymentStatus = salesPaymentStatus;
	}

	public Short getDecorationPaymentScale() {
		return decorationPaymentScale;
	}

	public void setDecorationPaymentScale(Short decorationPaymentScale) {
		this.decorationPaymentScale = decorationPaymentScale;
	}

	public Short getDecorationPaymentTarget() {
		return decorationPaymentTarget;
	}

	public void setDecorationPaymentTarget(Short decorationPaymentTarget) {
		this.decorationPaymentTarget = decorationPaymentTarget;
	}

	public Short getSalesPaymentScale() {
		return salesPaymentScale;
	}

	public void setSalesPaymentScale(Short salesPaymentScale) {
		this.salesPaymentScale = salesPaymentScale;
	}

	public Short getSalesPaymentTarget() {
		return salesPaymentTarget;
	}

	public void setSalesPaymentTarget(Short salesPaymentTarget) {
		this.salesPaymentTarget = salesPaymentTarget;
	}

	public Long getConstructionCnid() {
		return constructionCnid;
	}

	public void setConstructionCnid(Long constructionCnid) {
		this.constructionCnid = constructionCnid;
	}

	public String getConstructionName() {
		return constructionName;
	}

	public void setConstructionName(String constructionName) {
		this.constructionName = constructionName;
	}

	public Integer getSalesUnfinish() {
		return salesUnfinish;
	}

	public void setSalesUnfinish(Integer salesUnfinish) {
		this.salesUnfinish = salesUnfinish;
	}

	public Integer getSelectionUnfinish() {
		return selectionUnfinish;
	}

	public void setSelectionUnfinish(Integer selectionUnfinish) {
		this.selectionUnfinish = selectionUnfinish;
	}

	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
