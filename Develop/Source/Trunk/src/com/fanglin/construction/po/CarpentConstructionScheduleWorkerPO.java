package com.fanglin.construction.po;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "carpentconstructionscheduleworker", catalog = "platform")
public class CarpentConstructionScheduleWorkerPO implements java.io.Serializable {

	private static final long serialVersionUID = -4122303748594285951L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_CCSID_STR = "ccsId";
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_WORKERID_STR = "workerId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";

	private int ccswId;
	
	private int ccsId;
	
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
	@Column(name = "ccswId")
	public int getCcswId(){
		return this.ccswId;
	}

	public void setCcswId(int ccswId){
		this.ccswId = ccswId;
	}

	@Column(name = "ccsId")
	public int getCcsId(){
		return this.ccsId;
	}

	public void setCcsId(int ccsId){
		this.ccsId = ccsId;
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