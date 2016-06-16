/**
 * @File Name		: PutlineConstructionSchedulePO.java
 * @Package   	: com.fanglin.entity.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-2
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
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationOrderPO;

@Entity
@Table(name = "putlineconstructionschedule", catalog = "platform")
public class PutlineConstructionSchedulePO implements Serializable {

	private static final long serialVersionUID = 7964248933414074995L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final int PUBLINE_CONSTRUCTION_SCHEDULE_TYPE_ID_INT = 2;
	
	public static final int PUBLINE_ALLOCATION_WORKER_FLAG_INT = 2;
	
	public static final String PUBLINE_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "放线";
	
	public static final int PUTLINESTATUS_TYPE_INIT_INT = 0;
	
	public static final int PUTLINESTATUS_TYPE_SUCCESS_INT = 1;
	
	public static final int PUTLINESTATUS_TYPE_FAIL_INT = 2;
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_PUTLINESTATUS_STR = "putlineStatus";
	
	private int plcsId;
	
	private int csId;
	
	private DecorationOrderPO decorationOrder;
	
	private String workerId;
	
	private Float workerSalary;
	
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
	
	private int putlineStatus;
	
	private String putlineTime;
	
	private Timestamp allocateTime;

	public PutlineConstructionSchedulePO() {
		super();
	}

	public PutlineConstructionSchedulePO(int csId,
			DecorationOrderPO decorationOrder, String startTime, String endTime) {
		super();
		this.csId = csId;
		this.decorationOrder = decorationOrder;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "plcsId")
	public int getPlcsId(){
		return this.plcsId;
	}

	public void setPlcsId(int plcsId){
		this.plcsId = plcsId;
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

	@Column(name = "putlineStatus")
	public int getPutlineStatus(){
		return putlineStatus;
	}

	public void setPutlineStatus(int putlineStatus){
		this.putlineStatus = putlineStatus;
	}

	@Column(name = "putlineTime")
	public String getPutlineTime(){
		return putlineTime;
	}

	public void setPutlineTime(String putlineTime){
		this.putlineTime = putlineTime;
	}

	@Column(name = "csId")
	public int getCsId(){
		return csId;
	}

	public void setCsId(int csId){
		this.csId = csId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName="orderId")
	public DecorationOrderPO getDecorationOrder(){
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderPO decorationOrder){
		this.decorationOrder = decorationOrder;
	}

	@Column(name = "allocateTime")
	public Timestamp getAllocateTime() {
		return allocateTime;
	}

	public void setAllocateTime(Timestamp allocateTime) {
		this.allocateTime = allocateTime;
	}

}