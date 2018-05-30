package com.fanglin.store.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "morderItem", catalog = "store")
public class MorderItemPO implements Serializable{

	private static final long serialVersionUID = -7181108522256921462L;
	
	public static final String COLUMN_OID_STR = "morder.oid";
	
	public static final short STATUS_DELETE_STR = 3;

	private long oiid;
	
	private MorderPO morder;
	
	private MpricePO mprice;
	
	private short num;
	
	private short status;

	public MorderItemPO() {
		super();
	}

	public MorderItemPO(MorderPO morder, MpricePO mprice) {
		super();
		this.morder = morder;
		this.mprice = mprice;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "oiid")
	public long getOiid() {
		return oiid;
	}

	public void setOiid(long oiid) {
		this.oiid = oiid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "oid", referencedColumnName="oid")
	public MorderPO getMorder() {
		return morder;
	}

	public void setMorder(MorderPO morder) {
		this.morder = morder;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pid", referencedColumnName="pid")
	public MpricePO getMprice() {
		return mprice;
	}

	public void setMprice(MpricePO mprice) {
		this.mprice = mprice;
	}

	@Column(name = "num")
	public short getNum() {
		return num;
	}

	public void setNum(short num) {
		this.num = num;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
