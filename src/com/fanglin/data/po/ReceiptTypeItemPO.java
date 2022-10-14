package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "receiptTypeItem", catalog = "data")
public class ReceiptTypeItemPO implements Serializable {

	private static final long serialVersionUID = 5155582212911679224L;

	public static final String COLUMN_RTID_STR = "rtid";

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_PAYTYPE_STR = "paytype";

	private long rtiid;

	private long rtid;

	private String no;

	private String name;

	private short type;

	private short paytype;

	public ReceiptTypeItemPO() {
		super();
	}

	public ReceiptTypeItemPO(long rtiid) {
		super();
		this.rtiid = rtiid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "rtiid")
	public long getRtiid() {
		return rtiid;
	}

	public void setRtiid(long rtiid) {
		this.rtiid = rtiid;
	}

	@Column(name = "rtid")
	public long getRtid() {
		return rtid;
	}

	public void setRtid(long rtid) {
		this.rtid = rtid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "paytype")
	public short getPaytype() {
		return paytype;
	}

	public void setPaytype(short paytype) {
		this.paytype = paytype;
	}

}
