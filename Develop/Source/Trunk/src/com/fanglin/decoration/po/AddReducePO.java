/**
 * @File Name		: AddReducePO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="addreduce", catalog = "platform")
public class AddReducePO implements Serializable{

	private static final long serialVersionUID = -46470961633886019L;

	public static String COLUMN_ARID_STR = "arId";
	
	public static String COLUMN_ORDERID_STR = "orderId";
	
	public static String COLUMN_ADDREDUCETYPE_STR = "addReduceType";
	
	public static String COLUMN_ADDREDUCESTATUS_STR = "addReduceTotal";
	
	public static String COLUMN_ADDREDUCETOTAL_STR = "addReduceStatus";
	
	public static String COLUMN_ADDREDUCEDES_STR = "addReduceDes";
	
	public static String COLUMN_ORDERPAYMENTID_STR="orderPaymentId";
	
	public static int ADDREDUCETYPE_ADD_INT = 0;
	
	public static int ADDREDUCETYPE_REDUCE_INT = 1;
	
	public static int ADDREDUCETYPE_LEAKAGE_INT = 2;
	
	public static int ADDREDUCESTATUS_UNSUBMIT_INT = 0;
	
	public static int ADDREDUCESTATUS_SUBMIT_INT = 1;
	
	public static int ADDREDUCESTATUS_PAYED_INT = 2;
	
	public static int ADDREDUCESTATUS_CONFIRMED_INT = 3;
	
	private int arId;
	
	private String orderId;
	
	private int addReduceType;
	
	private Float addReduceTotal=(float) 0;
	
	private int addReduceStatus;
	
	private Timestamp createTime;
	
	private String addReduceDes;
	
	private Long orderPaymentId;

	@Id
	@Column(name="arId")
	public int getArId(){
		return arId;
	}

	public void setArId(int arId){
		this.arId = arId;
	}
	
	@Column(name="orderId")
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name="addReduceType")
	public int getAddReduceType(){
		return addReduceType;
	}

	public void setAddReduceType(int addReduceType){
		this.addReduceType = addReduceType;
	}

	@Column(name="addReduceTotal")
	public Float getAddReduceTotal(){
		return addReduceTotal;
	}

	public void setAddReduceTotal(Float addReduceTotal){
		this.addReduceTotal = addReduceTotal;
	}

	@Column(name="addReduceStatus")
	public int getAddReduceStatus(){
		return addReduceStatus;
	}

	public void setAddReduceStatus(int addReduceStatus){
		this.addReduceStatus = addReduceStatus;
	}
	
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	@Column(name="addReduceDes")
	public String getAddReduceDes(){
		return addReduceDes;
	}

	public void setAddReduceDes(String addReduceDes){
		this.addReduceDes = addReduceDes;
	}

	public void setOrderPaymentId(Long orderPaymentId){
		this.orderPaymentId = orderPaymentId;
	}

	public Long getOrderPaymentId(){
		return orderPaymentId;
	}
	
}
