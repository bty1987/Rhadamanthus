package com.fanglin.sales.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.vo.OalesRecordVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

/**
 * 外销单操作记录表
 *
 * 记录外销单的所有操作历史，包括创建、修改、状态变更等
 *
 * @author AI Assistant
 * @date 2026-03-17
 */
@Entity
@Table(name = "oalesrecord", catalog = "sales")
public class OalesRecordPO implements Serializable {

	private static final long serialVersionUID = -1234567890123456789L;

	// ==================== 操作类型常量 ====================

	/** 新增 */
	public static final short TYPE_ADD = 1;

	/** 更新 */
	public static final short TYPE_UPDATE = 2;

	/** 提交 */
	public static final short TYPE_SUBMIT = 3;

	/** 取消 */
	public static final short TYPE_CANCEL = 4;

	/** 确认 */
	public static final short TYPE_CONFIRM = 5;

	/** 驳回 */
	public static final short TYPE_REJECT = 6;

	/** 复核 */
	public static final short TYPE_CHECK = 7;

	/** 完结 */
	public static final short TYPE_FINISH = 8;

	/** 废单 */
	public static final short TYPE_ABATE = 9;

	/** 退款 */
	public static final short TYPE_REFUND = 10;

	/** 删除 */
	public static final short TYPE_DELETE = 11;

	/** 活动 */
	public static final short TYPE_ACTIVITY = 12;

	/** 添加支付记录 */
	public static final short TYPE_ADD_PAY = 13;

	/** 更新支付记录 */
	public static final short TYPE_UPDATE_PAY = 14;

	/** 删除支付记录 */
	public static final short TYPE_DELETE_PAY = 15;

	// ==================== 字段定义 ====================

	/** 记录ID */
	private long orid;

	/** 外销单ID */
	private long oid;

	/** 外销单对象（多对一） */
	private OalesPO oales;

	/** 支付记录ID（可选，如果是支付相关操作） */
	private Long opid;

	/** 支付记录对象（多对一，可选） */
	private OalesPayPO oalesPay;

	/** 操作人ID */
	private long ouid;

	/** 操作人对象（多对一） */
	private UserPO operate;

	/** 操作时间 */
	private Timestamp operateTime;

	/** 操作类型 */
	private short type;

	/** 备注说明 */
	private String comment;

	/** 操作前的状态（可选） */
	private Short beforeStatus;

	/** 操作后的状态（可选） */
	private Short afterStatus;

	/** IP地址（可选） */
	private String ip;

	// ==================== 构造方法 ====================

	public OalesRecordPO() {
		super();
	}

	// ==================== JPA 注解 ====================

	@Id
	@GeneratedValue
	@Column(name = "orid")
	public long getOrid() {
		return orid;
	}

