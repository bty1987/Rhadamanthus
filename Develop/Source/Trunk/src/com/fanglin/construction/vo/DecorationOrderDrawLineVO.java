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

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class DecorationOrderDrawLineVO implements Serializable {

	private static final long serialVersionUID = -6225111181876631L;

	private Long autoId;
	
	private String orderId;
	
	private String customer;
	
	private String cityProper;
	
	private String village;
	
	private String houseNumber;
	
	private float houseArea;
	
	private String orderStatus;
	
	private Float orderTotalPrice;
	
	private String orderSupervisor;
	
	private Timestamp contractTime;
	
	private String designer;
	
	private String versionId;
	
	private String versionName;
	
	private Float discount;
	
	private Timestamp  applayTime;
	
	private String applayDes;
	
	private String actualDate;
	
	private String startTime;
	
	private String endTime;
	
	private String status;
	
	private Integer applayCount;
	
	private String applayUser;
	
	private String applayUserId;
	
	private String drawLineGroup;
	
	private String drawLineUser;
	
	private String drawLineUserId;
	
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
		return orderStatus;
	}

	public void setOrderStatus(String orderStatus){
		this.orderStatus = orderStatus;
	}

	public String getCustomer(){
		return customer;
	}

	public void setCustomer(String customer){
		this.customer = customer;
	}

	public String getVillage(){
		return village;
	}

	public void setVillage(String village){
		this.village = village;
	}

	public String getHouseNumber(){
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber){
		this.houseNumber = houseNumber;
	}

	public Float getOrderTotalPrice(){
		return orderTotalPrice;
	}

	public void setOrderTotalPrice(Float orderTotalPrice){
		this.orderTotalPrice = orderTotalPrice;
	}

	public String getVersionId(){
		return versionId;
	}

	public void setVersionId(String versionId){
		this.versionId = versionId;
	}

	public String getVersionName(){
		return versionName;
	}

	public void setVersionName(String versionName){
		this.versionName = versionName;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getApplayTime(){
		return applayTime;
	}

	public void setApplayTime(Timestamp applayTime){
		this.applayTime = applayTime;
	}

	public String getActualDate(){
		return actualDate;
	}

	public void setActualDate(String actualDate){
		this.actualDate = actualDate;
	}

	public String getStartTime(){
		return startTime;
	}

	public void setStartTime(String startTime){
		this.startTime = startTime;
	}

	public String getEndTime(){
		return endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	public Integer getApplayCount(){
		return applayCount;
	}

	public void setApplayCount(Integer applayCount){
		this.applayCount = applayCount;
	}

	public String getApplayUser(){
		return applayUser;
	}

	public void setApplayUser(String applayUser){
		this.applayUser = applayUser;
	}

	public String getApplayUserId(){
		return applayUserId;
	}

	public void setApplayUserId(String applayUserId){
		this.applayUserId = applayUserId;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getContractTime(){
		return contractTime;
	}

	public void setContractTime(Timestamp contractTime){
		this.contractTime = contractTime;
	}

	public void setApplayDes(String applayDes){
		this.applayDes = applayDes;
	}

	public String getApplayDes(){
		return applayDes;
	}

	public void setHouseArea(float houseArea){
		this.houseArea = houseArea;
	}

	public float getHouseArea(){
		return houseArea;
	}

	public void setDrawLineGroup(String drawLineGroup){
		this.drawLineGroup = drawLineGroup;
	}

	public String getDrawLineGroup(){
		return drawLineGroup;
	}

	public void setDrawLineUser(String drawLineUser){
		this.drawLineUser = drawLineUser;
	}

	public String getDrawLineUser(){
		return drawLineUser;
	}

	public void setDrawLineUserId(String drawLineUserId){
		this.drawLineUserId = drawLineUserId;
	}

	public String getDrawLineUserId(){
		return drawLineUserId;
	}

	public void setDiscount(Float discount){
		this.discount = discount;
	}

	public Float getDiscount(){
		return discount;
	}

	public void setCityProper(String cityProper){
		this.cityProper = cityProper;
	}

	public String getCityProper(){
		return cityProper;
	}

	public String getDesigner(){
		return designer;
	}

	public void setDesigner(String designer){
		this.designer = designer;
	}

	public String getOrderSupervisor(){
		return orderSupervisor;
	}

	public void setOrderSupervisor(String orderSupervisor){
		this.orderSupervisor = orderSupervisor;
	}

}
