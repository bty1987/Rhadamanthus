/**
 * @File Name	: Construction.java
 * @Package   	: com.fanglin.entity.construction
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
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationOrderPO;

@Entity
@Table(name="construction", catalog = "construction")
public class ConstructionPO implements Serializable{

	private static final long serialVersionUID = -3113263670279309498L;
	
	public static final String COLUMN_ORDERID_STR = "decorationOrderPO.orderId";
	
	public static final String COLUMN_SCHEDULE_STR = "schedule";
	
	public static final String COLUMN_SUPERVISORQUALITYID_STR = "supervisorQualityId";
	
	public static final String COLUMN_CHANSTATUS_STR = "chanStatus";
	
	public static final String COLUMN_ALLOCATIONWORKERFLAG_STR = "allocationWorkerFlag";
	
	public static final String COLUMN_ACCEPTANCEFLAG_STR = "acceptanceFlag";
	
	public static final int SCHEDULE_TYPE_CHAN_INT = 1;
	
	public static final int SCHEDULE_TYPE_PUTLINE_INT = 2;
	
	public static final int SCHEDULE_TYPE_WATERWAYCIRCUIT_INT = 3;
	
	public static final int SCHEDULE_TYPE_BRICKLAY_INT = 4;
	
	public static final int SCHEDULE_TYPE_GROUNDLEVELING_INT = 5;
	
	public static final int SCHEDULE_TYPE_CARPENT_INT = 6;
	
	public static final int SCHEDULE_TYPE_OIL_INT = 7;
	
	public static final int SCHEDULE_TYPE_WATERWAYCIRCUITCHECK_INT = 8;
	
	public static final int SCHEDULE_TYPE_CLEANING_INT = 9;
	
	public static final String COLUMN_CID_STR = "cid";
	
	private long cid;
	
	private DecorationOrderPO decorationOrderPO;
	
	private String supervisorQualityId;
	
	private int schedule;
	
	private int chanStatus;
	
	private int allocationWorkerFlag;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="cid")
	public long getCid(){
		return cid;
	}

	public void setCid(long cid){
		this.cid = cid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName="orderId")
	public DecorationOrderPO getDecorationOrderPO() {
		return decorationOrderPO;
	}

	public void setDecorationOrderPO(DecorationOrderPO decorationOrderPO) {
		this.decorationOrderPO = decorationOrderPO;
	}

	@Column(name="supervisorQualityId")
	public String getSupervisorQualityId(){
		return supervisorQualityId;
	}

	public void setSupervisorQualityId(String supervisorQualityId){
		this.supervisorQualityId = supervisorQualityId;
	}

	@Column(name="schedule")
	public int getSchedule(){
		return schedule;
	}

	public void setSchedule(int schedule){
		this.schedule = schedule;
	}

	@Column(name = "chanStatus")
	public int getChanStatus(){
		return chanStatus;
	}

	public void setChanStatus(int chanStatus){
		this.chanStatus = chanStatus;
	}

	@Column(name = "allocationWorkerFlag")
	public int getAllocationWorkerFlag() {
		return allocationWorkerFlag;
	}

	public void setAllocationWorkerFlag(int allocationWorkerFlag) {
		this.allocationWorkerFlag = allocationWorkerFlag;
	}
}