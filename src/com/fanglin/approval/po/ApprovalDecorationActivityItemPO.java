package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalDecorationActivityitem", catalog = "approval")
public class ApprovalDecorationActivityItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -5325357230277494348L;

	public static final String COLUMN_AAID_STR = "adaId";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final int COLUMN_COUPON_INT = 0;

	public static final int COLUMN_THING_INT = 1;

	public static final int COLUMN_SPECIAL_COLUMN_COUPON_INT = 2;

	public static final int COLUMN_SPECIAL_ARTICLE_INT = 3;

	private long adaiId;

	private long adaId;

	private String orderId;

	private String activityName;

	private String activityItemName;

	private short type;

	private int num;

	private int money;

	private String content;

	private short stateType;

	private long asid;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "adaiId")
	public long getAdaiId() {
		return this.adaiId;
	}

	public void setAdaiId(long adaiId) {
		this.adaiId = adaiId;
	}

	@Column(name = "adaId")
	public long getAdaId() {
		return this.adaId;
	}

	public void setAdaId(long adaId) {
		this.adaId = adaId;
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
	public int getMoney() {
		return this.money;
	}

	public void setMoney(int money) {
		this.money = money;
	}

	@Column(name = "content")
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "stateType")
	public short getStateType() {
		return stateType;
	}

	public void setStateType(short stateType) {
		this.stateType = stateType;
	}

	@Column(name = "asid")
	public long getAsid() {
		return asid;
	}

	public void setAsid(long asid) {
		this.asid = asid;
	}

}