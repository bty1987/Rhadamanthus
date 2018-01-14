package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialdesignerdepartmentcount", catalog = "report")
public class MaterialDesignerDepartmentCountPO implements java.io.Serializable {

	private static final long serialVersionUID = 2120186081140651110L;
	
	public static final String COLUMN_DESIGNERDEPTID_STR = "designerDeptId";
	
	public static final String COLUMN_DESIGNERDEPTNAME_STR = "designerDeptName";
	
	public static final String COLUMN_DESINGERREGIONID_STR = "designerRegionId";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";
	
	public static final String COLUMN_TOTAL_STR = "total";

	private int mddcId;
	
	private String designerDeptId;
	
	private String designerDeptName;
	
	private String designerRegionId;
	
	private String designerRegionName;
	
	private String createTime;
	
	private float total;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mddcId")
	public int getMddcId(){
		return this.mddcId;
	}

	public void setMddcId(int mddcId){
		this.mddcId = mddcId;
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

	@Column(name = "designerDeptName")
	public String getDesignerDeptName() {
		return designerDeptName;
	}

	public void setDesignerDeptName(String designerDeptName) {
		this.designerDeptName = designerDeptName;
	}

	@Column(name = "designerRegionName")
	public String getDesignerRegionName() {
		return designerRegionName;
	}

	public void setDesignerRegionName(String designerRegionName) {
		this.designerRegionName = designerRegionName;
	}

}