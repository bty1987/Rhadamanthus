package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "qualitytestingrecord", catalog = "construction")
public class QualityTestingRecordPO implements java.io.Serializable {

	private static final long serialVersionUID = -2466855414573660718L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_OPERATERID_STR = "operaterId";

	private int qtrId;
	
	private String orderId;
	
	private String orderAddr;
	
	private String operaterId;
	
	private String operaterName;
	
	private Timestamp recordTime;
	
	private String recordDes;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qtrId")
	public int getQtrId(){
		return this.qtrId;
	}

	public void setQtrId(int qtrId){
		this.qtrId = qtrId;
	}

	@Column(name = "orderId")
	public String getOrderId(){
		return this.orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name = "orderAddr")
	public String getOrderAddr(){
		return this.orderAddr;
	}

	public void setOrderAddr(String orderAddr){
		this.orderAddr = orderAddr;
	}

	@Column(name = "operaterId")
	public String getOperaterId(){
		return this.operaterId;
	}

	public void setOperaterId(String operaterId){
		this.operaterId = operaterId;
	}

	@Column(name = "operaterName")
	public String getOperaterName(){
		return this.operaterName;
	}

	public void setOperaterName(String operaterName){
		this.operaterName = operaterName;
	}

	@Column(name = "recordTime")
	public Timestamp getRecordTime(){
		return this.recordTime;
	}

	public void setRecordTime(Timestamp recordTime){
		this.recordTime = recordTime;
	}

	@Column(name = "recordDes")
	public String getRecordDes(){
		return this.recordDes;
	}

	public void setRecordDes(String recordDes){
		this.recordDes = recordDes;
	}

}