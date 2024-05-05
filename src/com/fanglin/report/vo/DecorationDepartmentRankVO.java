package com.fanglin.report.vo;

import com.fanglin.communion.vo.DepartmentVO;

public class DecorationDepartmentRankVO implements java.io.Serializable {

	private static final long serialVersionUID = -6744798089876535809L;

	private Integer dddrId;

	private DepartmentVO region;

	private DepartmentVO depte;

	private Integer month;

	private Long rank;

	private Integer rank1;

	private Integer rank2;

	private Long sachi;

	private Integer srankd;

	private Integer srankr;

	private Long tachi;

	private Integer trankd;

	private Integer trankr;

	private Short type;

	private Integer status;

	public DecorationDepartmentRankVO() {
		super();

	}

	public DecorationDepartmentRankVO(DepartmentVO region, DepartmentVO depte) {
		super();
		this.region = region;
		this.depte = depte;
	}

	public Integer getDddrId() {
		return dddrId;
	}

	public void setDddrId(Integer dddrId) {
		this.dddrId = dddrId;
	}

	public DepartmentVO getRegion() {
		return region;
	}

	public void setRegion(DepartmentVO region) {
		this.region = region;
	}

	public DepartmentVO getDepte() {
		return depte;
	}

	public void setDepte(DepartmentVO depte) {
		this.depte = depte;
	}

	public Integer getMonth() {
		return month;
	}

	public void setMonth(Integer month) {
		this.month = month;
	}

	public Long getRank() {
		return rank;
	}

	public void setRank(Long rank) {
		this.rank = rank;
	}

	public Integer getRank1() {
		return rank1;
	}

	public void setRank1(Integer rank1) {
		this.rank1 = rank1;
	}

	public Integer getRank2() {
		return rank2;
	}

	public void setRank2(Integer rank2) {
		this.rank2 = rank2;
	}

	public Long getSachi() {
		return sachi;
	}

	public void setSachi(Long sachi) {
		this.sachi = sachi;
	}

	public Integer getSrankd() {
		return srankd;
	}

	public void setSrankd(Integer srankd) {
		this.srankd = srankd;
	}

	public Integer getSrankr() {
		return srankr;
	}

	public void setSrankr(Integer srankr) {
		this.srankr = srankr;
	}

	public Long getTachi() {
		return tachi;
	}

	public void setTachi(Long tachi) {
		this.tachi = tachi;
	}

	public Integer getTrankd() {
		return trankd;
	}

	public void setTrankd(Integer trankd) {
		this.trankd = trankd;
	}

	public Integer getTrankr() {
		return trankr;
	}

	public void setTrankr(Integer trankr) {
		this.trankr = trankr;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

}