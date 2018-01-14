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
import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "decorationContract", catalog = "platform")
public class DecorationContractPO implements Serializable {

	private static final long serialVersionUID = -5971474052433501162L;

	private long autoId;
	
	private DecorationPO decorationPO;
	
	private String additionalInfo;
	
	private String templateHtml;
	
	private Timestamp signTime;
	
	private int workingDuration;
	
	private Timestamp startTime;
	
	private Timestamp endTime;
	
	private String  contractCode;
	
	private float orderTotalPrice;
	
	public DecorationContractPO(){
	}
	
	@Id
	@GeneratedValue
	public long getAutoId(){
		return autoId;
	}

	public void setAutoId(long autoId){
		this.autoId = autoId;
	}
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecorationPO(){
		return decorationPO;
	}

	public void setDecorationPO(DecorationPO decorationPO){
		this.decorationPO = decorationPO;
	}
	
	public String getAdditionalInfo(){
		return additionalInfo;
	}
	
	public void setAdditionalInfo(String additionalInfo){
		this.additionalInfo = additionalInfo;
	}
	public String getTemplateHtml(){
		return templateHtml;
	}
	
	public void setTemplateHtml(String templateHtml){
		this.templateHtml = templateHtml;
	}
	
	public Timestamp getSignTime(){
		return signTime;
	}
	
	public void setSignTime(Timestamp signTime){
		this.signTime = signTime;
	}
	
	public void setContractCode(String contractCode){
		this.contractCode = contractCode;
	}
	
	public String getContractCode(){
		return contractCode;
	}
	
	public void setEndTime(Timestamp endTime){
		this.endTime = endTime;
	}
	
	public Timestamp getEndTime(){
		return endTime;
	}
	
	public void setStartTime(Timestamp startTime){
		this.startTime = startTime;
	}
	
	public Timestamp getStartTime(){
		return startTime;
	}
	
	public void setWorkingDuration(int workingDuration){
		this.workingDuration = workingDuration;
	}
	
	public int getWorkingDuration(){
		return workingDuration;
	}

	public float getOrderTotalPrice() {
		return orderTotalPrice;
	}

	public void setOrderTotalPrice(float orderTotalPrice) {
		this.orderTotalPrice = orderTotalPrice;
	}
}
