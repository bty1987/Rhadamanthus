package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "extension", catalog = "quotation")
public class ExtensionPO implements Serializable {

	private static final long serialVersionUID = -3842029738524298580L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_TYPE_STR = "type";

	public static final short STATUS_INIT_SHORT = 0;

	public static final short STATUS_LOCK_INT = 1;

	public static final short TYPE_ADD_INT = 0;

	public static final short TYPE_SUB_INT = 1;

	private long eid;

	private String orderId;

	private short type;

	private float undisPrice;

	private float disPrice;

	private float total;

	private short status;

	private Timestamp createTime;

	private String content;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "eid")
	public long getEid() {
		return eid;
	}

	public void setEid(long eid) {
		this.eid = eid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "undisPrice")
	public float getUndisPrice() {
		return undisPrice;
	}

	public void setUndisPrice(float undisPrice) {
		this.undisPrice = undisPrice;
	}

	@Column(name = "disPrice")
	public float getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(float disPrice) {
		this.disPrice = disPrice;
	}

	@Column(name = "total")
	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
