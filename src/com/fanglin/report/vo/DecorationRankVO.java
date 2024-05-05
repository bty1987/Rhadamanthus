package com.fanglin.report.vo;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.vo.UserBaseVO;

public class DecorationRankVO implements java.io.Serializable {

	private static final long serialVersionUID = 56935849863636297L;

	private Integer ddrId;

	private DepartmentVO region;

	private DepartmentVO depte;

	private UserBaseVO designer;

	private Integer month;

	private Long rank;

	private Integer rank1;

	private Integer rank2;

	private Integer rank3;

	private Long sachi;

	private Integer sranku;

	private Integer srankd;

	private Integer srankr;

	private Long tachi;

	private Integer tranku;

	private Integer trankd;

	private Integer trankr;

	private Short type;

	private Integer status;

	public DecorationRankVO() {
		super();
	}

	public DecorationRankVO(DepartmentVO region, DepartmentVO depte, UserBaseVO designer) {
		super();
		this.region = region;
		this.depte = depte;
		this.designer = designer;
	}

	public Integer getDdrId() {
		return ddrId;
	}

	public void setDdrId(Integer ddrId) {
		this.ddrId = ddrId;
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

	public UserBaseVO getDesigner() {
		return designer;
	}

	public void setDesigner(UserBaseVO designer) {
		this.designer = designer;
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

	public Integer getRank3() {
		return rank3;
	}

	public void setRank3(Integer rank3) {
		this.rank3 = rank3;
	}

	public Long getSachi() {
		return sachi;
	}

	public void setSachi(Long sachi) {
		this.sachi = sachi;
	}

	public Integer getSranku() {
		return sranku;
	}

	public void setSranku(Integer sranku) {
		this.sranku = sranku;
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

	public Integer getTranku() {
		return tranku;
	}

	public void setTranku(Integer tranku) {
		this.tranku = tranku;
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