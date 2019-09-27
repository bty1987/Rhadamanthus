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
public class MorderItemPO implements Serializable {

	private static final long serialVersionUID = -7181108522256921462L;

	public static final String COLUMN_OID_STR = "oid";

	public static final short STATUS_DELETE_STR = 3;

	private long oiid;

	private long oid;

	private MpricePO mprice;

	private long num;

	public MorderItemPO() {
		super();
	}

	public MorderItemPO(MpricePO mprice) {
		super();
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

	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pid", referencedColumnName = "pid")
	public MpricePO getMprice() {
		return mprice;
	}

	public void setMprice(MpricePO mprice) {
		this.mprice = mprice;
	}

	@Column(name = "num")
	public long getNum() {
		return num;
	}

	public void setNum(long num) {
		this.num = num;
	}

}
