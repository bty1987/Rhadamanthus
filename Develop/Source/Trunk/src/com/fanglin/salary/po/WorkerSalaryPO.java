package com.fanglin.salary.po;
// default package

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "workersalary", catalog = "platform")
public class WorkerSalaryPO implements java.io.Serializable {

	private static final long serialVersionUID = 822467532841192640L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final int STATUS_TYPE_INIT_INT = 0;
	
	public static final int STATUS_TYPE_PAYOFF = 1;
	
	public static final int STATUS_TYPE_UNPAYOFF = 2;
	
	public static final String COLUMN_WSID_STR = "wsId";
	
	public static final String COLUMN_USERID_STR = "userId";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_WORKTYPEID_STR = "workTypeId";

	private int wsId;
	
	private int pwsId;
	
	private String userId;
	
	private String userName;
	
	private int workTypeId;
	
	private String workType;
	
	private String createTime;
	
	private String endTime;
	
	private float base;
	
	private float deduct;
	
	private int status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wsId")
	public int getWsId(){
		return this.wsId;
	}

	public void setWsId(int wsId){
		this.wsId = wsId;
	}

	@Column(name = "userId")
	public String getUserId(){
		return this.userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	@Column(name = "userName")
	public String getUserName(){
		return this.userName;
	}

	public void setUserName(String userName){
		this.userName = userName;
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

	@Column(name = "base")
	public float getBase(){
		return this.base;
	}

	public void setBase(float base){
		this.base = base;
	}

	@Column(name = "deduct")
	public float getDeduct(){
		return this.deduct;
	}

	public void setDeduct(float deduct){
		this.deduct = deduct;
	}

	@Column(name = "status")
	public int getStatus(){
		return this.status;
	}

	public void setStatus(int status){
		this.status = status;
	}

	@Column(name = "workType")
	public String getWorkType(){
		return workType;
	}

	public void setWorkType(String workType){
		this.workType = workType;
	}

	@Column(name = "pwsId")
	public int getPwsId(){
		return pwsId;
	}

	public void setPwsId(int pwsId){
		this.pwsId = pwsId;
	}

	@Column(name = "workTypeId")
	public int getWorkTypeId(){
		return workTypeId;
	}

	public void setWorkTypeId(int workTypeId){
		this.workTypeId = workTypeId;
	}

}
