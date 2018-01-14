/**
 * @File Name		: QuotationTemplatePO.java
 * @Package 	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "decorationInfo", catalog = "platform")
public class DecorationInfoPO implements Serializable {

	private static final long serialVersionUID = -7484137001624425538L;
	
	private long diid;
	
	private String orderId;
	
	private String notSalesmanName;
	
	private String notSalesmanPhone;
	
	private String notSalesmanContent;
	
	private String backOrderName;
	
	private String backOrderPhone;
	
	private String backOrderContent;
	
	
	public DecorationInfoPO() {
		super();
	}
	
	public DecorationInfoPO(String orderId) {
		super();
		this.orderId = orderId;
	}
	
	@Id
	@GeneratedValue
	@Column(name="diid")
	public long getDiid() {
	return diid;
	}

	public void setDiid(long diid) {
		this.diid = diid;
	}
	
	@Column(name="orderId")
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}
	
	@Column(name="notSalesmanName")
	public String getNotSalesmanName() {
		return notSalesmanName;
	}

	public void setNotSalesmanName(String notSalesmanName) {
		this.notSalesmanName = notSalesmanName;
	}
	
	@Column(name="notSalesmanPhone")
	public String getNotSalesmanPhone() {
		return notSalesmanPhone;
	}

	public void setNotSalesmanPhone(String notSalesmanPhone) {
		this.notSalesmanPhone = notSalesmanPhone;
	}
	
	@Column(name="notSalesmanContent")
	public String getNotSalesmanContent() {
		return notSalesmanContent;
	}

	public void setNotSalesmanContent(String notSalesmanContent) {
		this.notSalesmanContent = notSalesmanContent;
	}
	
	@Column(name="backOrderName")
	public String getBackOrderName() {
		return backOrderName;
	}

	public void setBackOrderName(String backOrderName) {
		this.backOrderName = backOrderName;
	}
	
	@Column(name="backOrderPhone")
	public String getBackOrderPhone() {
		return backOrderPhone;
	}

	public void setBackOrderPhone(String backOrderPhone) {
		this.backOrderPhone = backOrderPhone;
	}
	
	@Column(name="backOrderContent")
	public String getBackOrderContent() {
		return backOrderContent;
	}

	public void setBackOrderContent(String backOrderContent) {
		this.backOrderContent = backOrderContent;
	}

	

}
