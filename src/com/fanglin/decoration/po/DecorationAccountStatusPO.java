package com.fanglin.decoration.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationaccountstatus", catalog = "decoration")
public class DecorationAccountStatusPO implements Serializable {

	private static final long serialVersionUID = 5606576442220062867L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final short STATUS_FAIL_INT = 0;

	public static final short STATUS_PASS_INT = 1;

	public static final short STATUS_UNCHECK_INT = 2;

	private long dasid;

	private String orderId;

	private int company;

	private short status;

	private short signStatus;

	private short salesStatus;

	private short constructionStatus;

	private short selectionStatus;

	private short decorationPaymentStatus;

	private short salesPaymentStatus;

	private short decorationPaymentScale;

	private short decorationPaymentTarget;

	private short salesPaymentScale;

	private short salesPaymentTarget;

	private long constructionCnid;

	private String constructionName;

	private int salesUnfinish;

	private int selectionUnfinish;

	private Timestamp updateTime;

	private String comment;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dasid")
	public long getDasid() {
		return dasid;
	}

	public void setDasid(long dasid) {
		this.dasid = dasid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "signStatus")
	public short getSignStatus() {
		return signStatus;
	}

	public void setSignStatus(short signStatus) {
		this.signStatus = signStatus;
	}

	@Column(name = "salesStatus")
	public short getSalesStatus() {
		return salesStatus;
	}

	public void setSalesStatus(short salesStatus) {
		this.salesStatus = salesStatus;
	}

	@Column(name = "constructionStatus")
	public short getConstructionStatus() {
		return constructionStatus;
	}

	public void setConstructionStatus(short constructionStatus) {
		this.constructionStatus = constructionStatus;
	}

	@Column(name = "selectionStatus")
	public short getSelectionStatus() {
		return selectionStatus;
	}

	public void setSelectionStatus(short selectionStatus) {
		this.selectionStatus = selectionStatus;
	}

	@Column(name = "decorationPaymentStatus")
	public short getDecorationPaymentStatus() {
		return decorationPaymentStatus;
	}

	public void setDecorationPaymentStatus(short decorationPaymentStatus) {
		this.decorationPaymentStatus = decorationPaymentStatus;
	}

	@Column(name = "salesPaymentStatus")
	public short getSalesPaymentStatus() {
		return salesPaymentStatus;
	}

	public void setSalesPaymentStatus(short salesPaymentStatus) {
		this.salesPaymentStatus = salesPaymentStatus;
	}

	@Column(name = "decorationPaymentScale")
	public short getDecorationPaymentScale() {
		return decorationPaymentScale;
	}

	public void setDecorationPaymentScale(short decorationPaymentScale) {
		this.decorationPaymentScale = decorationPaymentScale;
	}

	@Column(name = "decorationPaymentTarget")
	public short getDecorationPaymentTarget() {
		return decorationPaymentTarget;
	}

	public void setDecorationPaymentTarget(short decorationPaymentTarget) {
		this.decorationPaymentTarget = decorationPaymentTarget;
	}

	@Column(name = "salesPaymentScale")
	public short getSalesPaymentScale() {
		return salesPaymentScale;
	}

	public void setSalesPaymentScale(short salesPaymentScale) {
		this.salesPaymentScale = salesPaymentScale;
	}

	@Column(name = "salesPaymentTarget")
	public short getSalesPaymentTarget() {
		return salesPaymentTarget;
	}

	public void setSalesPaymentTarget(short salesPaymentTarget) {
		this.salesPaymentTarget = salesPaymentTarget;
	}

	@Column(name = "constructionCnid")
	public long getConstructionCnid() {
		return constructionCnid;
	}

	public void setConstructionCnid(long constructionCnid) {
		this.constructionCnid = constructionCnid;
	}

	@Column(name = "constructionName")
	public String getConstructionName() {
		return constructionName;
	}

	public void setConstructionName(String constructionName) {
		this.constructionName = constructionName;
	}

	@Column(name = "salesUnfinish")
	public int getSalesUnfinish() {
		return salesUnfinish;
	}

	public void setSalesUnfinish(int salesUnfinish) {
		this.salesUnfinish = salesUnfinish;
	}

	@Column(name = "selectionUnfinish")
	public int getSelectionUnfinish() {
		return selectionUnfinish;
	}

	public void setSelectionUnfinish(int selectionUnfinish) {
		this.selectionUnfinish = selectionUnfinish;
	}

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
