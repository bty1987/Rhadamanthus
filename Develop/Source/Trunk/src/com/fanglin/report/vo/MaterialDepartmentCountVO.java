package com.fanglin.report.vo;


public class MaterialDepartmentCountVO implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2174383697961131440L;

	private int mdcId;
	
	private String materialDeptId;
	
	private String createTime;
	
	private float total;

	public int getMdcId(){
		return this.mdcId;
	}

	public void setMdcId(int mdcId){
		this.mdcId = mdcId;
	}

	public String getMaterialDeptId(){
		return this.materialDeptId;
	}

	public void setMaterialDeptId(String materialDeptId){
		this.materialDeptId = materialDeptId;
	}

	public String getCreateTime(){
		return this.createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	public float getTotal(){
		return this.total;
	}

	public void setTotal(float total){
		this.total = total;
	}

}