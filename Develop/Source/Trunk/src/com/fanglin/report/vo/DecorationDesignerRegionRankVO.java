package com.fanglin.report.vo;


public class DecorationDesignerRegionRankVO implements java.io.Serializable {

	private static final long serialVersionUID = 8455800051413554029L;

	private Integer ddrrId;
	
	private String designerRegionId;
	
	private String designerRegionName;
	
	private String createTime;
	
	private String endTime;
	
	private Double rank;
	
	private Integer status;

	public Integer getDdrrId() {
		return ddrrId;
	}

	public void setDdrrId(Integer ddrrId) {
		this.ddrrId = ddrrId;
	}

	public String getDesignerRegionId() {
		return designerRegionId;
	}

	public void setDesignerRegionId(String designerRegionId) {
		this.designerRegionId = designerRegionId;
	}

	public String getDesignerRegionName() {
		return designerRegionName;
	}

	public void setDesignerRegionName(String designerRegionName) {
		this.designerRegionName = designerRegionName;
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