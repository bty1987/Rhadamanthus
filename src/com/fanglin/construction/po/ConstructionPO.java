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
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name="construction", catalog = "construction")
public class ConstructionPO implements Serializable{

	private static final long serialVersionUID = -3113263670279309498L;
	
	public static final String COLUMN_ORDERID_STR = "decoration.orderId";
	
	public static final String COLUMN_SCHEDULE_STR = "schedule";
	
	public static final String COLUMN_SUPERVISORQUALITYID_STR = "supervisor";
	
	public static final String COLUMN_CHANSTATUS_STR = "chanStatus";
	
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
	
	private DecorationPO decoration;
	
	private UserPO	supervisor;
	
	private int schedule;
	
	private Timestamp startTime;
	
	private Timestamp endTime;

	public ConstructionPO() {
		super();
	}
	
	public ConstructionPO(DecorationPO decoration) {
		super();
		this.decoration = decoration;
	}

	public ConstructionPO(DecorationPO decoration, UserPO supervisor) {
		super();
		this.decoration = decoration;
		this.supervisor = supervisor;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "suid", referencedColumnName="uid")	
	public UserPO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserPO supervisor) {
		this.supervisor = supervisor;
	}
	
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
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}


	@Column(name="schedule")
	public int getSchedule(){
		return schedule;
	}

	public void setSchedule(int schedule){
		this.schedule = schedule;
	}
	
	@Column(name="startTime")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}
	
	@Column(name="endTime")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}
}