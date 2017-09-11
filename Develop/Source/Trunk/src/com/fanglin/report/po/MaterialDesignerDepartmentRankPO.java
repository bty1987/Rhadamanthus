package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialdesignerdepartmentrank", catalog = "platform")
public class MaterialDesignerDepartmentRankPO implements java.io.Serializable {

	private static final long serialVersionUID = -6975540625270694542L;
	
	public static final int STATUS_TYPE_INIT_INT = 0;
	
	public static final int STATUS_TYPE_DISABLED_INT = 1;
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_DESIGNERDEPTID_STR = "designerDeptId";
	
	public static final String COLUMN_RANK_STR = "rank";
	
	public static final String COLUMN_COMPANY_STR = "company";

	private int mddrId;
	
	private String designerDeptId;
	
	private String designerDeptName;
	
	private String createTime;
	
	private String endTime;
	
	private double rank;
	
	private int status;

	private int company;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mddrId")
	public int getMddrId(){
		return this.mddrId;
	}

	public void setMddrId(int mddrId){
		this.mddrId = mddrId;
	}

	@Column(name = "designerDeptId")
	public String getDesignerDeptId(){
		return this.designerDeptId;
	}

	public void setDesignerDeptId(String designerDeptId){
		this.designerDeptId = designerDeptId;
	}

	@Column(name = "designerDeptName")
	public String getDesignerDeptName(){
		return this.designerDeptName;
	}

	public void setDesignerDeptName(String designerDeptName){
		this.designerDeptName = designerDeptName;
	}

	@Column(name = "createTime")
	public String getCreateTime(){
		return this.createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	@Column(name = "endTime")
	public String getEndTime(){
		return this.endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	@Column(name = "rank")
	public double getRank(){
		return this.rank;
	}

	public void setRank(double rank){
		this.rank = rank;
	}

	@Column(name = "status")
	public int getStatus(){
		return this.status;
	}

	public void setStatus(int status){
		this.status = status;
	}
	
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}