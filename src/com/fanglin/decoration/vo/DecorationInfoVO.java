/**
 * @File Name		: QuotationItemVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.vo;

import java.io.Serializable;

public class DecorationInfoVO implements Serializable {

	private static final long serialVersionUID = -2963707929983696191L;

	private Long diid;
	
	private String orderId;
	
	private String notSalesmanName;
	
	private String notSalesmanPhone;
	
	private String notSalesmanContent;
	
	private String backOrderName;
	
	private String backOrderPhone;
	
	private String backOrderContent;

	public Long getDiid() {
		return diid;
	}

	public void setDiid(Long diid) {
		this.diid = diid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getNotSalesmanName() {
		return notSalesmanName;
	}

	public void setNotSalesmanName(String notSalesmanName) {
		this.notSalesmanName = notSalesmanName;
	}

	public String getNotSalesmanPhone() {
		return notSalesmanPhone;
	}

	public void setNotSalesmanPhone(String notSalesmanPhone) {
		this.notSalesmanPhone = notSalesmanPhone;
	}

	public String getNotSalesmanContent() {
		return notSalesmanContent;
	}

	public void setNotSalesmanContent(String notSalesmanContent) {
		this.notSalesmanContent = notSalesmanContent;
	}

	public String getBackOrderName() {
		return backOrderName;
	}

	public void setBackOrderName(String backOrderName) {
		this.backOrderName = backOrderName;
	}

	public String getBackOrderPhone() {
		return backOrderPhone;
	}

	public void setBackOrderPhone(String backOrderPhone) {
		this.backOrderPhone = backOrderPhone;
	}

	public String getBackOrderContent() {
		return backOrderContent;
	}

	public void setBackOrderContent(String backOrderContent) {
		this.backOrderContent = backOrderContent;
	}
	
	

}
