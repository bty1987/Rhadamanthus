package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "zaterialdesignerdepartmentcount", catalog = "platform")
public class ZaterialDesignerDepartmentCountPO implements java.io.Serializable {

	private static final long serialVersionUID = 5008038230815616923L;
	
	public static final String COLUMN_DESIGNERDEPTID_STR = "designerDeptId";
	
	public static final String COLUMN_DESIGNERDEPTNAME_STR = "designerDeptName";
	
	public static final String COLUMN_DESIGNERREGIONID_STR = "designerRegionId";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";
	
	public static final String COLUMN_TOTAL_STR = "total";

	private int zddcId;
	
	private String designerDeptId;
	
	private String designerDeptName;
	
	private String designerRegionId;
	
	private String designerRegionName;
	
	private String materialBrand;
	
	private String createTime;
	
	private float total;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "zddcId")
	public int getZddcId(){
		return this.zddcId;
	}

	public void setZddcId(int zddcId){
		this.zddcId = zddcId;
	}

	@Column(name = "designerDeptId")
	public String getDesignerDeptId(){
		return designerDeptId;
	}

	public void setDesignerDeptId(String designerDeptId){
		this.designerDeptId = designerDeptId;
	}

	@Column(name = "createTime")
	public String getCreateTime(){
		return this.createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	@Column(name = "total")
	public float getTotal(){
		return this.total;
	}

	public void setTotal(float total){
		this.total = total;
	}

	@Column(name = "designerRegionId")
	public String getDesignerRegionId() {
		return designerRegionId;
	}

	public void setDesignerRegionId(String designerRegionId) {
		this.designerRegionId = designerRegionId;
	}

	@Column(name="designerDeptName")
	public String getDesignerDeptName() {
		return designerDeptName;
	}

	public void setDesignerDeptName(String designerDeptName) {
		this.designerDeptName = designerDeptName;
	}

	@Column(name="designerRegionName")
	public String getDesignerRegionName() {
		return designerRegionName;
	}

	public void setDesignerRegionName(String designerRegionName) {
		this.designerRegionName = designerRegionName;
	}

	@Column(name="materialBrand")
	public String getMaterialBrand() {
		return materialBrand;
	}

	public void setMaterialBrand(String materialBrand) {
		this.materialBrand = materialBrand;
	}

}