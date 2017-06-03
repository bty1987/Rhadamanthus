/**
 * @File Name		: CleaningConstructionSchedulePO.java
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
@Table(name="cleaningconstructionschedule", catalog = "platform")
public class CleaningConstructionSchedulePO implements Serializable {

	private static final long serialVersionUID = -8701965467459440790L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final int CLEANING_CONSTRUCTION_SCHEDULE_TYPE_ID_INT = 10;
	
	public static final int CLEANING_ALLOCATION_WORKER_FLAG_INT = 256;
	
	public static final String CLEANING_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "保洁";
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
    private int ccsId;
    
    private long csId;
    
    private String orderId;
    
    private String workerId;
    
    private String startTime;
    
    private int startTimeFlag;
    
    private String endTime;
    
    private int endTimeFlag;
    
    public CleaningConstructionSchedulePO() {
		super();
	}

	public CleaningConstructionSchedulePO(long csId, String orderId, String startTime, String endTime) {
		super();
		this.csId = csId;
		this.orderId = orderId;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	@Id 
    @GeneratedValue(strategy=IDENTITY)
    @Column(name="ccsId")
    public int getCcsId(){
        return this.ccsId;
    }
    
    public void setCcsId(int ccsId){
        this.ccsId = ccsId;
    }
    
    @Column(name="orderId")
    public String getOrderId(){
        return this.orderId;
    }
    
    public void setOrderId(String orderId){
        this.orderId = orderId;
    }
    
    @Column(name="workerId")
    public String getWorkerId(){
        return this.workerId;
    }
    
    public void setWorkerId(String workerId){
        this.workerId = workerId;
    }
    
    @Column(name="startTime")
    public String getStartTime(){
        return this.startTime;
    }
    
    public void setStartTime(String startTime){
        this.startTime = startTime;
    }
    
    @Column(name="startTimeFlag")
    public int getStartTimeFlag(){
        return this.startTimeFlag;
    }
    
    public void setStartTimeFlag(int startTimeFlag){
        this.startTimeFlag = startTimeFlag;
    }
    
    @Column(name="endTime")
    public String getEndTime(){
        return this.endTime;
    }
    
    public void setEndTime(String endTime){
        this.endTime = endTime;
    }
    
    @Column(name="endTimeFlag")
    public int getEndTimeFlag(){
        return this.endTimeFlag;
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
