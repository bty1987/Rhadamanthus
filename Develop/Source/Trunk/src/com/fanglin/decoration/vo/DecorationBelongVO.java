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


public class DecorationBelongVO implements Serializable {

	private static final long serialVersionUID = -62258203481876631L;

	private Long autoId;
	
	private String orderId;
	
	private String belongType;
	
	private String belongUser;
	
	private String belongUserId;
	
	private String belongDept;
	
	private String belongDeptId;
	
	private String belongRegion;
	
	private String belongRegionId;
	
	private Float belongRate;
	
	private String operateUser;
	
	private String operateUserId;
	
	private Timestamp operateTime;
	
	private String status;
	
	private String changeReason;
	
	private String approvalUserId;
	
	private String approvalUser;
	
	private Timestamp approvalTime;
	
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
