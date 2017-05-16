package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalorderbelongitem", catalog = "approval")
public class ApprovalOrderBelongItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -6194667291773962401L;
	
	public static final String COLUMN_AOBID_STR = "aobId";

	private int aobiId;
	
	private int aobId;
	
	private String orderId;
	
	private String belongUserId;
	
	private float belongRate;
	
	private String defaultFlag;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aobiId")
	public int getAobiId() {
		return this.aobiId;
	}

	public void setAobiId(int aobiId) {
		this.aobiId = aobiId;
	}

	@Column(name = "aobId")
	public int getAobId() {
		return this.aobId;
	}

	public void setAobId(int aobId) {
		this.aobId = aobId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "belongUserId")
	public String getBelongUserId() {
		return this.belongUserId;
	}

	public void setBelongUserId(String belongUserId) {
		this.belongUserId = belongUserId;
	}

	@Column(name = "belongRate")
	public float getBelongRate() {
		return this.belongRate;
	}

	public void setBelongRate(float belongRate) {
		this.belongRate = belongRate;
	}

	@Column(name = "defaultFlag")
	public String getDefaultFlag() {
		return this.defaultFlag;
	}

	public void setDefaultFlag(String defaultFlag) {
		this.defaultFlag = defaultFlag;
	}

}