package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialdesignercount", catalog = "platform")
public class MaterialDesignerCountPO implements java.io.Serializable {

	private static final long serialVersionUID = -4754695776071027422L;
	
	public static String COLUMN_DESIGNERID_STR = "designerId";
	
	public static String COLUMN_DESIGNERNAME_STR = "designerName";
	
	public static String COLUMN_DESIGNERDEPARTMENTID_STR = "designerDepartmentId";
	
	public static String COLUMN_CREATETIME_STR = "createTime";
	
	public static String COLUMN_TOTAL_STR = "total";

	private int mdcId;
	
	private String designerId;
	
	private String designerName;
	
	private String designerDepartmentId;
	
	private String designerDepartmentName;
	
	private String designerRegionId;
	
	private String designerRegionName;
	
	private String createTime;
	
	private double total;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mdcId")
	public int getMdcId() {
		return this.mdcId;
	}

	public void setMdcId(int mdcId) {
		this.mdcId = mdcId;
	}

	@Column(name = "designerId")
	public String getDesignerId() {
		return this.designerId;
	}

	public void setDesignerId(String designerId) {
		this.designerId = designerId;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "total")
	public double getTotal() {
		return this.total;
	}

	public void setTotal(double total) {
		this.total = total;
	}

	@Column(name = "designerDepartmentId")
	public String getDesignerDepartmentId() {
		return designerDepartmentId;
	}

	public void setDesignerDepartmentId(String designerDepartmentId) {
		this.designerDepartmentId = designerDepartmentId;
	}

	@Column(name = "designerRegionId")
	public String getDesignerRegionId() {
		return designerRegionId;
	}

	public void setDesignerRegionId(String designerRegionId) {
		this.designerRegionId = designerRegionId;
	}

	@Column(name = "designerName")
	public String getDesignerName() {
		return designerName;
	}

	public void setDesignerName(String designerName) {
		this.designerName = designerName;
	}

	@Column(name = "designerDepartmentName")
	public String getDesignerDepartmentName() {
		return designerDepartmentName;
	}

	public void setDesignerDepartmentName(String designerDepartmentName) {
		this.designerDepartmentName = designerDepartmentName;
	}

	@Column(name = "designerRegionName")
	public String getDesignerRegionName() {
		return designerRegionName;
	}

	public void setDesignerRegionName(String designerRegionName) {
		this.designerRegionName = designerRegionName;
	}

}