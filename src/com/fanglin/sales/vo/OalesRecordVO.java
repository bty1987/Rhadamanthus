package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

/**
 * 外销单操作记录VO
 *
 * @author AI Assistant
 * @date 2026-03-17
 */
public class OalesRecordVO implements Serializable {

	private static final long serialVersionUID = -1234567890123456789L;

	/** 记录ID */
	private Long orid;

	/** 外销单ID */
	private Long oid;

	/** 外销单对象 */
	private OalesVO oales;

	/** 支付记录ID（可选） */
	private Long opid;

	/** 支付记录对象（可选） */
	private OalesPayVO oalesPay;

	/** 操作人ID */
	private Long ouid;

	/** 操作人对象 */
	private UserBaseVO operate;

	/** 操作时间 */
	private Timestamp operateTime;

	/** 操作类型 */
	private Short type;

	/** 备注说明 */
	private String comment;

	/** 操作前的状态 */
	private Short beforeStatus;

	/** 操作后的状态 */
	private Short afterStatus;

	/** IP地址 */
	private String ip;

	public OalesRecordVO() {
		super();
	}

	public OalesRecordVO(OalesVO oales, OalesPayVO oalesPay, UserBaseVO operate) {
		super();
		this.oales = oales;
		this.oalesPay = oalesPay;
		this.operate = operate;
	}

	public Long getOrid() {
		return orid;
	}

	public void setOrid(Long orid) {
		this.orid = orid;
	}

	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
	}

	public OalesVO getOales() {
		return oales;
	}

	public void setOales(OalesVO oales) {
		this.oales = oales;
	}

	public Long getOpid() {
		return opid;
	}

	public void setOpid(Long opid) {
		this.opid = opid;
	}

	public OalesPayVO getOalesPay() {
		return oalesPay;
	}

	public void setOalesPay(OalesPayVO oalesPay) {
		this.oalesPay = oalesPay;
	}

	public Long getOuid() {
		return ouid;
	}

	public void setOuid(Long ouid) {
		this.ouid = ouid;
	}

	public UserBaseVO getOperate() {
		return operate;
	}

	public void setOperate(UserBaseVO operate) {
		this.operate = operate;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Short getBeforeStatus() {
		return beforeStatus;
	}

	public void setBeforeStatus(Short beforeStatus) {
		this.beforeStatus = beforeStatus;
	}

	public Short getAfterStatus() {
		return afterStatus;
	}

	public void setAfterStatus(Short afterStatus) {
		this.afterStatus = afterStatus;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}
}
