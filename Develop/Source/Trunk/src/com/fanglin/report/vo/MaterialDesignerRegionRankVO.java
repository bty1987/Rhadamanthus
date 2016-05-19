package com.fanglin.report.vo;

public class MaterialDesignerRegionRankVO implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7598363287031606459L;

	private Integer mdrrId;
	
	private String designerRegionId;
	
	private String designerRegionName;
	
	private String createTime;
	
	private String endTime;
	
	private Double rank;
	
	private Integer status;

	public Integer getMdrrId(){
		return this.mdrrId;
	}

	public void setMdrrId(Integer mdrrId){
		this.mdrrId = mdrrId;
	}

	public String getDesignerRegionId(){
		return this.designerRegionId;
	}

	public void setDesignerRegionId(String designerRegionId){
		this.designerRegionId = designerRegionId;
	}

	public String getDesignerRegionName(){
		return this.designerRegionName;
	}

	public void setDesignerRegionName(String designerRegionName){
		this.designerRegionName = designerRegionName;
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