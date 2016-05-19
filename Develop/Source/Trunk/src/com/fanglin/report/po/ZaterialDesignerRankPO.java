package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "zaterialdesignerrank", catalog = "platform")
public class ZaterialDesignerRankPO implements java.io.Serializable {

	private static final long serialVersionUID = -3205594554350316664L;
	
	public static int STATUS_TYPE_INIT_INT = 0;
	
	public static int STATUS_TYPE_DISABLED_INT = 1;
	
	public static String COLUMN_STATUS_STR = "status";
	
	public static String COLUMN_DESIGNERID_STR = "designerId";
	
	public static String COLUMN_RANK_STR = "rank";

	private int zdrId;
	
	private String designerId;
	
	private String designerName;
	
	private String createTime;
	
	private String endTime;
	
	private double rank;
	
	private int status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "zdrId")
	public int getZdrId(){
		return this.zdrId;
	}

	public void setZdrId(int zdrId){
		this.zdrId = zdrId;
	}

	@Column(name = "designerId")
	public String getDesignerId(){
		return this.designerId;
	}

	public void setDesignerId(String designerId){
		this.designerId = designerId;
	}

	@Column(name = "designerName")
	public String getDesignerName(){
		return this.designerName;
	}

	public void setDesignerName(String designerName){
		this.designerName = designerName;
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