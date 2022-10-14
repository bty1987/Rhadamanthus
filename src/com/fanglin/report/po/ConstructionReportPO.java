package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "construction7achievement", catalog = "report")
public class ConstructionReportPO implements java.io.Serializable {

	private static final long serialVersionUID = 2919389551222483571L;

	private long caid;

	private int year; // 年份

	private int month; // 月份

	private long cs0; // 未开工数

	private long cs1; // 开工数

	private long cs2; // 完工数

	private long cs3; // 砌墙

	private long cs4; // 铲大白

	private long cs5;// 放线

	private long cs6; // 水暖

	private long cs7; // 力工

	private long cs8;// 电工

	private long cs9; // 瓦工

	private long cs10; // 地面找平

	private long cs11; // 木工

	private long cs12; // 油工

	private long cs13; // 水电验收

	private long cs14; // 保洁

	private int company; // 公司

	public ConstructionReportPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "caid")
	public long getCaid() {
		return caid;
	}

	public void setCaid(long caid) {
		this.caid = caid;
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

	@Column(name = "cs6")
	public long getCs6() {
		return cs6;
	}

	public void setCs6(long cs6) {
		this.cs6 = cs6;
	}

	@Column(name = "cs7")
	public long getCs7() {
		return cs7;
	}

	public void setCs7(long cs7) {
		this.cs7 = cs7;
	}

	public long getCs8() {
		return cs8;
	}

	public void setCs8(long cs8) {
		this.cs8 = cs8;
	}

	public long getCs9() {
		return cs9;
	}

	public void setCs9(long cs9) {
		this.cs9 = cs9;
	}

	public long getCs10() {
		return cs10;
	}

	public void setCs10(long cs10) {
		this.cs10 = cs10;
	}

	public long getCs11() {
		return cs11;
	}

	public void setCs11(long cs11) {
		this.cs11 = cs11;
	}

	public long getCs12() {
		return cs12;
	}

	public void setCs12(long cs12) {
		this.cs12 = cs12;
	}

	public long getCs13() {
		return cs13;
	}

	public void setCs13(long cs13) {
		this.cs13 = cs13;
	}

	public long getCs14() {
		return cs14;
	}

	public void setCs14(long cs14) {
		this.cs14 = cs14;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
