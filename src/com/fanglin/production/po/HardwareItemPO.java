package com.fanglin.production.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "hardwareitem", catalog = "production")
public class HardwareItemPO implements Serializable {

	private static final long serialVersionUID = 676285094031271054L;

	public static final String COLUMN_HID_STR = "hid";

	private long hiid;

	private long hid;

	private String name;

	private int num;

	private int unitprice;

	private String measurementunit;

	private String comment;

	private long total;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "hiid")
	public long getHiid() {
		return hiid;
	}

	public void setHiid(long hiid) {
		this.hiid = hiid;
	}

	@Column(name = "hid")
	public long getHid() {
		return hid;
	}

	public void setHid(long hid) {
		this.hid = hid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "unitprice")
	public int getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(int unitprice) {
		this.unitprice = unitprice;
	}

	@Column(name = "measurementunit")
	public String getMeasurementunit() {
		return measurementunit;
	}

	public void setMeasurementunit(String measurementunit) {
		this.measurementunit = measurementunit;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

}
