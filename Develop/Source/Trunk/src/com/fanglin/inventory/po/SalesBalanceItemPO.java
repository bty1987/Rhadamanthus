package com.fanglin.inventory.po;

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
@Table(name="salesbalanceitem",catalog = "inventory")
public class SalesBalanceItemPO implements Serializable{

	private static final long serialVersionUID = 5810856768343688079L;
	
	public static final String COLUMN_SBID_STR = "sbid";
	
	private long sbiid;
	
	private long sbid;
	
	private SalesItemPO salesItem;
	
	private short rawCtype;
	
	private float rawCvalue;
	
	private short ctype;
	
	private float cvalue;
	
	private float num;
	
	private float total;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sbiid")
	public long getSbiid() {
		return sbiid;
	}

	public void setSbiid(long sbiid) {
		this.sbiid = sbiid;
	}

	@Column(name = "sbid")
	public long getSbid() {
		return sbid;
	}

	public void setSbid(long sbid) {
		this.sbid = sbid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siid", referencedColumnName = "siid")
	public SalesItemPO getSalesItem() {
		return salesItem;
	}

	public void setSalesItem(SalesItemPO salesItem) {
		this.salesItem = salesItem;
	}

	@Column(name = "rawCtype")
	public short getRawCtype() {
		return rawCtype;
	}

	public void setRawCtype(short rawCtype) {
		this.rawCtype = rawCtype;
	}

	@Column(name = "rawCvalue")
	public float getRawCvalue() {
		return rawCvalue;
	}

	public void setRawCvalue(float rawCvalue) {
		this.rawCvalue = rawCvalue;
	}

	@Column(name = "ctype")
	public short getCtype() {
		return ctype;
	}

	public void setCtype(short ctype) {
		this.ctype = ctype;
	}

	@Column(name = "cvalue")
	public float getCvalue() {
		return cvalue;
	}

	public void setCvalue(float cvalue) {
		this.cvalue = cvalue;
	}

	@Column(name = "num")
	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}

	@Column(name = "total")
	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}
	
}
