package com.fanglin.report.vo;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.vo.UserBaseVO;

public class DecorationDesignerRankVO implements java.io.Serializable {

	private static final long serialVersionUID = 56935849863636297L;

	private Integer ddrId;

	private DepartmentVO region;

	private DepartmentVO depte;

	private UserBaseVO designer;

	private Integer month;

	private Double rank;

	private Integer rank1;

	private Integer rank2;

	private Integer rank3;

	private Short type;

	private Integer status;

	public DecorationDesignerRankVO() {
		super();
	}

	public DecorationDesignerRankVO(DepartmentVO region, DepartmentVO depte, UserBaseVO designer) {
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

	public Integer getRank3() {
		return rank3;
	}

	public void setRank3(Integer rank3) {
		this.rank3 = rank3;
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