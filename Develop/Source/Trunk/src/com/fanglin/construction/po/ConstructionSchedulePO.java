/**
 * @File Name	: Bricklayconstructionschedule.java
 * @Package   	: com.fanglin.entity.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
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
@Table(name="constructionschedule", catalog = "construction")
public class ConstructionSchedulePO implements Serializable{

	private static final long serialVersionUID = -4715729970075470712L;
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_CID_STR = "cid";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_SCHEDULE_STR = "schedule";
	
	public static final short STATUS_TYPE_INIT_INT = 0;
	
	public static final short STATUS_TYPE_SUCCESS_INT = 1;
	
	public static final short STATUS_TYPE_FAIL_INT = 2;
	
	public static final short STATUS_TYPE_DELAY_INT = 3;
	
	public static final short STATUS_TYPE_PASS_INT = 4;
	
	public static final short COLUMN_SCHEDULE_ONE = 1;
	
	public static final short COLUMN_SCHEDULE_TWO = 2;
	
	public static final int SCHEDULE_TYPE_CHAN_INT = 1;
	
	public static final int SCHEDULE_TYPE_PUTLINE_INT = 2;
	
	public static final int SCHEDULE_TYPE_WATERWAYCIRCUIT_INT = 3;
	
	public static final int SCHEDULE_TYPE_BRICKLAY_INT = 4;
	
	public static final int SCHEDULE_TYPE_GROUNDLEVELING_INT = 5;
	
	public static final int SCHEDULE_TYPE_CARPENT_INT = 6;
	
	public static final int SCHEDULE_TYPE_OIL_INT = 7;
	
	public static final int SCHEDULE_TYPE_WATERWAYCIRCUITCHECK_INT = 8;
	
	public static final int SCHEDULE_TYPE_CLEANING_INT = 9;
	
	public static final String CHAN_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "铲大白";
	
	public static final String PUBLINE_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "放线";
	
	public static final String WATERWAYCIRCUITPOWER_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "水电力";
	
	public static final String BRICKLAY_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "瓦工";
	
	public static final String GROUNDLEVELING_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "地面找平";
	
	public static final String CARPENT_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "木工";
	
	public static final String OIL_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "油工";
	
	public static final String WATERWAYCIRCUITCHECK_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "水电验收";
	
	public static final String CLEANING_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "保洁";
	
	public static final short STARTTIMEFLAG_TYPE_INIT_INT = 0;
	
	public static final short ENDTIMEFLAG_TYPE_INIT_INT = 1;
	
	public static final int CHAN_ALLOCATION_WORKER_FLAG_INT = 1;
	
	public static final int PUBLINE_ALLOCATION_WORKER_FLAG_INT = 2;
	
	public static final int WATERWAYCIRCUITPOWER_ALLOCATION_WORKER_FLAG_INT = 4;
	
	public static final int BRICKLAY_ALLOCATION_WORKER_FLAG_INT = 8;
	
	public static final int GROUNDLEVELING_ALLOCATION_WORKER_FLAG_INT = 16;
	
	public static final int CARPENT_ALLOCATION_WORKER_FLAG_INT = 32;
	
	public static final int OIL_ALLOCATION_WORKER_FLAG_INT = 64;
	
	public static final int WATERWAYCIRCUITCHECK_ALLOCATION_WORKER_FLAG_INT = 128;
	
	public static final int CLEANING_ALLOCATION_WORKER_FLAG_INT = 256;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	private int csId;
	
	private long cid;
	
	private String orderId;
	
	private String startTime;
	
	private String endTime;
	
	private short status;
	
	private short schedule;
	
	public ConstructionSchedulePO() {
		super();
	}

	public ConstructionSchedulePO(long cid, String orderId, String startTime, String endTime, short schedule) {
		super();
		this.cid = cid;
		this.orderId = orderId;
		this.startTime = startTime;
		this.endTime = endTime;
		this.schedule = schedule;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "csid")
	public int getCsId() {
		return csId;
	}

	public void setCsId(int csId) {
		this.csId = csId;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "startTime")
	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "schedule")
	public short getSchedule() {
		return schedule;
	}

	public void setSchedule(short schedule) {
		this.schedule = schedule;
	}

}
