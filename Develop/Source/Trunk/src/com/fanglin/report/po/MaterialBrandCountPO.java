package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialbrandcount", catalog = "platform")
public class MaterialBrandCountPO implements java.io.Serializable {

	private static final long serialVersionUID = -266955101410786047L;
	
	public static String COLUMN_MATERIALBRAND_STR = "materialBrand";
	
	public static String COLUMN_CREATETIME_STR = "createTime";
	
	public static String COLUMN_TOTAL_STR = "total";

	private int mbcId;
	
	private String materialBrand;
	
	private String createTime;
	
	private float total;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mbcId")
	public int getMbcId() {
		return this.mbcId;
	}

	public void setMbcId(int mbcId) {
		this.mbcId = mbcId;
	}

	@Column(name = "materialBrand")
	public String getMaterialBrand() {
		return this.materialBrand;
	}

	public void setMaterialBrand(String materialBrand) {
		this.materialBrand = materialBrand;
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