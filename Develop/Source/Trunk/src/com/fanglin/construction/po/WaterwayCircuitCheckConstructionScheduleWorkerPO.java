package com.fanglin.construction.po;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "waterwaycircuitcheckconstructionscheduleworker", catalog = "platform")
public class WaterwayCircuitCheckConstructionScheduleWorkerPO implements java.io.Serializable {

	private static final long serialVersionUID = -3996000892351248728L;
	
	public static int WATERWAY_CONSTRUCTION_SCHEDULE_TYPE_ID_INT = 3;
	
	public static String WATERWAY_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "水暖工";
	
	public static int POWER_CONSTRUCTION_SCHEDULE_TYPE_ID_INT = 4;
	
	public static String POWER_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "力工";
	
	public static int CIRCUIT_CONSTRUCTION_SCHEDULE_TYPE_ID_INT = 5;
	
	public static String CIRCUIT_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "电工";
	
	public static String COLUMN_WCCCSID_STR = "wcccsId";
	
	public static String 	COLUMN_WORKERID_STR = "workerId";
	
	public static String COLUMN_ORDERID_STR = "orderId";

	private int wcccswId;
	
	private int wcccsId;
	
	private int csId;
	
	private String orderId;
	
	private String workerId;
	
	private String workerName;
	
	private float workerSalary;
	
	private short workerRaty;
	
	private String workerRatyDes;
	
	private Timestamp allocateTime;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wcccswId")
	public int getWcccswId(){
		return this.wcccswId;
	}

	public void setWcccswId(int wcccswId){
		this.wcccswId = wcccswId;
	}

	@Column(name = "wcccsId")
	public int getWcccsId(){
		return this.wcccsId;
	}

	public void setWcccsId(int wcccsId){
		this.wcccsId = wcccsId;
	}

	@Column(name = "csId")
	public int getCsId(){
		return this.csId;
	}

	public void setCsId(int csId){
		this.csId = csId;
	}

	@Column(name = "orderId")
	public String getOrderId(){
		return this.orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name = "workerId", length = 15)
	public String getWorkerId(){
		return this.workerId;
	}

	public void setWorkerId(String workerId){
		this.workerId = workerId;
	}

	@Column(name = "workerName")
	public String getWorkerName(){
		return this.workerName;
	}

	public void setWorkerName(String workerName){
		this.workerName = workerName;
	}

	@Column(name = "workerSalary")
	public float getWorkerSalary(){
		return this.workerSalary;
	}

	public void setWorkerSalary(float workerSalary){
		this.workerSalary = workerSalary;
	}

	@Column(name = "workerRaty")
	public short getWorkerRaty(){
		return this.workerRaty;
	}

	public void setWorkerRaty(short workerRaty){
		this.workerRaty = workerRaty;
	}

	@Column(name = "workerRatyDes")
	public String getWorkerRatyDes(){
		return this.workerRatyDes;
	}

	public void setWorkerRatyDes(String workerRatyDes){
		this.workerRatyDes = workerRatyDes;
	}

	@Column(name = "allocateTime")
	public Timestamp getAllocateTime() {
		return allocateTime;
	}

	public void setAllocateTime(Timestamp allocateTime) {
		this.allocateTime = allocateTime;
	}

}