	public void setOrid(long orid) {
		this.orid = orid;
	}

	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "oid", insertable = false, updatable = false)
	public OalesPO getOales() {
		return oales;
	}

	public void setOales(OalesPO oales) {
		this.oales = oales;
	}

	@Column(name = "opid")
	public Long getOpid() {
		return opid;
	}

	public void setOpid(Long opid) {
		this.opid = opid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "opid", insertable = false, updatable = false)
	public OalesPayPO getOalesPay() {
		return oalesPay;
	}

	public void setOalesPay(OalesPayPO oalesPay) {
		this.oalesPay = oalesPay;
	}

	@Column(name = "ouid")
	public long getOuid() {
		return ouid;
	}

	public void setOuid(long ouid) {
		this.ouid = ouid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid", insertable = false, updatable = false)
	public UserPO getOperate() {
		return operate;
	}

	public void setOperate(UserPO operate) {
		this.operate = operate;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "comment", length = 500)
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "beforeStatus")
	public Short getBeforeStatus() {
		return beforeStatus;
	}

	public void setBeforeStatus(Short beforeStatus) {
		this.beforeStatus = beforeStatus;
	}

	@Column(name = "afterStatus")
	public Short getAfterStatus() {
		return afterStatus;
	}

	public void setAfterStatus(Short afterStatus) {
		this.afterStatus = afterStatus;
	}

	@Column(name = "ip", length = 50)
	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	// ==================== 业务方法 ====================

	/**
	 * 初始化记录对象
	 *
	 * @param oid 外销单ID
	 * @param type 操作类型
	 * @param operater 操作人
	 * @param comment 备注说明
	 * @return 当前对象
	 */
	public OalesRecordPO init(long oid, short type, UserPO operater, String comment) {
		setOid(oid);
		setType(type);
		setOperate(operater);
		setOuid(operater.getUid());
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setComment(comment);
		return this;
	}

	/**
	 * 初始化记录对象（带状态变更）
	 *
	 * @param oid 外销单ID
	 * @param type 操作类型
	 * @param operater 操作人
	 * @param comment 备注说明
	 * @param beforeStatus 操作前状态
	 * @param afterStatus 操作后状态
	 * @return 当前对象
	 */
	public OalesRecordPO init(long oid, short type, UserPO operater, String comment, Short beforeStatus, Short afterStatus) {
		setOid(oid);
		setType(type);
		setOperate(operater);
		setOuid(operater.getUid());
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setComment(comment);
		setBeforeStatus(beforeStatus);
		setAfterStatus(afterStatus);
		return this;
	}

	/**
	 * 初始化记录对象（支付相关）
	 *
	 * @param oid 外销单ID
	 * @param opid 支付记录ID
	 * @param type 操作类型
	 * @param operater 操作人
	 * @param comment 备注说明
	 * @return 当前对象
	 */
	public OalesRecordPO init(long oid, Long opid, short type, UserPO operater, String comment) {
		setOid(oid);
		setOpid(opid);
		setType(type);
		setOperate(operater);
		setOuid(operater.getUid());
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		setComment(comment);
		return this;
	}

	/**
	 * PO 转 VO
	 *
	 * @param oalesRecordVO VO对象
	 * @return VO对象
	 */
	public OalesRecordVO ptv(OalesRecordVO oalesRecordVO) {
		BeanUtil.copyProperties(this, oalesRecordVO, Arrays.asList("oales", "oalesPay", "operate"));

		if (oalesRecordVO.getOales() != null && getOales() != null) {
			// 简单复制oales的基本信息
			BeanUtil.copyProperties(getOales(), oalesRecordVO.getOales(), Arrays.asList("decoration", "channer", "dept", "region", "house", "customer", "supplier", "creater", "servicer", "checker", "materialer", "accounter"));
		}

		if (oalesRecordVO.getOalesPay() != null && getOalesPay() != null) {
			BeanUtil.copyProperties(getOalesPay(), oalesRecordVO.getOalesPay(), Arrays.asList("oales", "creater"));
		}

		if (oalesRecordVO.getOperate() != null && getOperate() != null) {
			BeanUtil.copyProperties(getOperate(), oalesRecordVO.getOperate(), Arrays.asList("duty", "dept", "role"));
		}

		return oalesRecordVO;
	}

	/**
	 * PO 转 VO
	 *
	 * @param oalesRecordVO VO对象
	 * @return VO对象
	 */
	public OalesRecordVO ptv(OalesRecordVO oalesRecordVO) {
		BeanUtil.copyProperties(this, oalesRecordVO, Arrays.asList("oales", "oalesPay", "operate"));

		if (oalesRecordVO.getOales() != null && getOales() != null) {
			// 简单复制oales的基本信息
			BeanUtil.copyProperties(getOales(), oalesRecordVO.getOales(), Arrays.asList("decoration", "channer", "dept", "region", "house", "customer", "supplier", "creater", "servicer", "checker", "materialer", "accounter"));
		}

		if (oalesRecordVO.getOalesPay() != null && getOalesPay() != null) {
			BeanUtil.copyProperties(getOalesPay(), oalesRecordVO.getOalesPay(), Arrays.asList("oales", "creater"));
		}

		if (oalesRecordVO.getOperate() != null && getOperate() != null) {
			BeanUtil.copyProperties(getOperate(), oalesRecordVO.getOperate(), Arrays.asList("duty", "dept", "role"));
		}

		return oalesRecordVO;
	}
}
