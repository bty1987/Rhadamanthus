package com.fanglin.decoration.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "decorationactivityitem", catalog = "decoration")
public class DecorationActivityItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -2215251113218795219L;
	
	public static final short STATUS_INIT_INT = 0;// 初始
	
	public static final short STATUS_UNVALID_INT = 1; // 失效
	
	public static final short STATUS_RECEIVE_INT = 2; // 已领
	
	public static final short STATUS_RETREAT_INT = 3; // 退货
	
	public static final short STATUS_DELIVERY_INT = 4; // 配送
	
	public static final short STATUS_WAIT_INT = 5; // 未退
	
	public static final short STATUS_UPGRADE_INT = 6; // 升级
	
	public static final short STATUS_CONSUME_INT = 7; // 消耗

	public static final short TYPE_COUPON_INT = 0; // 卷

	public static final short TYPE_THING_INT = 1; // 物品

	public static final short TYPE_SPECIALCOUPON_INT = 2; // 特殊卷

	public static final short TYPE_SPECIALARTICLE_INT = 3;// 特殊物品

	public static final short ISPREFOR_CAL_INT = 0; // 业绩标识 0 计算

	public static final short ISSTOCK_CAL_INT = 0;// 库存标识 0 计算

	public static final short ISPAYMENT_CAL_INT = 0;// 金额标识 0 计算

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

	private int num;

	private float money;

	private String content;

	private UserPO receiveUserId;

	private String receiveUserName;

	private Timestamp receiveTime;

	private long asid;

	private short stateType;

	private short isStock; // 库存标识

	private short isPrefor; // 业绩标识
	
	private short isPayment; // 金额标识

	public DecorationActivityItemPO() {
		super();
	}

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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ruid", referencedColumnName = "uId")
	public UserPO getReceiveUserId() {
		return receiveUserId;
	}

	public void setReceiveUserId(UserPO receiveUserId) {
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

	@Column(name = "isStock")
	public short getIsStock() {
		return isStock;
	}

	public void setIsStock(short isStock) {
		this.isStock = isStock;
	}

	@Column(name = "isPrefor")
	public short getIsPrefor() {
		return isPrefor;
	}

	public void setIsPrefor(short isPrefor) {
		this.isPrefor = isPrefor;
	}

	@Column(name = "isPayment")
	public short getIsPayment() {
		return isPayment;
	}

	public void setIsPayment(short isPayment) {
		this.isPayment = isPayment;
	}

}