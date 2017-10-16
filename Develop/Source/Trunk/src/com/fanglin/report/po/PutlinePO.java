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

package com.fanglin.report.po;

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
@Table(name = "putlineconstructionschedule", catalog = "report")
public class PutlinePO implements Serializable {

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
	
	private long csId;
	
	private DecorationOrderPO decorationOrder;
	
	private String startTime;
	
	private int startTimeFlag;
	
	private String endTime;
	
	private int endTimeFlag;
	
	private int putlineStatus;
	
	private String putlineTime;

	public PutlinePO() {
		super();
	}

	public PutlinePO(long csId, DecorationOrderPO decorationOrder, String startTime, String endTime) {
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
	public long getCsId() {
		return csId;
	}

	public void setCsId(long csId) {
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
}