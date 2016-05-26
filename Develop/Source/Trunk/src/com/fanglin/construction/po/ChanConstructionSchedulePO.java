/**
 * @File Name		: ChanConstructionSchedulePO.java
 * @Package   	: com.fanglin.entity.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="chanconstructionschedule", catalog = "platform")
public class ChanConstructionSchedulePO implements Serializable {

	private static final long serialVersionUID = -8749991367232507035L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final int CHAN_CONSTRUCTION_SCHEDULE_TYPE_ID_INT = 1;
	
	public static final int CHAN_ALLOCATION_WORKER_FLAG_INT = 1;
	
	public static final String CHAN_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "铲大白";
	
	public static final int STARTTIMEFLAG_TYPE_INIT_INT = 0;
	
	public static final int STARTTIMEFLAG_TYPE_COMMIT_INT = 1;
	
	public static final int ENDTIMEFLAG_TYPE_INIT_INT = 0;
	
	public static final int ENDTIMEFLAG_TYPE_COMMIT_INT = 1;
	
	public static final int STATUS_TYPE_INIT_INT = 0;
	
	public static final int STATUS_TYPE_SUCCESS_INT = 1;
	
	public static final int STATUS_TYPE_FAIL_INT = 2;
	
	public static final int STATUS_TYPE_DELAY_INT = 3;
	
	public static final int STATUS_TYPE_PASS_INT = 4;
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	private int ccsId;
	
	private int csId;
	
	private String orderId;
	
	private String workerId;
	
	private float workerSalary;
	
	private String startTime;
	
	private int startTimeFlag;
	
	private String endTime;
	
	private int endTimeFlag;
	
	private int workerRaty;
	
	private String workerRatyDes;
	
	private int supervisorRaty;
	
	private String supervisorRatyDes;
	
	private int qualityRaty;
	
	private String qualityRatyDes;
	
	private int status;
	
	private Timestamp allocateTime;

	public ChanConstructionSchedulePO() {
		super();
	}

	public ChanConstructionSchedulePO(int csId, String orderId, String startTime, String endTime) {
		super();
		this.csId = csId;
		this.orderId = orderId;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ccsId")
	public Integer getCcsId(){
		return this.ccsId;
	}

	public void setCcsId(Integer ccsId){
		this.ccsId = ccsId;
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

	@Column(name = "workerSalary")
	public Float getWorkerSalary(){
		return this.workerSalary;
	}

	public void setWorkerSalary(Float workerSalary){
		this.workerSalary = workerSalary;
	}

	@Column(name = "startTime")
	public String getStartTime(){
		return this.startTime;
	}

	public void setStartTime(String startTime){
		this.startTime = startTime;
	}

	@Column(name = "startTimeFlag")
	public int getStartTimeFlag(){
		return this.startTimeFlag;
	}

	public void setStartTimeFlag(int startTimeFlag){
		this.startTimeFlag = startTimeFlag;
	}

	@Column(name = "endTime")
	public String getEndTime(){
		return this.endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	@Column(name = "endTimeFlag")
	public int getEndTimeFlag(){
		return this.endTimeFlag;
	}

	public void setEndTimeFlag(int endTimeFlag){
		this.endTimeFlag = endTimeFlag;
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

	@Column(name = "supervisorRaty")
	public int getSupervisorRaty(){
		return this.supervisorRaty;
	}

	public void setSupervisorRaty(int supervisorRaty){
		this.supervisorRaty = supervisorRaty;
	}

	@Column(name = "supervisorRatyDes")
	public String getSupervisorRatyDes(){
		return this.supervisorRatyDes;
	}

	public void setSupervisorRatyDes(String supervisorRatyDes){
		this.supervisorRatyDes = supervisorRatyDes;
	}

	@Column(name = "qualityRaty")
	public int getQualityRaty(){
		return this.qualityRaty;
	}

	public void setQualityRaty(int qualityRaty){
		this.qualityRaty = qualityRaty;
	}

	@Column(name = "qualityRatyDes")
	public String getQualityRatyDes(){
		return this.qualityRatyDes;
	}

	public void setQualityRatyDes(String qualityRatyDes){
		this.qualityRatyDes = qualityRatyDes;
	}

	@Column(name = "status")
	public int getStatus(){
		return status;
	}

	public void setStatus(int status){
		this.status = status;
	}

	@Column(name = "csId")
	public int getCsId(){
		return csId;
	}

	public void setCsId(int csId){
		this.csId = csId;
	}

	@Column(name = "allocateTime")
	public Timestamp getAllocateTime() {
		return allocateTime;
	}

	public void setAllocateTime(Timestamp allocateTime) {
		this.allocateTime = allocateTime;
	}
	
}
