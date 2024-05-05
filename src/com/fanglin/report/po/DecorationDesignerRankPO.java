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

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "decorationdesignerrank", catalog = "report")
public class DecorationDesignerRankPO implements java.io.Serializable {

	private static final long serialVersionUID = 3153090730609697590L;

	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";

	public static final int STATUS_TYPE_INIT_INT = 0;

	public static final int STATUS_TYPE_DISABLED_INT = 1;

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_RANK_STR = "rank";

	public static final String COLUMN_COMPANY_STR = "company";

	private int ddrId;

	private DepartmentPO region;

	private DepartmentPO depte;

	private UserPO designer;

	private int month;

	private double rank;

	private int rank1;

	private int rank2;

	private int rank3;

	private short type;

	private int status;

	private int company;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ddrId")
	public int getDdrId() {
		return this.ddrId;
	}

	public void setDdrId(int ddrId) {
		this.ddrId = ddrId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "drid", referencedColumnName = "did")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ddid", referencedColumnName = "did")
	public DepartmentPO getDepte() {
		return depte;
	}

	public void setDepte(DepartmentPO depte) {
		this.depte = depte;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "duid", referencedColumnName = "uid")
	public UserPO getDesigner() {
		return designer;
	}

	public void setDesigner(UserPO designer) {
		this.designer = designer;
	}

	@Column(name = "month")
	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	@Column(name = "rank")
	public double getRank() {
		return this.rank;
	}

	public void setRank(double rank) {
		this.rank = rank;
	}

	@Column(name = "rank1")
	public int getRank1() {
		return rank1;
	}

	public void setRank1(int rank1) {
		this.rank1 = rank1;
	}

	@Column(name = "rank2")
	public int getRank2() {
		return rank2;
	}

	public void setRank2(int rank2) {
		this.rank2 = rank2;
	}

	@Column(name = "rank3")
	public int getRank3() {
		return rank3;
	}

	public void setRank3(int rank3) {
		this.rank3 = rank3;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}