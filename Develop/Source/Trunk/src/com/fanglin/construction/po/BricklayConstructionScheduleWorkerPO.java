package com.fanglin.construction.po;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "bricklayconstructionscheduleworker", catalog = "platform")
public class BricklayConstructionScheduleWorkerPO implements java.io.Serializable {

	private static final long serialVersionUID = -7514302020195756379L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_BCSID_STR = "bcsId";
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_WORKERID_STR = "workerId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";

	private int bcswId;
	
	private int bcsId;
	
	private int csId;
	
	private String orderId;
	
	private String workerId;
	
	private String workerName;
	
	private float workerSalary;
	
	private int workerRaty;
	
	private String workerRatyDes;
	
	private Timestamp allocateTime;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bcswId")
	public int getBcswId(){
		return this.bcswId;
	}

	public void setBcswId(int bcswId){
		this.bcswId = bcswId;
	}

	@Column(name = "bcsId")
	public int getBcsId(){
		return this.bcsId;
	}

	public void setBcsId(int bcsId){
		this.bcsId = bcsId;
	}

	@Column(name = "workerId")
	public String getWorkerId(){
		return this.workerId;
	}

	public void setWorkerId(String workerId){
		this.workerId = workerId;
	}

	@Column(name = "workerSalary")
	public float getWorkerSalary(){
		return this.workerSalary;
	}

	public void setWorkerSalary(float workerSalary){
		this.workerSalary = workerSalary;
	}

	@Column(name = "workerRaty")
	public int getWorkerRaty(){
		return this.workerRaty;
	}

	public void setWorkerRaty(int workerRaty){
		this.workerRaty = workerRaty;
	}

	@Column(name = "workerRatyDes")
	public String getWorkerRatyDes(){
		return this.workerRatyDes;
	}

	public void setWorkerRatyDes(String workerRatyDes){
		this.workerRatyDes = workerRatyDes;
	}
	
	@Column(name = "csId")
	public int getCsId(){
		return csId;
	}

	public void setCsId(int csId){
		this.csId = csId;
	}

	@Column(name = "orderId")
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name = "workerName")
	public String getWorkerName(){
		return workerName;
	}

	public void setWorkerName(String workerName){
		this.workerName = workerName;
	}

	@Column(name = "allocateTime")
	public Timestamp getAllocateTime() {
		return allocateTime;
	}

	public void setAllocateTime(Timestamp allocateTime) {
		this.allocateTime = allocateTime;
	}

}