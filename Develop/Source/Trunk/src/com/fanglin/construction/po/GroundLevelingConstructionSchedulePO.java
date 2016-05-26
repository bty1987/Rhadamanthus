package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "groundlevelingconstructionschedule", catalog = "platform")
public class GroundLevelingConstructionSchedulePO implements java.io.Serializable {

	private static final long serialVersionUID = 8626112203327291623L;
	
	public static final int GROUNDLEVELING_CONSTRUCTION_SCHEDULE_TYPE_ID_INT = 7;
	
	public static final int GROUNDLEVELING_ALLOCATION_WORKER_FLAG_INT = 16;
	
	public static final String GROUNDLEVELING_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "地面找平";
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";

	private int glcsId;
	
	private int csId;
	
	private String orderId;
	
	private String workerId;
	
	private String startTime;
	
	private short startTimeFlag;
	
	private String endTime;
	
	private short endTimeFlag;
	
	private short supervisorRaty;
	
	private String supervisorRatyDes;
	
	private short qualityRaty;
	
	private String qualityRatyDes;

	public GroundLevelingConstructionSchedulePO() {
		super();
	}

	public GroundLevelingConstructionSchedulePO(int csId, String orderId, String startTime, String endTime) {
		super();
		this.csId = csId;
		this.orderId = orderId;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
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

	@Column(name = "startTime")
	public String getStartTime(){
		return this.startTime;
	}

	public void setStartTime(String startTime){
		this.startTime = startTime;
	}

	@Column(name = "startTimeFlag")
	public short getStartTimeFlag(){
		return this.startTimeFlag;
	}

	public void setStartTimeFlag(short startTimeFlag){
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
	public short getEndTimeFlag(){
		return this.endTimeFlag;
	}

	public void setEndTimeFlag(short endTimeFlag){
		this.endTimeFlag = endTimeFlag;
	}

	@Column(name = "supervisorRaty")
	public short getSupervisorRaty(){
		return this.supervisorRaty;
	}

	public void setSupervisorRaty(short supervisorRaty){
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
	public short getQualityRaty(){
		return this.qualityRaty;
	}

	public void setQualityRaty(short qualityRaty){
		this.qualityRaty = qualityRaty;
	}

	@Column(name = "qualityRatyDes")
	public String getQualityRatyDes(){
		return this.qualityRatyDes;
	}

	public void setQualityRatyDes(String qualityRatyDes){
		this.qualityRatyDes = qualityRatyDes;
	}

}