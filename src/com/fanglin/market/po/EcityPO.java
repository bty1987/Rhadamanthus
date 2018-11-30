package com.fanglin.market.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="ecity", catalog = "market")
public class EcityPO implements Serializable{
	
	private static final long serialVersionUID = 8118959325079454938L;
	
	public static final String COLUMN_ECID_STR = "ecid";
	
	public static final String COLUMN_CITY_STR = "city";
	
	public static final String COLUMN_PINYIN_STR = "pinyin";
	
	public static final String COLUMN_X_STR = "x";
	
	public static final String COLUMN_Y_STR = "y";

	private long ecid;
	
	private String city;
	
	private String pinyin;
	
	private double x;
	
	private double y;
	
	public EcityPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name="ecid")
	public long getEcid() {
		return ecid;
	}

	public void setEcid(long ecid) {
		this.ecid = ecid;
	}

	@Column(name="city")
	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	@Column(name="pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@Column(name="x")
	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	@Column(name="y")
	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}
	
}
