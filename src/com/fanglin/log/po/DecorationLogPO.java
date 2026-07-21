/**
 * @File Name		: DecorationLogPO.java
 * @Package 		: com.fanglin.log.po
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Describing		: 图纸下载日志（迁移自 decoration.decorationpicturerecord）
 *
 *  变更说明：
 *    - 原 DecorationPictureRecordPO 在 decoration 模块，现迁移到 log 模块
 *    - ouid（数字UID）改为 operateUserId String
 *    - 新增 orderId 字段（便于按订单查询图纸下载记录）
 *    - 新增 traceId/ip/companyId 通用字段
 *    - 原表 decoration.decorationpicturerecord 保留不动
 */

package com.fanglin.log.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationLog", catalog = "log")
public class DecorationLogPO implements Serializable {

	private static final long serialVersionUID = -6002560128126657762L;

	private long dplId;

	private long dpId;

	private String orderId;

	private String operateUserId;

	private Timestamp operateTime;

	// ===== 通用字段 =====
	private String traceId;
	private String ip;
	private Integer companyId;

	public DecorationLogPO(){
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dplId")
	public long getDplId(){
		return dplId;
	}

	public void setDplId(long dplId){
		this.dplId = dplId;
	}

	@Column(name = "dpId")
	public long getDpId(){
		return dpId;
	}

	public void setDpId(long dpId){
		this.dpId = dpId;
	}

	@Column(name = "orderId")
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name = "operateUserId")
	public String getOperateUserId(){
		return operateUserId;
	}

	public void setOperateUserId(String operateUserId){
		this.operateUserId = operateUserId;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime(){
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime){
		this.operateTime = operateTime;
	}

	@Column(name = "traceId")
	public String getTraceId(){
		return traceId;
	}

	public void setTraceId(String traceId){
		this.traceId = traceId;
	}

	@Column(name = "ip")
	public String getIp(){
		return ip;
	}

	public void setIp(String ip){
		this.ip = ip;
	}

	@Column(name = "companyId")
	public Integer getCompanyId(){
		return companyId;
	}

	public void setCompanyId(Integer companyId){
		this.companyId = companyId;
	}

}
