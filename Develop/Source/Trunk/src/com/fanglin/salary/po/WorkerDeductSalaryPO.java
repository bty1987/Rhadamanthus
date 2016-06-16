package com.fanglin.salary.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "workerdeductsalary", catalog = "platform")
public class WorkerDeductSalaryPO implements java.io.Serializable {

	private static final long serialVersionUID = -7005634387087934683L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final int STATUS_TYPE_INIT_INT = 0;
	
	public static final int STATUS_TYPE_PASS_INT = 1;
	
	public static final int STATUS_TYPE_CONFIRM_INT = 2;
	
	public static final int STATUS_TYPE_PAYOFF_INT = 3;
	
	public static final int STATUS_TYPE_DELETE_INT = 4;
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_WSID_STR = "wsId";
	
	public static final String COLUMN_WORKTYPEID_STR = "workTypeId";

	private int wdsId;
	
	private int wsId;
	
	private String orderId;
	
	private String userId;
	
	private String userName;
	
	private int workTypeId;
	
	private String workType;
	
	private String createTime;
	
	private float deduct;
	
	private int deductType;
	
	private int status;
	
	private String des;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wdsId")
	public int getWdsId(){
		return this.wdsId;
	}

	public void setWdsId(int wdsId){
		this.wdsId = wdsId;
	}

	@Column(name = "wsId")
	public int getWsId(){
		return this.wsId;
	}

	public void setWsId(int wsId){
		this.wsId = wsId;
	}

	@Column(name = "orderId")
	public String getOrderId(){
		return this.orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
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

	@Column(name = "workTypeId")
	public int getWorkTypeId(){
		return workTypeId;
	}

	public void setWorkTypeId(int workTypeId){
		this.workTypeId = workTypeId;
	}

	@Column(name = "deductType")
	public int getDeductType(){
		return deductType;
	}

	public void setDeductType(int deductType){
		this.deductType = deductType;
	}

	@Column(name = "des")
	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}
}
