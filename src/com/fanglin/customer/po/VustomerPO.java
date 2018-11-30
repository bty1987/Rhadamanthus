package com.fanglin.customer.po;

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
@Table(name = "vustomer", catalog = "customer")
public class VustomerPO implements Serializable {

	private static final long serialVersionUID = 878679679282307928L;

	public static final String COLUMN_UNIONID_STR = "unionId";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_USERID_STR = "belonger.userId";

	public static final String COLUMN_PHONE_STR = "phone";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long vid;

	private String unionId;

	private UserPO belonger;

	private String name;

	private String phone;

	private String referrer;

	private String referphone;

	private Timestamp createTime;

	private String address;

	private String orderId;

	private float contractPrice;

	private short status;

	private String comment;

	public VustomerPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "vid")
	public long getVid() {
		return vid;
	}

	public void setVid(long vid) {
		this.vid = vid;
	}

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "buid", referencedColumnName = "uid")
	public UserPO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserPO belonger) {
		this.belonger = belonger;
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

	@Column(name = "referrer")
	public String getReferrer() {
		return referrer;
	}

	public void setReferrer(String referrer) {
		this.referrer = referrer;
	}

	@Column(name = "referphone")
	public String getReferphone() {
		return referphone;
	}

	public void setReferphone(String referphone) {
		this.referphone = referphone;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "contractPrice")
	public float getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(float contractPrice) {
		this.contractPrice = contractPrice;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
