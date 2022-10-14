package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "user7achievement", catalog = "report")
public class UserAchievementPO implements java.io.Serializable {

	private static final long serialVersionUID = -6204854864657499635L;

	private long uaid;

	private int year; // 年份

	private int month; // 月份

	private long cs0; // 总数

	private long cs1; // 在职总数

	private long cs2; // 离职总数

	private long cs3; // 入职人数

	private long cs4; // 离职人数

	private long cs5; // 调职人数

	private int company; // 公司

	public UserAchievementPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "uaid")
	public long getUaid() {
		return uaid;
	}

	public void setUaid(long uaid) {
		this.uaid = uaid;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	@Column(name = "cs0")
	public long getCs0() {
		return cs0;
	}

	public void setCs0(long cs0) {
		this.cs0 = cs0;
	}

	@Column(name = "cs1")
	public long getCs1() {
		return cs1;
	}

	public void setCs1(long cs1) {
		this.cs1 = cs1;
	}

	@Column(name = "cs2")
	public long getCs2() {
		return cs2;
	}

	public void setCs2(long cs2) {
		this.cs2 = cs2;
	}

	@Column(name = "cs3")
	public long getCs3() {
		return cs3;
	}

	public void setCs3(long cs3) {
		this.cs3 = cs3;
	}

	@Column(name = "cs4")
	public long getCs4() {
		return cs4;
	}

	public void setCs4(long cs4) {
		this.cs4 = cs4;
	}

	@Column(name = "cs5")
	public long getCs5() {
		return cs5;
	}

	public void setCs5(long cs5) {
		this.cs5 = cs5;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
