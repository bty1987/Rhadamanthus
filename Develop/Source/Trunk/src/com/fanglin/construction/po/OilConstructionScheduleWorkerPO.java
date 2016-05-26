package com.fanglin.construction.po;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "oilconstructionscheduleworker", catalog = "platform")
public class OilConstructionScheduleWorkerPO implements java.io.Serializable {

	private static final long serialVersionUID = -3842243798381411106L;
	
	public static final String COLUMN_OCSID_STR = "ocsId";
	
	public static final String COLUMN_WORKERID_STR = "workerId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";

	private int ocswId;
	
	private int ocsId;
	
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
	@Column(name = "ocswId")
	public int getOcswId(){
		return this.ocswId;
	}

	public void setOcswId(int ocswId){
		this.ocswId = ocswId;
	}

	@Column(name = "ocsId")
	public int getOcsId(){
		return this.ocsId;
	}

	public void setOcsId(int ocsId){
		this.ocsId = ocsId;
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