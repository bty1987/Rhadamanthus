package com.fanglin.payment.po;

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
@Table(name = "activitypayment", catalog = "payment")
public class ActivityPaymentPO implements Serializable {

	private static final long serialVersionUID = 953397246184700331L;
	
	public static final String COLUMN_MNO_STR = "mno";

	public static final String COLUMN_CATEGORY_STR = "category";
	
	public static final String COLUMN_BRAND_STR = "brand";

	public static final String COLUMN_CREATER_STR = "creater.userId";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_EXPIRE_STR = "expire";

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_PAYED_INT = 1;

	public static final short EXPIRE_INIT_INT = 0;
	
	private long apid;

	private String mno;// 会员号

	private String orderId;// 装修单号

	private UserPO creater;// 创建人

	private Timestamp createTime;// 创建时间

	private short type;// 类型 , 0: 装修款 , 1: 主材款

	private String category;// 品类

	private String brand;// 品牌

	private long money;// 金额

	private ActivityReceiptPO activityReceipt;// 活动收据ID

	private short status;// 状态 , 0: 未付款 , 1: 已付款

	private short expire; // 到期标识 , 0: 有效 , 1: 到期
	
	private long vaid; // 活动

	private String comment;

	public ActivityPaymentPO() {
		super();
	}

	public ActivityPaymentPO(UserPO creater, ActivityReceiptPO activityReceipt) {
		super();
		this.creater = creater;
		this.activityReceipt = activityReceipt;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "apid")
	public long getApid() {
		return apid;
	}

	public void setApid(long apid) {
		this.apid = apid;
	}

	@Column(name = "mno")
	public String getMno() {
		return mno;
	}

	public void setMno(String mno) {
		this.mno = mno;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "createrId", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "category")
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Column(name = "brand")
	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	@Column(name = "money")
	public long getMoney() {
		return money;
	}

	public void setMoney(long money) {
		this.money = money;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "arid", referencedColumnName = "arid")
	public ActivityReceiptPO getActivityReceipt() {
		return activityReceipt;
	}

	public void setActivityReceipt(ActivityReceiptPO activityReceipt) {
		this.activityReceipt = activityReceipt;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "expire")
	public short getExpire() {
		return expire;
	}

	public void setExpire(short expire) {
		this.expire = expire;
	}
	
	@Column(name = "vaid")
	public long getVaid() {
		return vaid;
	}

	public void setVaid(long vaid) {
		this.vaid = vaid;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}