package com.fanglin.report.vo;


public class DecorationDesignerRankVO implements java.io.Serializable {

	private static final long serialVersionUID = 56935849863636297L;

	private Integer ddrId;
	
	private String designerId;
	
	private String designerName;
	
	private String createTime;
	
	private String endTime;
	
	private Double rank;
	
	private Integer status;

	public Integer getDdrId() {
		return ddrId;
	}

	public void setDdrId(Integer ddrId) {
		this.ddrId = ddrId;
	}

	public String getDesignerId() {
		return designerId;
	}

	public void setDesignerId(String designerId) {
		this.designerId = designerId;
	}

	public String getDesignerName() {
		return designerName;
	}

	public void setDesignerName(String designerName) {
		this.designerName = designerName;
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