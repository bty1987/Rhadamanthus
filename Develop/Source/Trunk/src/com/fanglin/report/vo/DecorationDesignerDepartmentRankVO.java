package com.fanglin.report.vo;


public class DecorationDesignerDepartmentRankVO implements java.io.Serializable {

	private static final long serialVersionUID = -6744798089876535809L;

	private Integer dddrId;
	
	private String designerDeptId;
	
	private String designerDeptName;
	
	private String createTime;
	
	private String endTime;
	
	private Double rank;
	
	private Integer status;

	public Integer getDddrId() {
		return dddrId;
	}

	public void setDddrId(Integer dddrId) {
		this.dddrId = dddrId;
	}

	public String getDesignerDeptId() {
		return designerDeptId;
	}

	public void setDesignerDeptId(String designerDeptId) {
		this.designerDeptId = designerDeptId;
	}

	public String getDesignerDeptName() {
		return designerDeptName;
	}

	public void setDesignerDeptName(String designerDeptName) {
		this.designerDeptName = designerDeptName;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public Double getRank() {
		return rank;
	}

	public void setRank(Double rank) {
		this.rank = rank;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}


}