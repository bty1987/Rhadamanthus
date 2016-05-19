/**
 * @File Name		: Carpentconstructionschedule.java
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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="carpentconstructionschedule", catalog = "platform")
public class CarpentConstructionSchedulePO implements Serializable{

	private static final long serialVersionUID = 6661138224403774890L;
	
	public static String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static int CARPENT_CONSTRUCTION_SCHEDULE_TYPE_ID_INT = 8;
	
	public static int CARPENT_ALLOCATION_WORKER_FLAG_INT = 32;
	
	public static String CARPENT_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "木工";
	
	public static String COLUMN_CSID_STR = "csId";
	
	public static String COLUMN_ORDERID_STR = "orderId";
	
	private int ccsId;
	
	private int csId;
	
	private String orderId;
	
	private String workerId;
	
	private String startTime;
	
	private int startTimeFlag;
	
	private String endTime;
	
	private int endTimeFlag;
	
	private int supervisorRaty;
	
	private String supervisorRatyDes;
	
	private int qualityRaty;
	
	private String qualityRatyDes;
	
	public CarpentConstructionSchedulePO() {
		super();
	}

	public CarpentConstructionSchedulePO(int csId, String orderId, String startTime, String endTime) {
		super();
		this.csId = csId;
		this.orderId = orderId;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ccsId")
	public int getCcsId(){
		return this.ccsId;
	}

	public void setCcsId(int ccsId){
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

	@Column(name = "csId")
	public int getCsId(){
		return csId;
	}

	public void setCsId(int csId){
		this.csId = csId;
	}

}
