/**
 * @File Name		: WaterwayCircuitPowerConstructionSchedulePO.java
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
@Table(name="waterwaycircuitpowerconstructionschedule", catalog = "platform")
public class WaterwayCircuitPowerConstructionSchedulePO implements Serializable {

	private static final long serialVersionUID = 6085853844947063108L;
	
	public static final int WATERWAYCIRCUITPOWER_ALLOCATION_WORKER_FLAG_INT = 4;
	
	public static final String WATERWAYCIRCUITPOWER_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "水电力";
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	private int wcpcsId;
	
	private long csId;
	
	private String orderId;
	
	private String waterwayWorkerId;
	
	private String circuitWorkerId;
	
	private String powerWorkerId;
	
	private String startTime;
	
	private int startTimeFlag;
	
	private String endTime;
	
	private int endTimeFlag;
	
	public WaterwayCircuitPowerConstructionSchedulePO() {
		super();
	}

	public WaterwayCircuitPowerConstructionSchedulePO(long csId, String orderId, String startTime, String endTime) {
		super();
		this.csId = csId;
		this.orderId = orderId;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="wcpcsId")
	public int getWcpcsId(){
		return wcpcsId;
	}

	public void setWcpcsId(int wcpcsId){
		this.wcpcsId = wcpcsId;
	}

	@Column(name="orderId")
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name="waterwayWorkerId")
	public String getWaterwayWorkerId(){
		return waterwayWorkerId;
	}

	public void setWaterwayWorkerId(String waterwayWorkerId){
		this.waterwayWorkerId = waterwayWorkerId;
	}

	@Column(name="circuitWorkerId")
	public String getCircuitWorkerId(){
		return circuitWorkerId;
	}

	public void setCircuitWorkerId(String circuitWorkerId){
		this.circuitWorkerId = circuitWorkerId;
	}

	@Column(name="powerWorkerId")
	public String getPowerWorkerId(){
		return powerWorkerId;
	}

	public void setPowerWorkerId(String powerWorkerId){
		this.powerWorkerId = powerWorkerId;
	}

	@Column(name="startTime")
	public String getStartTime(){
		return startTime;
	}

	public void setStartTime(String startTime){
		this.startTime = startTime;
	}

	@Column(name="startTimeFlag")
	public int getStartTimeFlag(){
		return startTimeFlag;
	}

	public void setStartTimeFlag(int startTimeFlag){
		this.startTimeFlag = startTimeFlag;
	}

	@Column(name="endTime")
	public String getEndTime(){
		return endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	@Column(name="endTimeFlag")
	public int getEndTimeFlag(){
		return endTimeFlag;
	}

	public void setEndTimeFlag(int endTimeFlag){
		this.endTimeFlag = endTimeFlag;
	}

	@Column(name = "csId")
	public long getCsId(){
		return csId;
	}

	public void setCsId(long csId){
		this.csId = csId;
	}
	
}
