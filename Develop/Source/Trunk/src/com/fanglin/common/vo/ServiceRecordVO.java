package com.fanglin.common.vo;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "servicerecord", catalog = "platform")
public class ServiceRecordVO implements java.io.Serializable {

	private static final long serialVersionUID = 6183347283851549874L;

	private Long srId;
	
	private Short type;
	
	private String operateUserId;
	
	private Timestamp operateTime;
	
	private String info;

	public Long getSrId(){
		return this.srId;
	}

	public void setSrId(Long srId){
		this.srId = srId;
	}

	@Column(name = "type", nullable = false)
	public Short getType(){
		return this.type;
	}

	public void setType(Short type){
		this.type = type;
	}

	@Column(name = "operateUserId", nullable = false, length = 15)
	public String getOperateUserId(){
		return this.operateUserId;
	}

	public void setOperateUserId(String operateUserId){
		this.operateUserId = operateUserId;
	}

	@Column(name = "operateTime", nullable = false, length = 19)
	public Timestamp getOperateTime(){
		return this.operateTime;
	}

	public void setOperateTime(Timestamp operateTime){
		this.operateTime = operateTime;
	}

	@Column(name = "info", nullable = false, length = 256)
	public String getInfo(){
		return this.info;
	}

	public void setInfo(String info){
		this.info = info;
	}

}