package com.fanglin.report.vo;

import com.fanglin.communion.vo.DepartmentVO;

public class DecorationDesignerRegionRankVO implements java.io.Serializable {

	private static final long serialVersionUID = 8455800051413554029L;

	private Integer ddrrId;

	private DepartmentVO region;

	private Integer month;

	private Double rank;

	private Integer rank1;

	private Short type;

	private Integer status;

	public DecorationDesignerRegionRankVO() {
		super();
	}

	public DecorationDesignerRegionRankVO(DepartmentVO region) {
		super();
		this.region = region;
	}

	public Integer getDdrrId() {
		return ddrrId;
	}

	public void setDdrrId(Integer ddrrId) {
		this.ddrrId = ddrrId;
	}

	public DepartmentVO getRegion() {
		return region;
	}

	public void setRegion(DepartmentVO region) {
		this.region = region;
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