/**
 * @File Name		: CustomerLogPO.java
 * @Package 		: com.fanglin.log.po
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Describing		: 客户电话查询日志（迁移自 communion.customerrecord）
 *
 *  变更说明：
 *    - 原 CustomerRecordPO 在 communion 模块，现迁移到 log 模块
 *    - operater 从 @ManyToOne UserPO 改为裸 operateUserId String（避免跨 catalog 外键）
 *    - 新增 traceId/ip/companyId 通用字段，与 actionLog 对齐
 *    - 原表 communion.customerrecord 保留不动，新写入走本表
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
@Table(name = "customerLog", catalog = "log")
public class CustomerLogPO implements Serializable {

	private static final long serialVersionUID = 3256551141185259683L;

	/** 操作类型：查询（与原 CustomerRecordPO.TYPE_QUERY_INT 对齐） */
	public static final short TYPE_QUERY_INT = 0;

	private long cplId;

	private long cid;

	private long cpid;

	private short type;

	private String operateUserId;

	private Timestamp operateTime;

	private String comment;

	// ===== 通用字段（log 模块统一）=====
	private String traceId;
	private String ip;
	private Integer companyId;

	public CustomerLogPO(){
		super();
	}

	public CustomerLogPO(long cid, long cpid, short type, String operateUserId, Timestamp operateTime){
		super();
		this.cid = cid;
		this.cpid = cpid;
		this.type = type;
		this.operateUserId = operateUserId;
		this.operateTime = operateTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cplId")
	public long getCplId(){
		return cplId;
	}

	public void setCplId(long cplId){
		this.cplId = cplId;
	}

	@Column(name = "cid")
	public long getCid(){
		return cid;
	}

	public void setCid(long cid){
		this.cid = cid;
	}

	@Column(name = "cpid")
	public long getCpid(){
		return cpid;
	}

	public void setCpid(long cpid){
		this.cpid = cpid;
	}

	@Column(name = "type")
	public short getType(){
		return type;
	}

	public void setType(short type){
		this.type = type;
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

	@Column(name = "comment")
	public String getComment(){
		return comment;
	}

	public void setComment(String comment){
		this.comment = comment;
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
