package com.fanglin.sales.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
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
@Table(name = "salesactivityitem", catalog = "sales")
public class SalesActivityItemPO implements Serializable {

	private static final long serialVersionUID = 3148602067058233456L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_ISAFFIRM_STR = "isAffirm";

	public static final short STATUS_VALID_INT = 0;// 初始

	public static final short STATUS_UNVALID_INT = 1;// 失效

	public static final short STATUS_RECEIVE_INT = 2;// 已领

	public static final short STATUS_REFUND_INT = 3;// 退货

	public static final short STATUS_DELIVERY_INT = 4;// 配送

	public static final short STATUS_UNRETURNED_INT = 5;// 未退

	public static final short STATUS_UPGRADE_INT = 6;// 升级

	public static final short STATUS_CONSUME_INT = 7;// 消耗

	public static final short STATUS_DISCOUNT_INT = 8;// 抵现

	public static final short STATUS_PURCHER_INT = 9; // 采购

	public static final short ISSTOCK_COUNTIN_INT = 0;// 计入库存

	public static final short ISAFFIRM_UNSUBMIT_INT = 0;

	public static final short ISAFFIRM_CONFIRMED_INT = 1;

	public static final short ISAFFIRM_CHECKED_INT = 2;

	private long saiid;

	private long aid;

	private long asid;

	private String orderId;

	private String activity;

	private String name;

	private int num;

	private int money;

	private int integral;

	private int expendPrice;

	private int discountPrice;

	private UserPO creater;

	private UserPO operater;

	private UserPO refunder;

	private Timestamp createTime;

	private Timestamp operateTime;

	private Timestamp refundTime;

	private Timestamp affirmTime;

	private Timestamp checkTime;

	private short type;

	private short state;

	private short isStock;

	private short isAffirm;

	private String content;

	private String comment;

	public SalesActivityItemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "saiid")
	public long getSaiid() {
		return saiid;
	}

	public void setSaiid(long saiid) {
		this.saiid = saiid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "asid")
	public long getAsid() {
		return asid;
	}

	public void setAsid(long asid) {
		this.asid = asid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "activity")
	public String getActivity() {
		return activity;
	}

	public void setActivity(String activity) {
		this.activity = activity;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "money")
	public int getMoney() {
		return money;
	}

	public void setMoney(int money) {
		this.money = money;
	}

	@Column(name = "integral")
	public int getIntegral() {
		return integral;
	}

	public void setIntegral(int integral) {
		this.integral = integral;
	}

	@Column(name = "expendPrice")
	public int getExpendPrice() {
		return expendPrice;
	}

	public void setExpendPrice(int expendPrice) {
		this.expendPrice = expendPrice;
	}

	@Column(name = "discountPrice")
	public int getDiscountPrice() {
		return discountPrice;
	}

	public void setDiscountPrice(int discountPrice) {
		this.discountPrice = discountPrice;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ruid", referencedColumnName = "uid")
	public UserPO getRefunder() {
		return refunder;
	}

	public void setRefunder(UserPO refunder) {
		this.refunder = refunder;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "refundTime")
	public Timestamp getRefundTime() {
		return refundTime;
	}

	public void setRefundTime(Timestamp refundTime) {
		this.refundTime = refundTime;
	}

	@Column(name = "affirmTime")
	public Timestamp getAffirmTime() {
		return affirmTime;
	}

	public void setAffirmTime(Timestamp affirmTime) {
		this.affirmTime = affirmTime;
	}

	@Column(name = "checkTime")
	public Timestamp getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "state")
	public short getState() {
		return state;
	}

	public void setState(short state) {
		this.state = state;
	}

	@Column(name = "isStock")
	public short getIsStock() {
		return isStock;
	}

	public void setIsStock(short isStock) {
		this.isStock = isStock;
	}

	@Column(name = "isAffirm")
	public short getIsAffirm() {
		return isAffirm;
	}

	public void setIsAffirm(short isAffirm) {
		this.isAffirm = isAffirm;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
