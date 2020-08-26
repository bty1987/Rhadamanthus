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
	
	private int cs14;
	
	private int cs15;
	
	private int cs16;
	
	private int cs17;
	
	private int cs18;
	
	private int cs19;
	
	private int cs20;
	
	private int cs21;
	
	private int cs22;
	
	private int cs23;
	
	private int cs24;
	
	private int cs25;
	
	private int cs26;

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

	@Column(name = "cs14")
	public int getCs14() {
		return cs14;
	}

	public void setCs14(int cs14) {
		this.cs14 = cs14;
	}

	@Column(name = "cs15")
	public int getCs15() {
		return cs15;
	}

	public void setCs15(int cs15) {
		this.cs15 = cs15;
	}

	@Column(name = "cs16")
	public int getCs16() {
		return cs16;
	}

	public void setCs16(int cs16) {
		this.cs16 = cs16;
	}

	@Column(name = "cs17")
	public int getCs17() {
		return cs17;
	}

	public void setCs17(int cs17) {
		this.cs17 = cs17;
	}

	@Column(name = "cs18")
	public int getCs18() {
		return cs18;
	}

	public void setCs18(int cs18) {
		this.cs18 = cs18;
	}

	@Column(name = "cs19")
	public int getCs19() {
		return cs19;
	}

	public void setCs19(int cs19) {
		this.cs19 = cs19;
	}

	@Column(name = "cs20")
	public int getCs20() {
		return cs20;
	}

	public void setCs20(int cs20) {
		this.cs20 = cs20;
	}

	@Column(name = "cs21")
	public int getCs21() {
		return cs21;
	}

	public void setCs21(int cs21) {
		this.cs21 = cs21;
	}

	@Column(name = "cs22")
	public int getCs22() {
		return cs22;
	}

	public void setCs22(int cs22) {
		this.cs22 = cs22;
	}

	@Column(name = "cs23")
	public int getCs23() {
		return cs23;
	}

	public void setCs23(int cs23) {
		this.cs23 = cs23;
	}

	@Column(name = "cs24")
	public int getCs24() {
		return cs24;
	}

	public void setCs24(int cs24) {
		this.cs24 = cs24;
	}

	@Column(name = "cs25")
	public int getCs25() {
		return cs25;
	}

	public void setCs25(int cs25) {
		this.cs25 = cs25;
	}

	@Column(name = "cs26")
	public int getCs26() {
		return cs26;
	}

	public void setCs26(int cs26) {
		this.cs26 = cs26;
	}
	
}
