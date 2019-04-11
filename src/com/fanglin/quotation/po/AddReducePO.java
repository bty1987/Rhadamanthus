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

package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="addreduce", catalog = "quotation")
public class AddReducePO implements Serializable{

	private static final long serialVersionUID = -46470961633886019L;

	public static final String COLUMN_ARID_STR = "arId";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final String COLUMN_TOTAL_STR = "total";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_CONTENT_STR = "content";
	
	public static final String COLUMN_DPID_STR = "dpId";
	
	public static final int TYPE_ADD_INT = 0;
	
	public static final int TYPE_REDUCE_INT = 1;
	
	public static final int TYPE_LEAKAGE_INT = 2;
	
	public static final int STATUS_UNSUBMIT_INT = 0;
	
	public static final int STATUS_SUBMIT_INT = 1;
	
	public static final int STATUS_PAYED_INT = 2;
	
	public static final int STATUS_CONFIRMED_INT = 3;
	
	private int arId;
	
	private String orderId;
	
	private int type;
	
	private float total;
	
	private int status;
	
	private Timestamp createTime;
	
	private String content;
	
	private long dpId;
	
	private float managePrice;
	
	private float manageRate;

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

	@Column(name="type")
	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	@Column(name="total")
	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	@Column(name="status")
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@Column(name="createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name="content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name="dpId")
	public long getDpId() {
		return dpId;
	}

	public void setDpId(long dpId) {
		this.dpId = dpId;
	}
	
	@Column(name="managePrice")
	public float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(float managePrice) {
		this.managePrice = managePrice;
	}

	@Column(name="manageRate")
	public float getManageRate() {
		return manageRate;
	}

	public void setManageRate(float manageRate) {
		this.manageRate = manageRate;
	}

}
