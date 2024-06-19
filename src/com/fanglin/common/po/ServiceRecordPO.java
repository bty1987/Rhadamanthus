package com.fanglin.common.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "servicerecord", catalog = "platform")
public class ServiceRecordPO implements java.io.Serializable {

	private static final long serialVersionUID = 6183347283851549874L;
	
	public static final short TYPE_CHANGE_DECORATION_INT = 1;
	
	public static final short TYPE_CHANGE_MATERIAL_INT = 2;
	
	public static final short TYPE_CHANGE_QUOTATION_INT = 3;
	
	public static final short TYPE_CHANGE_PAYMENT_INT = 4;
	
	public static final short TYPE_REFUND_PAYMENT_INT = 5;
	
	private Long srId;
	
	private String orderId; 
	
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

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
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
	
	public ServiceRecordPO init(short type, String userId, String orderId, String info){
		
		setOrderId(orderId);
		setType(type);
		setOperateUserId(userId);
		setInfo(info);
		
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		
		return this;
	}

}