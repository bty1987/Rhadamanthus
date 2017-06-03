/**
 * @File Name		: ConstructionSchedule.java
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
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationOrderPO;

@Entity
@Table(name="constructionschedule", catalog = "platform")
public class ConstructionSchedulePO implements Serializable{

	private static final long serialVersionUID = -3113263670279309498L;
	
	public static final String COLUMN_ORDERID_STR = "decorationOrderPO.orderId";
	
	public static final String COLUMN_SCHEDULE_STR = "schedule";
	
	public static final String COLUMN_SUPERVISORQUALITYID_STR = "supervisorQualityId";
	
	public static final String COLUMN_CHANQUALITYID_STR = "chanQualityId";
	
	public static final String COLUMN_PUTLINEQUALITYID_STR = "putlineQualityId";
	
	public static final String COLUMN_WATERWAYCIRCUITQUALITYID_STR = "waterwayCircuitPowerQualityId";
	
	public static final String COLUMN_POWERQUALITYID_STR = "powerQualityId";
	
	public static final String COLUMN_BRICKLAYQUALITYID_STR = "bricklayQualityId";
	
	public static final String COLUMN_CARPENTQUALITYID_STR = "carpentQualityId";
	
	public static final String COLUMN_OILQUALITYID_STR = "oilQualityId";
	
	public static final String COLUMN_CLEANINGQUALITYID_STR = "cleaningQualityId";
	
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
	
	public static final String COLUMN_CSID_STR = "csId";
	
	private long csId;
	
	private DecorationOrderPO decorationOrderPO;
	
	private String supervisorQualityId;
	
	private String chanQualityId;
	
	private String putlineQualityId;
	
	private String waterwayCircuitPowerQualityId;
	
	private String powerQualityId;
	
	private String bricklayQualityId;
	
	private String carpentQualityId;
	
	private String oilQualityId;
	
	private String cleaningQualityId;
	
	private int schedule;
	
	private int chanStatus;
	
	private int allocationWorkerFlag;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="csId")
	public long getCsId(){
		return csId;
	}

	public void setCsId(long csId){
		this.csId = csId;
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

	@Column(name="waterwayCircuitPowerQualityId")
	public String getWaterwayCircuitPowerQualityId(){
		return waterwayCircuitPowerQualityId;
	}

	public void setWaterwayCircuitPowerQualityId(String waterwayCircuitPowerQualityId){
		this.waterwayCircuitPowerQualityId = waterwayCircuitPowerQualityId;
	}

	@Column(name="powerQualityId")
	public String getPowerQualityId(){
		return powerQualityId;
	}

	public void setPowerQualityId(String powerQualityId){
		this.powerQualityId = powerQualityId;
	}

	@Column(name="bricklayQualityId")
	public String getBricklayQualityId(){
		return bricklayQualityId;
	}

	public void setBricklayQualityId(String bricklayQualityId){
		this.bricklayQualityId = bricklayQualityId;
	}

	@Column(name="carpentQualityId")
	public String getCarpentQualityId(){
		return carpentQualityId;
	}

	public void setCarpentQualityId(String carpentQualityId){
		this.carpentQualityId = carpentQualityId;
	}

	@Column(name="schedule")
	public int getSchedule(){
		return schedule;
	}

	public void setSchedule(int schedule){
		this.schedule = schedule;
	}

	@Column(name="chanQualityId")
	public String getChanQualityId(){
		return chanQualityId;
	}

	public void setChanQualityId(String chanQualityId){
		this.chanQualityId = chanQualityId;
	}

	@Column(name="putlineQualityId")
	public String getPutlineQualityId(){
		return putlineQualityId;
	}

	public void setPutlineQualityId(String putlineQualityId){
		this.putlineQualityId = putlineQualityId;
	}

	@Column(name = "oilQualityId")
	public String getOilQualityId(){
		return oilQualityId;
	}

	public void setOilQualityId(String oilQualityId){
		this.oilQualityId = oilQualityId;
	}

	@Column(name = "cleaningQualityId")
	public String getCleaningQualityId(){
		return cleaningQualityId;
	}

	public void setCleaningQualityId(String cleaningQualityId){
		this.cleaningQualityId = cleaningQualityId;
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