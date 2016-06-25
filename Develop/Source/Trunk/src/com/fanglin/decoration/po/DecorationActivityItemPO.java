package com.fanglin.decoration.po;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationactivityitem", catalog = "platform")
public class DecorationActivityItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -2215251113218795219L;
	
	public static final short STATUS_VAILD_INT = 0;
	
	public static final short STATUS_UNVALID_INT = 1;
	
	public static final short STATUS_RECEIVE_INT = 2;
	
	public static final short TYPE_COUPON_INT = 0;
	
	public static final short TYPE_THING_INT = 1;
	
	public static final String COLUMN_DAIID_STR = "daiId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_STATUS_STR = "state";
	
	public static final String COLUMN_TYPE_STR = "type";

	private long daiId;
	
	private long aid;
	
	private String orderId;
	
	private String activityName;
	
	private String activityItemName;
	
	private short type;
	
	private short state;
	
	private int total;
	
	private int num;
	
	private float money;
	
	private String content;
	
	private String receiveUserId;
	
	private String receiveUserName;
	
	private Timestamp receiveTime;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "daiId")
	public long getDaiId() {
		return this.daiId;
	}

	public void setDaiId(long daiId) {
		this.daiId = daiId;
	}

	@Column(name = "aId", nullable = false)
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
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

	@Column(name = "state")
	public short getState() {
		return this.state;
	}

	public void setState(short state) {
		this.state = state;
	}

	@Column(name = "total")
	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
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

	@Column(name = "receiveUserId")
	public String getReceiveUserId() {
		return receiveUserId;
	}

	public void setReceiveUserId(String receiveUserId) {
		this.receiveUserId = receiveUserId;
	}

	@Column(name = "receiveUserName")
	public String getReceiveUserName() {
		return receiveUserName;
	}

	public void setReceiveUserName(String receiveUserName) {
		this.receiveUserName = receiveUserName;
	}

	@Column(name = "receiveTime")
	public Timestamp getReceiveTime() {
		return receiveTime;
	}

	public void setReceiveTime(Timestamp receiveTime) {
		this.receiveTime = receiveTime;
	}

}