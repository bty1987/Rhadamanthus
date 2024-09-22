package com.fanglin.kingdee.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "kingdeeRecord", catalog = "platform")
public class KingdeeRecordPO implements Serializable {

	private static final long serialVersionUID = -8903497496550527323L;

	public static final String COLUMN_KRID_STR = "krid";

	private long krid;

	private String orderId;

	private long rtid;

	private short atttype;

	private String type;

	private String message;

	private Timestamp createTime;

	public KingdeeRecordPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "krid")
	public long getKrid() {
		return krid;
	}

	public void setKrid(long krid) {
		this.krid = krid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "rtid")
	public long getRtid() {
		return rtid;
	}

	public void setRtid(long rtid) {
		this.rtid = rtid;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "type")
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "message")
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
