package com.fanglin.report.vo;

public class ZaterialDesignerRankVO implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6539149240222325996L;

	private Integer zdrId;
	
	private String designerId;
	
	private String designerName;
	
	private String createTime;
	
	private String endTime;
	
	private Double rank;
	
	private Integer status;

	public Integer getZdrId(){
		return this.zdrId;
	}

	public void setZdrId(Integer zdrId){
		this.zdrId = zdrId;
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