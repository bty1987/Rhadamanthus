package com.fanglin.data.po;

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
@Table(name = "cormood", catalog = "data")
public class CormoodPO implements Serializable {

	private static final long serialVersionUID = 6581325512288639784L;

	public static final String COLUMN_QFID_STR = "qfid";

	// 状态:0=有效 1=无效(对齐 cormrice)
	public static final short STATUS_VALID_STR = 0;

	public static final short STATUS_INVALID_STR = 1;

	private long cgid;

	private long qfid;

	private String name;

	private NoodsPO noods;

	private String normunit;

	private int normnum;

	private String storeunit;

	private int storenum;

	private int price;

	private short status;

	public CormoodPO() {
		super();
	}

	public CormoodPO(NoodsPO noods) {
		super();
		this.noods = noods;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cgid")
	public long getCgid() {
		return cgid;
	}

	public void setCgid(long cgid) {
		this.cgid = cgid;
	}

	@Column(name = "qfid")
	public long getQfid() {
		return qfid;
	}

	public void setQfid(long qfid) {
		this.qfid = qfid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "nid", referencedColumnName = "nid")
	public NoodsPO getNoods() {
		return noods;
	}

	public void setNoods(NoodsPO noods) {
		this.noods = noods;
	}

	@Column(name = "normunit")
	public String getNormunit() {
		return normunit;
	}

	public void setNormunit(String normunit) {
		this.normunit = normunit;
	}

	@Column(name = "normnum")
	public int getNormnum() {
		return normnum;
	}

	public void setNormnum(int normnum) {
		this.normnum = normnum;
	}

	@Column(name = "storeunit")
	public String getStoreunit() {
		return storeunit;
	}

	public void setStoreunit(String storeunit) {
		this.storeunit = storeunit;
	}

	@Column(name = "storenum")
	public int getStorenum() {
		return storenum;
	}

	public void setStorenum(int storenum) {
		this.storenum = storenum;
	}

	@Column(name = "price")
	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
