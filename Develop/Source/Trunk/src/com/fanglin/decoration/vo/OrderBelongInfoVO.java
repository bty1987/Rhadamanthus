/**
 * @File Name		: OrderDesignPictureVO
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

import org.apache.struts2.json.annotations.JSON;

import com.google.gson.annotations.SerializedName;


public class OrderBelongInfoVO implements Serializable {

	private static final long serialVersionUID = -62258203481876631L;

	private Long autoId;
	
	@SerializedName("订单编号")
	private String orderId;
	
	@SerializedName("房屋面积")
	private Float houseArea;
	
	@SerializedName("客户")
	private String customer;
	
	@SerializedName("客户编号")
	private Integer customerId;
	
	@SerializedName("房屋类别")
	private String houseClass;
	
	@SerializedName("楼盘")
	private String village;
	
	@SerializedName("楼盘编号")
	private String villageId;
	
	@SerializedName("楼号")
	private String houseNumber;
	
	@SerializedName("归属类型")
	private String belongType;
	
	@SerializedName("归属人")
	private String belongUser;
	
	@SerializedName("归属人编号")
	private String belongUserId;
	
	@SerializedName("归属部门")
	private String belongDept;
	
	@SerializedName("归属部门编号")
	private String belongDeptId;
	
	@SerializedName("归属分区")
	private String belongRegion;
	
	@SerializedName("归属分区编号")
	private String belongRegionId;
	
	@SerializedName("归属比例")
	private Float belongRate;
	
	@SerializedName("申请人")
	private String operateUser;
	
	@SerializedName("申请人编号")
	private String operateUserId;
	
	@SerializedName("申请时间")
	private Timestamp operateTime;
	
	@SerializedName("审批状态")
	private String status;
	
	@SerializedName("修改原因")
	private String changeReason;
	
	@SerializedName("审批人编号")
	private String approvalUserId;
	
	@SerializedName("审批人")
	private String approvalUser;
	
	@SerializedName("审批时间")
	private Timestamp approvalTime;
	
	@SerializedName("默认归属标识")
	private String defaultFlag;
	
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

	public Float getHouseArea(){
		return houseArea;
	}

	public void setHouseArea(Float houseArea){
		this.houseArea = houseArea;
	}

	public String getCustomer(){
		return customer;
	}

	public void setCustomer(String customer){
		this.customer = customer;
	}

	public Integer getCustomerId(){
		return customerId;
	}

	public void setCustomerId(Integer customerId){
		this.customerId = customerId;
	}

	public String getHouseClass(){
		return houseClass;
	}

	public void setHouseClass(String houseClass){
		this.houseClass = houseClass;
	}

	public String getVillage(){
		return village;
	}

	public void setVillage(String village){
		this.village = village;
	}

	public String getVillageId(){
		return villageId;
	}

	public void setVillageId(String villageId){
		this.villageId = villageId;
	}

	public String getHouseNumber(){
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber){
		this.houseNumber = houseNumber;
	}

	public String getBelongType(){
		return belongType;
	}

	public void setBelongType(String belongType){
		this.belongType = belongType;
	}

	public String getBelongUser(){
		return belongUser;
	}

	public void setBelongUser(String belongUser){
		this.belongUser = belongUser;
	}

	public String getBelongUserId(){
		return belongUserId;
	}

	public void setBelongUserId(String belongUserId){
		this.belongUserId = belongUserId;
	}

	public String getBelongDept(){
		return belongDept;
	}

	public void setBelongDept(String belongDept){
		this.belongDept = belongDept;
	}

	public String getBelongDeptId(){
		return belongDeptId;
	}

	public void setBelongDeptId(String belongDeptId){
		this.belongDeptId = belongDeptId;
	}

	public String getBelongRegion(){
		return belongRegion;
	}

	public void setBelongRegion(String belongRegion){
		this.belongRegion = belongRegion;
	}

	public String getBelongRegionId(){
		return belongRegionId;
	}

	public void setBelongRegionId(String belongRegionId){
		this.belongRegionId = belongRegionId;
	}

	public Float getBelongRate(){
		return belongRate;
	}

	public void setBelongRate(Float belongRate){
		this.belongRate = belongRate;
	}

	public String getOperateUser(){
		return operateUser;
	}

	public void setOperateUser(String operateUser){
		this.operateUser = operateUser;
	}

	public String getOperateUserId(){
		return operateUserId;
	}

	public void setOperateUserId(String operateUserId){
		this.operateUserId = operateUserId;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getOperateTime(){
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime){
		this.operateTime = operateTime;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	public String getChangeReason(){
		return changeReason;
	}

	public void setChangeReason(String changeReason){
		this.changeReason = changeReason;
	}

	public String getApprovalUserId(){
		return approvalUserId;
	}

	public void setApprovalUserId(String approvalUserId){
		this.approvalUserId = approvalUserId;
	}

	public String getApprovalUser(){
		return approvalUser;
	}

	public void setApprovalUser(String approvalUser){
		this.approvalUser = approvalUser;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getApprovalTime(){
		return approvalTime;
	}

	public void setApprovalTime(Timestamp approvalTime){
		this.approvalTime = approvalTime;
	}

	public void setDefaultFlag(String defaultFlag){
		this.defaultFlag = defaultFlag;
	}

	public String getDefaultFlag(){
		return defaultFlag;
	}

}
