package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialtypecount", catalog = "platform")
public class MaterialTypeCountPO implements java.io.Serializable {

	private static final long serialVersionUID = -3684199420164210915L;
	
	public static final String COLUMN_MATERIALTYPE_STR = "materialType";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";
	
	public static final String COLUMN_TOTAL_STR = "total";

	private int mtcId;
	
	private String materialType;
	
	private String createTime;
	
	private float total;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mtcId")
	public int getMtcId() {
		return this.mtcId;
	}

	public void setMtcId(int mtcId) {
		this.mtcId = mtcId;
	}

	@Column(name = "materialType")
	public String getMaterialType() {
		return this.materialType;
	}

	public void setMaterialType(String materialType) {
		this.materialType = materialType;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "total")
	public float getTotal() {
		return this.total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

}