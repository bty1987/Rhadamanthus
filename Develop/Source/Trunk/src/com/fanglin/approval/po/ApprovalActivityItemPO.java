package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalactivityitem", catalog = "approval")
public class ApprovalActivityItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -5325357230277494348L;
	
	public static final String COLUMN_AAID_STR = "aaId";

	private long aaiId;
	
	private long aaId;
	
	private String orderId;
	
	private String activityName;
	
	private String activityItemName;
	
	private short type;
	
	private int num;
	
	private float money;
	
	private String content;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aaiId")
	public long getAaiId() {
		return this.aaiId;
	}

	public void setAaiId(long aaiId) {
		this.aaiId = aaiId;
	}

	@Column(name = "aaId")
	public long getAaId() {
		return this.aaId;
	}

	public void setAaId(long aaId) {
		this.aaId = aaId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "activityName")
	public String getActivityName() {
		return this.activityName;
	}

	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}

	@Column(name = "activityItemName")
	public String getActivityItemName() {
		return this.activityItemName;
	}

	public void setActivityItemName(String activityItemName) {
		this.activityItemName = activityItemName;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "num")
	public int getNum() {
		return this.num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "money")
	public float getMoney() {
		return this.money;
	}

	public void setMoney(float money) {
		this.money = money;
	}

	@Column(name = "content")
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}