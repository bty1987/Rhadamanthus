/**
 * @File Name		: ApprovalBelongTranItemPO.java
 * @Package   	: com.fanglin.approval.po
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 离职移交审批明细(单号×归属类型→接手人+比例+默认, rate/默认人modal人工编辑值原样存)
 */

package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalbelongtranitem", catalog = "approval")
public class ApprovalBelongTranItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -8826419370625148733L;

	public static final String COLUMN_ABTID_STR = "abtId";

	private int abtiId;

	private int abtId;

	private String orderId;

	private short belongType;

	private int buid;

	private int bdid;

	private int brid;

	private int rate;

	private short defaultFlag;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "abtiId")
	public int getAbtiId() {
		return this.abtiId;
	}

	public void setAbtiId(int abtiId) {
		this.abtiId = abtiId;
	}

	@Column(name = "abtId")
	public int getAbtId() {
		return this.abtId;
	}

	public void setAbtId(int abtId) {
		this.abtId = abtId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "belongType")
	public short getBelongType() {
		return this.belongType;
	}

	public void setBelongType(short belongType) {
		this.belongType = belongType;
	}

	@Column(name = "buid")
	public int getBuid() {
		return this.buid;
	}

	public void setBuid(int buid) {
		this.buid = buid;
	}

	@Column(name = "bdid")
	public int getBdid() {
		return this.bdid;
	}

	public void setBdid(int bdid) {
		this.bdid = bdid;
	}

	@Column(name = "brid")
	public int getBrid() {
		return this.brid;
	}

	public void setBrid(int brid) {
		this.brid = brid;
	}

	@Column(name = "rate")
	public int getRate() {
		return this.rate;
	}

	public void setRate(int rate) {
		this.rate = rate;
	}

	@Column(name = "defaultFlag")
	public short getDefaultFlag() {
		return this.defaultFlag;
	}

	public void setDefaultFlag(short defaultFlag) {
		this.defaultFlag = defaultFlag;
	}

}
