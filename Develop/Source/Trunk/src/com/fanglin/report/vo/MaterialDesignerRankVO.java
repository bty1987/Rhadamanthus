package com.fanglin.report.vo;

public class MaterialDesignerRankVO implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 211642270167532636L;

	private Integer mdrId;
	
	private String designerId;
	
	private String designerName;
	
	private String createTime;
	
	private String endTime;
	
	private Double rank;
	
	private Integer status;

	public Integer getMdrId(){
		return this.mdrId;
	}

	public void setMdrId(Integer mdrId){
		this.mdrId = mdrId;
	}

	public String getDesignerId(){
		return this.designerId;
	}

	public void setDesignerId(String designerId){
		this.designerId = designerId;
	}

	public String getDesignerName(){
		return this.designerName;
	}

	public void setDesignerName(String designerName){
		this.designerName = designerName;
	}

	public String getCreateTime(){
		return this.createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	public String getEndTime(){
		return this.endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	public Double getRank(){
		return this.rank;
	}

	public void setRank(Double rank){
		this.rank = rank;
	}

	public Integer getStatus(){
		return this.status;
	}

	public void setStatus(Integer status){
		this.status = status;
	}

}