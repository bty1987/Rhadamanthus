package com.fanglin.report.vo;

import com.fanglin.communion.vo.DepartmentVO;

public class DecorationRegionRankVO implements java.io.Serializable {

	private static final long serialVersionUID = 8455800051413554029L;

	private Integer ddrrId;

	private DepartmentVO region;

	private Integer month;

	private Long rank;

	private Integer rank1;

	private Long sachi;

	private Integer srankr;

	private Long tachi;

	private Integer trankr;

	private Short type;

	private Integer status;

	public DecorationRegionRankVO() {
		super();
	}

	public DecorationRegionRankVO(DepartmentVO region) {
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

	public Long getSachi() {
		return sachi;
	}

	public void setSachi(Long sachi) {
		this.sachi = sachi;
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