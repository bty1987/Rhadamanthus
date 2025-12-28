package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "presignPrice", catalog = "quotation")
public class PresignPricePO implements Serializable {

	private static final long serialVersionUID = -2713605593370588401L;

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long pspid;

	private long ppid;

	private String name;

	private int upperArea;

	private int lowerArea;

	private long price;

	private int costPrice;

	private int mostPrice;

	private int activityPrice;

	private short status;

	public PresignPricePO() {
		super();
	}

	public PresignPricePO(long pspid) {
		super();
		this.pspid = pspid;
	}

	@Id
	@GeneratedValue
	@Column(name = "pspid")
	public long getPspid() {
		return pspid;
	}

	public void setPspid(long pspid) {
		this.pspid = pspid;
	}

	@Column(name = "ppid")
	public long getPpid() {
		return ppid;
	}

	public void setPpid(long ppid) {
		this.ppid = ppid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "upperArea")
	public int getUpperArea() {
		return upperArea;
	}

	public void setUpperArea(int upperArea) {
		this.upperArea = upperArea;
	}

	@Column(name = "lowerArea")
	public int getLowerArea() {
		return lowerArea;
	}

	public void setLowerArea(int lowerArea) {
		this.lowerArea = lowerArea;
	}

	@Column(name = "price")
	public long getPrice() {
		return price;
	}

	public void setPrice(long price) {
		this.price = price;
	}

	@Column(name = "costPrice")
	public int getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(int costPrice) {
		this.costPrice = costPrice;
	}

	@Column(name = "mostPrice")
	public int getMostPrice() {
		return mostPrice;
	}

	public void setMostPrice(int mostPrice) {
		this.mostPrice = mostPrice;
	}

	@Column(name = "activityPrice")
	public int getActivityPrice() {
		return activityPrice;
	}

	public void setActivityPrice(int activityPrice) {
		this.activityPrice = activityPrice;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
