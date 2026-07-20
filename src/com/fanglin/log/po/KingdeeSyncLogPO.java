/**
 * @File Name		: KingdeeSyncLogPO.java
 * @Package 		: com.fanglin.log.po
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Describing		: 金蝶同步日志（迁移自 platform.kingdeeRecord）
 *
 *  变更说明：
 *    - 原 KingdeeRecordPO 在 kingdee 模块，现迁移到 log 模块
 *    - 新增 operateUserId/traceId/ip/companyId 通用字段
 *    - 原表 platform.kingdeeRecord 保留不动
 *    - 注意：原 add 方法无人调用（僵尸功能），本次只迁移代码骨架
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
@Table(name = "kingdeeSyncLog", catalog = "log")
public class KingdeeSyncLogPO implements Serializable {

	private static final long serialVersionUID = -8903497496550527323L;

	public static final String COLUMN_KSLID_STR = "kslId";

	private long kslId;

	private String orderId;

	private long rtid;

	private short atttype;

	private String type;

	private String message;

	private Timestamp createTime;

	// ===== 通用字段（新增）=====
	private String operateUserId;
	private String traceId;
	private String ip;
	private Integer companyId;

	public KingdeeSyncLogPO(){
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "kslId")
	public long getKslId(){
		return kslId;
	}

	public void setKslId(long kslId){
		this.kslId = kslId;
	}

	@Column(name = "orderId")
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name = "rtid")
	public long getRtid(){
		return rtid;
	}

	public void setRtid(long rtid){
		this.rtid = rtid;
	}

	@Column(name = "atttype")
	public short getAtttype(){
		return atttype;
	}

	public void setAtttype(short atttype){
		this.atttype = atttype;
	}

	@Column(name = "type")
	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	@Column(name = "message")
	public String getMessage(){
		return message;
	}

	public void setMessage(String message){
		this.message = message;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	@Column(name = "operateUserId")
	public String getOperateUserId(){
		return operateUserId;
	}

	public void setOperateUserId(String operateUserId){
		this.operateUserId = operateUserId;
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
