/**
 * @File Name		: QuotationVO
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Map;

import org.apache.struts2.json.annotations.JSON;

public class DecorationContractVO implements Serializable {

	private static final long serialVersionUID = -6225111181876631L;

	private Long autoId;
	
	private String orderId;

	private String additionalInfo;
	
	private String templateHtml;
	
	private Timestamp signTime;
	
	private Integer workingDuration;
	
	private Timestamp startTime;
	
	private Timestamp endTime;
	
	private String contractCode;
	
	private Float orderTotalPrice;
	
	private Map<String, String> payments;

	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
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

	@JSON(format="yyyy-MM-dd")
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

	@JSON(format="yyyy-MM-dd")
	public Timestamp getEndTime(){
		return endTime;
	}

	public void setStartTime(Timestamp startTime){
		this.startTime = startTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getStartTime(){
		return startTime;
	}

	public void setWorkingDuration(Integer workingDuration){
		this.workingDuration = workingDuration;
	}

	public Integer getWorkingDuration(){
		return workingDuration;
	}

	public Map<String, String> getPayments() {
		return payments;
	}

	public void setPayments(Map<String, String> payments) {
		this.payments = payments;
	}

	public Float getOrderTotalPrice() {
		return orderTotalPrice;
	}

	public void setOrderTotalPrice(Float orderTotalPrice) {
		this.orderTotalPrice = orderTotalPrice;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

}
