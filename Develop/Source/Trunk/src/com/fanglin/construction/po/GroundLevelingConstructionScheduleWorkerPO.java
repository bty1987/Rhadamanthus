package com.fanglin.construction.po;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "groundlevelingconstructionscheduleworker", catalog = "platform")
public class GroundLevelingConstructionScheduleWorkerPO implements java.io.Serializable {

	private static final long serialVersionUID = 973812717221715019L;
	
	public static final String COLUMN_GLCSID_STR = "glcsId";
	
	public static final String COLUMN_WORKERID_STR = "workerId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";

	private int glcswId;
	
	private int glcsId;
	
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
	@Column(name = "glcswId")
	public int getGlcswId(){
		return this.glcswId;
	}

	public void setGlcswId(int glcswId){
		this.glcswId = glcswId;
	}

	@Column(name = "glcsId")
	public int getGlcsId(){
		return this.glcsId;
	}

	public void setGlcsId(int glcsId){
		this.glcsId = glcsId;
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

	@Column(name = "workerId")
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