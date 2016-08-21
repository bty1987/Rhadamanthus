/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
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
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.department.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "orderbelonginfo", catalog = "platform")
public class DecorationBelongInfoPO implements Serializable {

	private static final long serialVersionUID = 11111344461146L;
	
	public static final String BELONGTYPE_DESIGN_STR = "设计";
	
	public static final String BELONGTYPE_SALESMAN_STR = "业务";
	
	public static final String STATUS_APPLY_STR = "申请审批";
	
	public static final String STATUS_PASS_STR = "审批通过";
	
	public static final String STATUS_UNPASS_STR = "审批未通过";
	
	public static final String STATUS_REPLACE_STR = "替换";
	
	public static final String DEFAULTFLAG_TRUE_STR = "是";
	
	public static final String DEFAULTFLAG_FALSE_STR = "否";

	private long autoId;
	
	private DecorationOrderPO decorationOrderPO;
	
	private String belongType;
	
	private UserPO belongUserPO;
	
	private DepartmentPO belongDeptPO;
	
	private DepartmentPO belongRegionPO;
	
	private Float belongRate = (float) 1;
	
	private UserPO operateUserPO;
	
	private Timestamp operateTime;
	
	private String status;
	
	private String changeReason;
	
	private UserPO approvalUserPO;
	
	private Timestamp approvalTime;
	
	private String defaultFlag;

	@Id
	@GeneratedValue
	@Column(name = "autoId")
	public long getAutoId(){
		return autoId;
	}

	public void setAutoId(long autoId){
		this.autoId = autoId;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationOrderPO getDecorationOrderPO(){
		return decorationOrderPO;
	}

	public void setDecorationOrderPO(DecorationOrderPO decorationOrderPO){
		this.decorationOrderPO = decorationOrderPO;
	}

	public String getBelongType(){
		return belongType;
	}

	public void setBelongType(String belongType){
		this.belongType = belongType;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "belongUserId", referencedColumnName = "userId")
	public UserPO getBelongUserPO(){
		return belongUserPO;
	}

	public void setBelongUserPO(UserPO belongUserPO){
		this.belongUserPO = belongUserPO;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "belongDeptId", referencedColumnName = "deptId")
	public DepartmentPO getBelongDeptPO(){
		return belongDeptPO;
	}

	public void setBelongDeptPO(DepartmentPO belongDeptPO){
		this.belongDeptPO = belongDeptPO;
	}

	public Float getBelongRate(){
		return belongRate;
	}

	public void setBelongRate(Float belongRate){
		this.belongRate = belongRate;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "operateUserId", referencedColumnName = "userId")
	public UserPO getOperateUserPO(){
		return operateUserPO;
	}

	public void setOperateUserPO(UserPO operateUserPO){
		this.operateUserPO = operateUserPO;
	}

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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "approvalUserId", referencedColumnName = "userId")
	public UserPO getApprovalUserPO(){
		return approvalUserPO;
	}

	public void setApprovalUserPO(UserPO approvalUserPO){
		this.approvalUserPO = approvalUserPO;
	}

	public Timestamp getApprovalTime(){
		return approvalTime;
	}

	public void setApprovalTime(Timestamp approvalTime){
		this.approvalTime = approvalTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn( name = "belongRegionId", referencedColumnName = "deptId")
	public DepartmentPO getBelongRegionPO(){
		return belongRegionPO;
	}

	public void setBelongRegionPO(DepartmentPO belongRegionPO){
		this.belongRegionPO = belongRegionPO;
	}

	public void setDefaultFlag(String defaultFlag){
		this.defaultFlag = defaultFlag;
	}

	public String getDefaultFlag(){
		return defaultFlag;
	}
	
}
