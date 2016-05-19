/**
 * @File Name		: QuotationVO
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class QuotationVO implements Serializable {

	private static final long serialVersionUID = -62258203481876631L;

	private Long autoId;
	
	private String orderId;
	
	private String OrderStatus;
	
	private Integer orderActivityId;
	
	private String orderActivity;
	
	private Float orderActivityDiscount;
	
	private Float orderTotalPrice;
	
	private Timestamp contractTime;
	
	private String versionId;

	private String quotationName;
	
	private String decorationStyle;
	
	private Timestamp createTime;
	
	protected String quotationContent;
	
	private String designerId;
	
	private String designer;
	
	private Float discount;
	
	private Float totalPrice;
	
	private Integer status;
	
	private Integer saveStatus;
	
	private Integer calFlag;

	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getOrderStatus(){
		return OrderStatus;
	}

	public void setOrderStatus(String orderStatus){
		OrderStatus = orderStatus;
	}

	public Integer getOrderActivityId(){
		return orderActivityId;
	}

	public void setOrderActivityId(Integer orderActivityId){
		this.orderActivityId = orderActivityId;
	}

	public String getQuotationName(){
		return quotationName;
	}

	public void setQuotationName(String quotationName){
		this.quotationName = quotationName;
	}

	public String getDecorationStyle(){
		return decorationStyle;
	}

	public void setDecorationStyle(String decorationStyle){
		this.decorationStyle = decorationStyle;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public String getQuotationContent(){
		return quotationContent;
	}

	public void setQuotationContent(String quotationContent){
		this.quotationContent = quotationContent;
	}
	
	public Float getDiscount(){
		return discount;
	}

	public void setDiscount(Float discount){
		this.discount = discount;
	}

	public Integer getStatus(){
		return status;
	}

	public void setStatus(Integer status){
		this.status = status;
	}

	public void setTotalPrice(Float totalPrice){
		this.totalPrice = totalPrice;
	}

	public Float getTotalPrice(){
		return totalPrice;
	}

	public void setDesignerId(String designerId){
		this.designerId = designerId;
	}

	public String getDesignerId(){
		return designerId;
	}

	public void setDesigner(String designer){
		this.designer = designer;
	}

	public String getDesigner(){
		return designer;
	}

	public void setSaveStatus(Integer saveStatus){
		this.saveStatus = saveStatus;
	}

	public Integer getSaveStatus(){
		return saveStatus;
	}

	public void setOrderActivity(String orderActivity){
		this.orderActivity = orderActivity;
	}

	public String getOrderActivity(){
		return orderActivity;
	}

	public void setVersionId(String versionId){
		this.versionId = versionId;
	}

	public String getVersionId(){
		return versionId;
	}

	public Float getOrderActivityDiscount(){
		return orderActivityDiscount;
	}

	public void setOrderActivityDiscount(Float orderActivityDiscount){
		this.orderActivityDiscount = orderActivityDiscount;
	}

	public Float getOrderTotalPrice(){
		return orderTotalPrice;
	}

	public void setOrderTotalPrice(Float orderTotalPrice){
		this.orderTotalPrice = orderTotalPrice;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getContractTime(){
		return contractTime;
	}

	public void setContractTime(Timestamp contractTime){
		this.contractTime = contractTime;
	}

	public void setCalFlag(Integer calFlag){
		this.calFlag = calFlag;
	}

	public Integer getCalFlag(){
		return calFlag;
	}

}
