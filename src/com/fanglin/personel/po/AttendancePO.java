package com.fanglin.personel.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "attendance", catalog = "communion")
public class AttendancePO implements Serializable {

	private static final long serialVersionUID = -1155285139168203888L;

	private long aid;
	
	private long uid;
	
	private int month;
	
	private short a1;
	
	private short a2;
	
	private short a3;
	
	private short a4;
	
	private short a5;
	
	private short a6;
	
	private short a7;
	
	private short a8;
	
	private short a9;
	
	private short a10;
	
	private short a11;
	
	private short a12;
	
	private short a13;
	
	private short a14;
	
	private short a15;
	
	private short a16;
	
	private short a17;
	
	private short a18;
	
	private short a19;
	
	private short a20;
	
	private short a21;
	
	private short a22;
	
	private short a23;
	
	private short a24;
	
	private short a25;
	
	private short a26;
	
	private short a27;
	
	private short a28;
	
	private short a29;
	
	private short a30;

	private short a31;
	
	public AttendancePO() {
		super();
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}
	
	@Column(name = "uid")
	public long getUid() {
		return uid;
	}

	public void setUid(long uid) {
		this.uid = uid;
	}
	
	@Column(name = "month")
	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	@Column(name = "a1")
	public short getA1() {
		return a1;
	}

	public void setA1(short a1) {
		this.a1 = a1;
	}

	@Column(name = "a2")
	public short getA2() {
		return a2;
	}

	public void setA2(short a2) {
		this.a2 = a2;
	}

	@Column(name = "a3")
	public short getA3() {
		return a3;
	}

	public void setA3(short a3) {
		this.a3 = a3;
	}

	@Column(name = "a4")
	public short getA4() {
		return a4;
	}

	public void setA4(short a4) {
		this.a4 = a4;
	}
	
	@Column(name = "a5")
	public short getA5() {
		return a5;
	}

	public void setA5(short a5) {
		this.a5 = a5;
	}

	@Column(name = "a6")
	public short getA6() {
		return a6;
	}

	public void setA6(short a6) {
		this.a6 = a6;
	}

	@Column(name = "a7")
	public short getA7() {
		return a7;
	}

	public void setA7(short a7) {
		this.a7 = a7;
	}

	@Column(name = "a8")
	public short getA8() {
		return a8;
	}

	public void setA8(short a8) {
		this.a8 = a8;
	}

	@Column(name = "a9")
	public short getA9() {
		return a9;
	}

	public void setA9(short a9) {
		this.a9 = a9;
	}

	@Column(name = "a10")
	public short getA10() {
		return a10;
	}

	public void setA10(short a10) {
		this.a10 = a10;
	}

	@Column(name = "a11")
	public short getA11() {
		return a11;
	}

	public void setA11(short a11) {
		this.a11 = a11;
	}

	@Column(name = "a12")
	public short getA12() {
		return a12;
	}

	public void setA12(short a12) {
		this.a12 = a12;
	}

	@Column(name = "a13")
	public short getA13() {
		return a13;
	}

	public void setA13(short a13) {
		this.a13 = a13;
	}

	@Column(name = "a14")
	public short getA14() {
		return a14;
	}

	public void setA14(short a14) {
		this.a14 = a14;
	}

	@Column(name = "a15")
	public short getA15() {
		return a15;
	}

	public void setA15(short a15) {
		this.a15 = a15;
	}

	@Column(name = "a16")
	public short getA16() {
		return a16;
	}

	public void setA16(short a16) {
		this.a16 = a16;
	}

	@Column(name = "a17")
	public short getA17() {
		return a17;
	}

	public void setA17(short a17) {
		this.a17 = a17;
	}

	@Column(name = "a18")
	public short getA18() {
		return a18;
	}

	public void setA18(short a18) {
		this.a18 = a18;
	}

	@Column(name = "a19")
	public short getA19() {
		return a19;
	}

	public void setA19(short a19) {
		this.a19 = a19;
	}

	@Column(name = "a20")
	public short getA20() {
		return a20;
	}

	public void setA20(short a20) {
		this.a20 = a20;
	}

	@Column(name = "a21")
	public short getA21() {
		return a21;
	}

	public void setA21(short a21) {
		this.a21 = a21;
	}

	@Column(name = "a22")
	public short getA22() {
		return a22;
	}

	public void setA22(short a22) {
		this.a22 = a22;
	}

	@Column(name = "a23")
	public short getA23() {
		return a23;
	}

	public void setA23(short a23) {
		this.a23 = a23;
	}

	@Column(name = "a24")
	public short getA24() {
		return a24;
	}

	public void setA24(short a24) {
		this.a24 = a24;
	}

	@Column(name = "a25")
	public short getA25() {
		return a25;
	}

	public void setA25(short a25) {
		this.a25 = a25;
	}
	
	@Column(name = "a26")
	public short getA26() {
		return a26;
	}

	public void setA26(short a26) {
		this.a26 = a26;
	}

	@Column(name = "a27")
	public short getA27() {
		return a27;
	}

	public void setA27(short a27) {
		this.a27 = a27;
	}

	@Column(name = "a28")
	public short getA28() {
		return a28;
	}

	public void setA28(short a28) {
		this.a28 = a28;
	}

	@Column(name = "a29")
	public short getA29() {
		return a29;
	}

	public void setA29(short a29) {
		this.a29 = a29;
	}

	@Column(name = "a30")
	public short getA30() {
		return a30;
	}

	public void setA30(short a30) {
		this.a30 = a30;
	}

	@Column(name = "a31")
	public short getA31() {
		return a31;
	}

	public void setA31(short a31) {
		this.a31 = a31;
	}

}
