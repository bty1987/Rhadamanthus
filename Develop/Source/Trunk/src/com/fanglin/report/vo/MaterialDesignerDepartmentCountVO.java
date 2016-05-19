package com.fanglin.report.vo;

public class MaterialDesignerDepartmentCountVO implements java.io.Serializable {

	private static final long serialVersionUID = -3434391775499984165L;

	private Integer mddcId;
	
	private String designerDeptId;
	
	private String designerDeptName;
	
	private String designerRegionId;
	
	private String designerRegionName;
	
	private String createTime;
	
	private Float total;

	public Integer getMddcId(){
		return this.mddcId;
	}

	public void setMddcId(Integer mddcId){
		this.mddcId = mddcId;
	}

	public String getDesignerDeptId(){
		return designerDeptId;
	}

	public void setDesignerDeptId(String designerDeptId){
		this.designerDeptId = designerDeptId;
	}

	public String getCreateTime(){
		return this.createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	public Float getTotal(){
		return this.total;
	}

	public void setTotal(Float total){
		this.total = total;
	}

	public String getDesignerRegionId() {
		return designerRegionId;
	}

	public void setDesignerRegionId(String designerRegionId) {
		this.designerRegionId = designerRegionId;
	}

	public String getDesignerDeptName() {
		return designerDeptName;
	}

	public void setDesignerDeptName(String designerDeptName) {
		this.designerDeptName = designerDeptName;
	}

	public String getDesignerRegionName() {
		return designerRegionName;
	}

	public void setDesignerRegionName(String designerRegionName) {
		this.designerRegionName = designerRegionName;
	}

}