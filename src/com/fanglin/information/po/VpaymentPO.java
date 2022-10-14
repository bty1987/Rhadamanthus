package com.fanglin.information.po;

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
@Table(name = "vpayment", catalog = "information")
public class VpaymentPO implements Serializable {

	private static final long serialVersionUID = -5292403662672343953L;

	public static final String COLUMN_MNO_STR = "mno";

	public static final String COLUMN_BRAND_STR = "brand";

	public static final String COLUMN_CREATER_STR = "creater.userId";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_EXPIRE_STR = "expire";

	public static final short STATUS_INIT_INT = 0; // 未付款

	public static final short STATUS_PAYED_INT = 1; // 已付款

	public static final short EXPIRE_INIT_INT = 0; // 有效

	public static final short EXPIRE_INVALID_INT = 1;// 到期

	public static final short TYPE_RENOVATION_INT = 0; // 装修款

	public static final short TYPE_RENOVATIONDEPOSIT_INT = 1; // 装修定金

	public static final short TYPE_PRINCIPAL_INT = 2; // 主材款

	public static final short TYPE_PRINCIPALDEPOSIT_INT = 3; // 主材定金

	private long vpid;

	private long vaid;

	private String mno;// 会员号

	private String orderId;// 装修单号

	private UserPO creater;// 创建人

	private Timestamp createTime;// 创建时间

	private short type;// 类型 , 0: 装修款 , 1: 装修定金 , 2: 主材款 , 3: 主材定金

	private String category;

	private String brand;// 品牌

	private long money;// 金额

	private VreceiptPO vreceipt;// 活动收据ID

	private short status;// 状态 , 0: 未付款 , 1: 已付款

	private short expire; // 到期标识 , 0: 有效 , 1: 到期

	private String comment;

	public VpaymentPO() {
		super();
	}

	public VpaymentPO(UserPO creater, VreceiptPO vreceipt) {
		super();
		this.creater = creater;
		this.vreceipt = vreceipt;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vpid")
	public long getVpid() {
		return vpid;
	}

	public void setVpid(long vpid) {
		this.vpid = vpid;
	}

	@Column(name = "vaid")
	public long getVaid() {
		return vaid;
	}

	public void setVaid(long vaid) {
		this.vaid = vaid;
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

	@ManyToOne(fetch = FetchType.EAGER)
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

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "vrid", referencedColumnName = "vrid")
	public VreceiptPO getVreceipt() {
		return vreceipt;
	}

	public void setVreceipt(VreceiptPO vreceipt) {
		this.vreceipt = vreceipt;
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
