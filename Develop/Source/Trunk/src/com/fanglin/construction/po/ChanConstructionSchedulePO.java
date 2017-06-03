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
	
	private long csId;
	
	private String orderId;
	
	private String startTime;
	
	private int startTimeFlag;
	
	private String endTime;
	
	private int endTimeFlag;
	
	private int status;
	
	private Timestamp allocateTime;

	public ChanConstructionSchedulePO() {
		super();
	}

	public ChanConstructionSchedulePO(long csId, String orderId, String startTime, String endTime) {
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

	@Column(name = "status")
	public int getStatus(){
		return status;
	}

	public void setStatus(int status){
		this.status = status;
	}

	@Column(name = "csId")
	public long getCsId(){
		return csId;
	}

	public void setCsId(long csId){
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
