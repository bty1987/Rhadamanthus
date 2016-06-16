package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialdepartmentcount", catalog = "platform")
public class MaterialDepartmentCountPO implements java.io.Serializable {

	private static final long serialVersionUID = -8210082803092475827L;
	
	public static final String COLUMN_MATERIALDEPTID_STR = "materialDeptId";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";

	private int mdcId;
	
	private String materialDeptId;
	
	private String createTime;
	
	private float total;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mdcId")
	public int getMdcId(){
		return this.mdcId;
	}

	public void setMdcId(int mdcId){
		this.mdcId = mdcId;
	}

	@Column(name = "materialDeptId")
	public String getMaterialDeptId(){
		return this.materialDeptId;
	}

	public void setMaterialDeptId(String materialDeptId){
		this.materialDeptId = materialDeptId;
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

}