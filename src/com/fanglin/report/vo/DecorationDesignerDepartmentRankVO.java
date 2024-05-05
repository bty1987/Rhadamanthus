package com.fanglin.report.vo;

import com.fanglin.communion.vo.DepartmentVO;

public class DecorationDesignerDepartmentRankVO implements java.io.Serializable {

	private static final long serialVersionUID = -6744798089876535809L;

	private Integer dddrId;

	private DepartmentVO region;

	private DepartmentVO depte;

	private Integer month;

	private Double rank;

	private Integer rank1;

	private Integer rank2;

	private Short type;

	private Integer status;

	public DecorationDesignerDepartmentRankVO() {
		super();

	}

	public DecorationDesignerDepartmentRankVO(DepartmentVO region, DepartmentVO depte) {
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

	public Double getRank() {
		return rank;
	}

	public void setRank(Double rank) {
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