package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "zaterialdesignerdepartmentrank", catalog = "platform")
public class ZaterialDesignerDepartmentRankPO implements java.io.Serializable {

	private static final long serialVersionUID = 7358870333820070170L;
	
	public static int STATUS_TYPE_INIT_INT = 0;
	
	public static int STATUS_TYPE_DISABLED_INT = 1;
	
	public static String COLUMN_STATUS_STR = "status";
	
	public static String COLUMN_DESIGNERDEPTID_STR = "designerDeptId";
	
	public static String COLUMN_RANK_STR = "rank";

	private int zddrId;
	
	private String designerDeptId;
	
	private String designerDeptName;
	
	private String createTime;
	
	private String endTime;
	
	private double rank;
	
	private int status;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "zddrId")
	public int getZddrId(){
		return this.zddrId;
	}

	public void setZddrId(int zddrId){
		this.zddrId = zddrId;
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

}