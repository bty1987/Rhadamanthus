package com.fanglin.construction.po;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "waterwaycircuitpowerconstructionscheduleworker", catalog = "platform")
public class WaterwayCircuitPowerConstructionScheduleWorkerPO implements java.io.Serializable {

	private static final long serialVersionUID = 7857440153164303950L;
	
	public static final int WATERWAY_CONSTRUCTION_SCHEDULE_TYPE_ID_INT = 3;
	
	public static final String WATERWAY_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "水暖工";
	
	public static final int POWER_CONSTRUCTION_SCHEDULE_TYPE_ID_INT = 4;
	
	public static final String POWER_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "力工";
	
	public static final int CIRCUIT_CONSTRUCTION_SCHEDULE_TYPE_ID_INT = 5;
	
	public static final String CIRCUIT_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "电工";
	
	public static final String COLUMN_WCPCSID_STR = "wcpcsId";
	
	public static final String COLUMN_WORKERID_STR = "workerId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";

	private int wcpcswId;
	
	private int wcpcsId;
	
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
	@Column(name = "wcpcswId")
	public int getWcpcswId(){
		return this.wcpcswId;
	}

	public void setWcpcswId(int wcpcswId){
		this.wcpcswId = wcpcswId;
	}

	@Column(name = "wcpcsId")
	public int getWcpcsId(){
		return this.wcpcsId;
	}

	public void setWcpcsId(int wcpcsId){
		this.wcpcsId = wcpcsId;
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