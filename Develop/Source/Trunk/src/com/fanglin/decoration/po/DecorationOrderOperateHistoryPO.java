package com.fanglin.decoration.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationorderoperatehistory", catalog = "platform")
public class DecorationOrderOperateHistoryPO implements java.io.Serializable {

	private static final long serialVersionUID = 5505808285022334255L;
	
	private Long doophId;
	
	private String orderId;
	
	private String operateTime;
	
	private String des;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "doophId")
	public Long getDoophId(){
		return this.doophId;
	}

	public void setDoophId(Long doophId){
		this.doophId = doophId;
	}

	@Column(name = "orderId")
	public String getOrderId(){
		return this.orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name = "operateTime")
	public String getOperateTime(){
		return this.operateTime;
	}

	public void setOperateTime(String operateTime){
		this.operateTime = operateTime;
	}

	@Column(name = "des")
	public String getDes(){
		return this.des;
	}

	public void setDes(String des){
		this.des = des;
	}

}