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

@Entity
@Table(name = "decorationregionrank", catalog = "report")
public class DecorationRegionRankPO implements java.io.Serializable {

	private static final long serialVersionUID = 4985808246215863830L;

	public static final int STATUS_TYPE_INIT_INT = 0;

	public static final int STATUS_TYPE_DISABLED_INT = 1;

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_RANK_STR = "rank";

	public static final String COLUMN_COMPANY_STR = "company";

	private int ddrrId;

	private DepartmentPO region;

	private int month;

	private long rank;

	private int rank1;

	private long sachi;

	private int srankr;

	private long tachi;

	private int trankr;

	private short type;

	private int status;

	private int company;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ddrrId")
	public int getDdrrId() {
		return this.ddrrId;
	}

	public void setDdrrId(int ddrrId) {
		this.ddrrId = ddrrId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "drid", referencedColumnName = "did")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
	}

	@Column(name = "month")
	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	@Column(name = "rank")
	public long getRank() {
		return this.rank;
	}

	public void setRank(long rank) {
		this.rank = rank;
	}

	@Column(name = "rank1")
	public int getRank1() {
		return rank1;
	}

	public void setRank1(int rank1) {
		this.rank1 = rank1;
	}

	@Column(name = "sachi")
	public long getSachi() {
		return sachi;
	}

	public void setSachi(long sachi) {
		this.sachi = sachi;
	}

	@Column(name = "srankr")
	public int getSrankr() {
		return srankr;
	}

	public void setSrankr(int srankr) {
		this.srankr = srankr;
	}

	@Column(name = "tachi")
	public long getTachi() {
		return tachi;
	}

	public void setTachi(long tachi) {
		this.tachi = tachi;
	}

	@Column(name = "trankr")
	public int getTrankr() {
		return trankr;
	}

	public void setTrankr(int trankr) {
		this.trankr = trankr;
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