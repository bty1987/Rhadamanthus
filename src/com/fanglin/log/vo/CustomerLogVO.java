/**
 * @File Name		: CustomerLogVO.java
 * @Package 		: com.fanglin.log.vo
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Describing		: 客户电话查询日志 VO（迁移自 CustomerRecordVO）
 *
 *  说明：
 *    - operateUserName 由 Service 层手动 join UserPO 填充（PO 不存用户名）
 *    - customerName/customerPhone 同上，Service 层按 cid/cpid 查 communion 填充
 */

package com.fanglin.log.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class CustomerLogVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long cplId;
	private Long cid;
	private Long cpid;
	private Short type;
	private String operateUserId;
	private Timestamp operateTime;
	private String comment;
	private String traceId;
	private String ip;
	private Integer companyId;

	// ===== Service 层 join 填充字段（不映射 DB 列）=====
	private String operateUserName;
	private String customerName;
	private String customerPhone;

	public Long getCplId(){
		return cplId;
	}

	public void setCplId(Long cplId){
		this.cplId = cplId;
	}

	public Long getCid(){
		return cid;
	}

	public void setCid(Long cid){
		this.cid = cid;
	}

	public Long getCpid(){
		return cpid;
	}

	public void setCpid(Long cpid){
		this.cpid = cpid;
	}

	public Short getType(){
		return type;
	}

	public void setType(Short type){
		this.type = type;
	}

	public String getOperateUserId(){
		return operateUserId;
	}

	public void setOperateUserId(String operateUserId){
		this.operateUserId = operateUserId;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime(){
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime){
		this.operateTime = operateTime;
	}

	public String getComment(){
		return comment;
	}

	public void setComment(String comment){
		this.comment = comment;
	}

	public String getTraceId(){
		return traceId;
	}

	public void setTraceId(String traceId){
		this.traceId = traceId;
	}

	public String getIp(){
		return ip;
	}

	public void setIp(String ip){
		this.ip = ip;
	}

	public Integer getCompanyId(){
		return companyId;
	}

	public void setCompanyId(Integer companyId){
		this.companyId = companyId;
	}

	public String getOperateUserName(){
		return operateUserName;
	}

	public void setOperateUserName(String operateUserName){
		this.operateUserName = operateUserName;
	}

	public String getCustomerName(){
		return customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	public String getCustomerPhone(){
		return customerPhone;
	}

	public void setCustomerPhone(String customerPhone){
		this.customerPhone = customerPhone;
	}

}
