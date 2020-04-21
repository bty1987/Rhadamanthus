package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.system.po.CompanyPO;


@Entity
@Table(name = "decoration4construction", catalog = "report")
public class DecorationReportPO implements java.io.Serializable {

	private static final long serialVersionUID = 8648030858497280690L;
	

	private long dcid;
	
	private CompanyPO company;
	
	private int cs0; // 未开工
	
	private int cs1; // 已开工
	
	private int cs2; // 已完工
	
	private int cs3; // 铲大白
	
	private int cs4; // 放线
	
	private int cs5; // 水暖
	
	private int cs6; // 力工
	
	private int cs7; // 电工
	
	private int cs8; // 瓦工
	
	private int cs9; // 地面找平
	
	private int cs10; // 木工
	
	private int cs11; // 油工
	
	private int cs12; // 水电验收
	
	private int cs13; // 保洁

	public DecorationReportPO() {
		super();
	}
	
	public DecorationReportPO(CompanyPO company) {
		super();
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dcid")
	public long getDcid() {
		return dcid;
	}
	
	public void setDcid(long dcid) {
		this.dcid = dcid;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cdid", referencedColumnName = "cid")
	public CompanyPO getCompany() {
		return company;
	}

	public void setCompany(CompanyPO company) {
		this.company = company;
	}

	@Column(name = "cs0")
	public int getCs0() {
		return cs0;
	}
	
	public void setCs0(int cs0) {
		this.cs0 = cs0;
	}

	@Column(name = "cs1")
	public int getCs1() {
		return cs1;
	}

	public void setCs1(int cs1) {
		this.cs1 = cs1;
	}
	
	@Column(name = "cs2")
	public int getCs2() {
		return cs2;
	}
	
	public void setCs2(int cs2) {
		this.cs2 = cs2;
	}
	
	@Column(name = "cs3")
	public int getCs3() {
		return cs3;
	}
	
	public void setCs3(int cs3) {
		this.cs3 = cs3;
	}
	
	@Column(name = "cs4")
	public int getCs4() {
		return cs4;
	}
	
	public void setCs4(int cs4) {
		this.cs4 = cs4;
	}
	
	@Column(name = "cs5")
	public int getCs5() {
		return cs5;
	}
	
	public void setCs5(int cs5) {
		this.cs5 = cs5;
	}

	@Column(name = "cs6")
	public int getCs6() {
		return cs6;
	}
	
	public void setCs6(int cs6) {
		this.cs6 = cs6;
	}
	
	@Column(name = "cs7")
	public int getCs7() {
		return cs7;
	}
	
	public void setCs7(int cs7) {
		this.cs7 = cs7;
	}
	
	@Column(name = "cs8")
	public int getCs8() {
		return cs8;
	}
	
	public void setCs8(int cs8) {
		this.cs8 = cs8;
	}
	
	@Column(name = "cs9")
	public int getCs9() {
		return cs9;
	}
	
	public void setCs9(int cs9) {
		this.cs9 = cs9;
	}
	
	@Column(name = "cs10")
	public int getCs10() {
		return cs10;
	}
	
	public void setCs10(int cs10) {
		this.cs10 = cs10;
	}
	
	@Column(name = "cs11")
	public int getCs11() {
		return cs11;
	}
	
	public void setCs11(int cs11) {
		this.cs11 = cs11;
	}
	
	@Column(name = "cs12")
	public int getCs12() {
		return cs12;
	}
	
	public void setCs12(int cs12) {
		this.cs12 = cs12;
	}
	
	@Column(name = "cs13")
	public int getCs13() {
		return cs13;
	}
	
	public void setCs13(int cs13) {
		this.cs13 = cs13;
	}

}
