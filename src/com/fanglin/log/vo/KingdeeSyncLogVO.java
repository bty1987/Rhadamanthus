/**
 * @File Name		: KingdeeSyncLogVO.java
 * @Package 		: com.fanglin.log.vo
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Describing		: 金蝶同步日志 VO（迁移自 KingdeeRecordVO）
 */

package com.fanglin.log.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class KingdeeSyncLogVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long kslId;
	private String orderId;
	private Long rtid;
	private Short atttype;
	private String type;
	private String message;
	private Timestamp createTime;
	private String operateUserId;
	private String traceId;
	private String ip;
	private Integer companyId;

	public Long getKslId(){
		return kslId;
	}

	public void setKslId(Long kslId){
		this.kslId = kslId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public Long getRtid(){
		return rtid;
	}

	public void setRtid(Long rtid){
		this.rtid = rtid;
	}

	public Short getAtttype(){
		return atttype;
	}

	public void setAtttype(Short atttype){
		this.atttype = atttype;
	}

	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	public String getMessage(){
		return message;
	}

	public void setMessage(String message){
		this.message = message;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public String getOperateUserId(){
		return operateUserId;
	}

	public void setOperateUserId(String operateUserId){
		this.operateUserId = operateUserId;
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

}
