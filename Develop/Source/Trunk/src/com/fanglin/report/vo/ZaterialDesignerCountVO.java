package com.fanglin.report.vo;

public class ZaterialDesignerCountVO implements java.io.Serializable {

	private static final long serialVersionUID = 7503986928964325547L;

	private Integer zdcId;
     
    private String designerId;
    
    private String designerName;
    
    private String designerDepartmentId;
    
    private String designerDepartmentName;
    
    private String designerRegionId;
    
    private String designerRegionName;
    
    private String createTime;
    
    private Float total;

	public Integer getZdcId() {
		return zdcId;
	}

	public void setZdcId(Integer zdcId) {
		this.zdcId = zdcId;
	}

	public String getDesignerId() {
		return designerId;
	}

	public void setDesignerId(String designerId) {
		this.designerId = designerId;
	}

	public String getDesignerDepartmentId() {
		return designerDepartmentId;
	}

	public void setDesignerDepartmentId(String designerDepartmentId) {
		this.designerDepartmentId = designerDepartmentId;
	}

	public String getDesignerRegionId() {
		return designerRegionId;
	}

	public void setDesignerRegionId(String designerRegionId) {
		this.designerRegionId = designerRegionId;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public String getDesignerName() {
		return designerName;
	}

	public void setDesignerName(String designerName) {
		this.designerName = designerName;
	}

	public String getDesignerDepartmentName() {
		return designerDepartmentName;
	}

	public void setDesignerDepartmentName(String designerDepartmentName) {
		this.designerDepartmentName = designerDepartmentName;
	}

	public String getDesignerRegionName() {
		return designerRegionName;
	}

	public void setDesignerRegionName(String designerRegionName) {
		this.designerRegionName = designerRegionName;
	}

}