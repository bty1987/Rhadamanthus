/**
 * @File Name		: DecorationPictureLogVO.java
 * @Package 		: com.fanglin.log.vo
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Describing		: 图纸下载日志 VO
 */

package com.fanglin.log.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class DecorationPictureLogVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long dplId;
	private Long dpId;
	private String orderId;
	private String operateUserId;
	private Timestamp operateTime;
	private String traceId;
	private String ip;
	private Integer companyId;

	// ===== Service 层 join 填充字段 =====
	private String operateUserName;
	private String pictureName;

	public Long getDplId(){
		return dplId;
	}

	public void setDplId(Long dplId){
		this.dplId = dplId;
	}

	public Long getDpId(){
		return dpId;
	}

	public void setDpId(Long dpId){
		this.dpId = dpId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
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

	public String getPictureName(){
		return pictureName;
	}

	public void setPictureName(String pictureName){
		this.pictureName = pictureName;
	}

}
