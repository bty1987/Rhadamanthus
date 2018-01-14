package com.fanglin.report.vo;

public class ZaterialDesignerDepartmentRankVO implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5828388388364374247L;

	private Integer zddrId;
	
	private String designerDeptId;
	
	private String designerDeptName;
	
	private String createTime;
	
	private String endTime;
	
	private Double rank;
	
	private Integer status;
	
	public Integer getZddrId(){
		return this.zddrId;
	}

	public void setZddrId(Integer zddrId){
		this.zddrId = zddrId;
	}

	public String getDesignerDeptId(){
		return this.designerDeptId;
	}

	public void setDesignerDeptId(String designerDeptId){
		this.designerDeptId = designerDeptId;
	}

	public String getDesignerDeptName(){
		return this.designerDeptName;
	}

	public void setDesignerDeptName(String designerDeptName){
		this.designerDeptName = designerDeptName;
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