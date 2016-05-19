/**
 * @File Name		: Rework.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="rework", catalog = "platform")
public class ReworkPO implements Serializable{

	private static final long serialVersionUID = 574508244898090148L;
	
	public static String COLUMN_RWID_STR = "rwId";
	
	public static String COLUMN_ORDERID_STR = "orderId";
	
	public static String COLUMN_CREATETIME_STR = "createTime";
	
	public static String COLUMN_REWORKDES = "reworkDes";
	
	private int rwId;
	
	private String orderId;
	
	private String createrId;
	
	private String createrName;
	
	private String createTime;
	
	private String reworkDes;

	@Id
	@Column(name="rwId")
	public int getRwId(){
		return rwId;
	}

	public void setRwId(int rwId){
		this.rwId = rwId;
	}
	
	@Column(name="orderId")
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name="createTime")
	public String getCreateTime(){
		return createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	@Column(name="reworkDes")
	public String getReworkDes(){
		return reworkDes;
	}

	public void setReworkDes(String reworkDes){
		this.reworkDes = reworkDes;
	}

	@Column(name = "createrId")
	public String getCreaterId(){
		return createrId;
	}

	public void setCreaterId(String createrId){
		this.createrId = createrId;
	}

	@Column(name = "createrName")
	public String getCreaterName(){
		return createrName;
	}

	public void setCreaterName(String createrName){
		this.createrName = createrName;
	}
	
}
