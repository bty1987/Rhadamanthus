package com.fanglin.common.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "servicerecord", catalog = "platform")
public class ServiceRecordPO implements java.io.Serializable {

	private static final long serialVersionUID = 6183347283851549874L;
	
	public static final short TYPE_TYPE_CHANGE_DECORATIONORDER_ORDERID_INT = 1;
	
	public static final short TYPE_TYPE_CHANGE_DECORATIONORDER_VERSIONID_INT = 2;
	
	public static final short TYPE_TYPE_CHANGE_DECORATIONORDER_DATETIME_INT = 3;
	
	public static final short TYPE_TYPE_CHANGE_MATERIALSUBORDER_ORDERID_INT = 4;
	
	public static final short TYPE_TYPE_CHANGE_DECORATIONORDER_STATUS_INT = 5;
	
	public static final short TYPE_TYPE_CHANGE_DECORATIONPAYMENT_TIME_INT = 6;
	
	public static final short TYPE_TYPE_CHANGE_MATERIALPAYMENT_TIME_INT = 7;
	
	public static final short TYPE_TYPE_REFUND_DECORATIONPAYMENT_INT = 8;
	
	public static final short TYPE_TYPE_CHANGE_QUOTATION_STATUS_INT = 9;

	private Long srId;
	
	private Short type;
	
	private String operateUserId;
	
	private Timestamp operateTime;
	
	private String info;
	
	public ServiceRecordPO(){
		super();
	}

	public ServiceRecordPO(Short type, String operateUserId, Timestamp operateTime, String info){
		super();
		this.type = type;
		this.operateUserId = operateUserId;
		this.operateTime = operateTime;
		this.info = info;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "srId")
	public Long getSrId(){
		return this.srId;
	}

	public void setSrId(Long srId){
		this.srId = srId;
	}

	@Column(name = "type")
	public Short getType(){
		return this.type;
	}

	public void setType(Short type){
		this.type = type;
	}

	@Column(name = "operateUserId")
	public String getOperateUserId(){
		return this.operateUserId;
	}

	public void setOperateUserId(String operateUserId){
		this.operateUserId = operateUserId;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime(){
		return this.operateTime;
	}

	public void setOperateTime(Timestamp operateTime){
		this.operateTime = operateTime;
	}

	@Column(name = "info")
	public String getInfo(){
		return this.info;
	}

	public void setInfo(String info){
		this.info = info;
	}

}