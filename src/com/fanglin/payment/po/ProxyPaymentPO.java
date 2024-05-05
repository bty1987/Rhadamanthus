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
@Table(name = "proxypayment", catalog = "payment")
public class ProxyPaymentPO implements Serializable {

	private static final long serialVersionUID = 6036912853003272012L;

	public static final String COLUMN_CREATER_STR = "creater.userId";

	public static final String COLUMN_CREATETIME_STR = "createTime";

	public static final String COLUMN_COLLECTTIME_STR = "proxyReceipt.collectTime";

	public static final String COLUMN_CONFIRMTIME_STR = "proxyReceipt.confirmTime";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_ISEXPIRE_STR = "isexpire";

	public static final short TYPE_COLLECT_INT = 0;

	public static final short TYPE_REFUND_INT = 1;

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_PAY_INT = 1;

	public static final short STATUS_CONFIRM_INT = 2;

	public static final short STATUS_CANCEL_INT = 3;

	private long ppid;

	private ProxyReceiptPO proxyReceipt;

	private String title;

	private String name;

	private String phone;

	private String address;

	private String unionId;

	private String orderId;

	private long referMoney;

	private UserPO creater;

	private Timestamp createTime;

	private int did;

	private int rid;

	private short type;

	private short status;

	private short isexpire; // 过期标识

	private int company;

	public ProxyPaymentPO() {
		super();
	}

	public ProxyPaymentPO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ppid")
	public long getPpid() {
		return ppid;
	}

	public void setPpid(long ppid) {
		this.ppid = ppid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "prid", referencedColumnName = "prid")
	public ProxyReceiptPO getProxyReceipt() {
		return proxyReceipt;
	}

	public void setProxyReceipt(ProxyReceiptPO proxyReceipt) {
		this.proxyReceipt = proxyReceipt;
	}

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "referMoney")
	public long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(long referMoney) {
		this.referMoney = referMoney;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
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

	@Column(name = "did")
	public int getDid() {
		return did;
	}

	public void setDid(int did) {
		this.did = did;
	}

	@Column(name = "rid")
	public int getRid() {
		return rid;
	}

	public void setRid(int rid) {
		this.rid = rid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "isexpire")
	public short getIsexpire() {
		return isexpire;
	}

	public void setIsexpire(short isexpire) {
		this.isexpire = isexpire;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}