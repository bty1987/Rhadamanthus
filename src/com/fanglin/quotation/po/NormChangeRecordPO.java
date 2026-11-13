package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.quotation.vo.NormChangeRecordVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

/**
 * 工费/材料验证相关变更记录(定额变更记录): 影响工费/材料验证逻辑的 7 类变更统一留痕,
 * 支持按装修单/报价单/操作人/时间追查(方案=docs/01-方案设计/工费材料验证变更记录体系设计.md)
 */
@Entity
@Table(name = "normchanerecord", catalog = "quotation")
public class NormChangeRecordPO implements Serializable {

	private static final long serialVersionUID = 1L;

	/** 变更类型: 1增减项制作 2增减项删除 3定材浮动额 4节点工费浮动 5下定材增删 6定额单开关 7辅材绑定额 8报价项定额关联 */
	public static final short TYPE_ADDREDUCE_MAKE_INT = 1;

	public static final short TYPE_ADDREDUCE_DELETE_INT = 2;

	public static final short TYPE_NOODS_SURPLUS_INT = 3;

	public static final short TYPE_SCHEDULE_NORM_INT = 4;

	public static final short TYPE_NORMOODITEM_INT = 5;

	public static final short TYPE_NORMTION_STATUS_INT = 6;

	public static final short TYPE_AOODS_NORM_INT = 7;

	public static final short TYPE_QUOTATIONITEM_QFID_INT = 8;

	/** 动作: 1添加 2修改 3删除 4绑定 5解绑 6启用 7禁用 */
	public static final short CHANGETYPE_ADD_INT = 1;

	public static final short CHANGETYPE_UPDATE_INT = 2;

	public static final short CHANGETYPE_DELETE_INT = 3;

	public static final short CHANGETYPE_BIND_INT = 4;

	public static final short CHANGETYPE_UNBIND_INT = 5;

	public static final short CHANGETYPE_ENABLE_INT = 6;

	public static final short CHANGETYPE_DISABLE_INT = 7;

	private long ncrId;

	private short type;

	private short changeType;

	private String orderId;

	private Long qid;

	private Long refId;

	private String refNo;

	private String beforeValue;

	private String afterValue;

	private String comment;

	private String operater;

	private Timestamp operateTime;

	public NormChangeRecordPO() {
		super();
	}

	/** 基础工厂: 类型+动作+操作人, 其余字段链式补充 */
	public NormChangeRecordPO init(short type, short changeType, String userId) {
		this.type = type;
		this.changeType = changeType;
		this.operater = userId;
		this.operateTime = DateUtil.getDateToTimestamp(new Date());
		return this;
	}

	@Id
	@GeneratedValue
	@Column(name = "ncrId")
	public long getNcrId() {
		return ncrId;
	}

	public void setNcrId(long ncrId) {
		this.ncrId = ncrId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "changeType")
	public short getChangeType() {
		return changeType;
	}

	public void setChangeType(short changeType) {
		this.changeType = changeType;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public NormChangeRecordPO orderId(String orderId) {
		setOrderId(orderId);
		return this;
	}

	@Column(name = "qid")
	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public NormChangeRecordPO qid(Long qid) {
		setQid(qid);
		return this;
	}

	@Column(name = "refId")
	public Long getRefId() {
		return refId;
	}

	public void setRefId(Long refId) {
		this.refId = refId;
	}

	public NormChangeRecordPO refId(Long refId) {
		setRefId(refId);
		return this;
	}

	@Column(name = "refNo")
	public String getRefNo() {
		return refNo;
	}

	public void setRefNo(String refNo) {
		this.refNo = refNo;
	}

	public NormChangeRecordPO refNo(String refNo) {
		setRefNo(refNo);
		return this;
	}

	@Column(name = "beforeValue")
	public String getBeforeValue() {
		return beforeValue;
	}

	public void setBeforeValue(String beforeValue) {
		this.beforeValue = beforeValue;
	}

	public NormChangeRecordPO before(String beforeValue) {
		setBeforeValue(beforeValue);
		return this;
	}

	@Column(name = "afterValue")
	public String getAfterValue() {
		return afterValue;
	}

	public void setAfterValue(String afterValue) {
		this.afterValue = afterValue;
	}

	public NormChangeRecordPO after(String afterValue) {
		setAfterValue(afterValue);
		return this;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public NormChangeRecordPO comment(String comment) {
		setComment(comment);
		return this;
	}

	@Column(name = "operater")
	public String getOperater() {
		return operater;
	}

	public void setOperater(String operater) {
		this.operater = operater;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public NormChangeRecordVO ptv(NormChangeRecordVO normChangeRecordVO) {

		BeanUtil.copyProperties(this, normChangeRecordVO, Arrays.asList("ncrId", "type", "changeType", "orderId", "qid", "refId", "refNo", "beforeValue", "afterValue", "comment", "operater", "operateTime"));

		return normChangeRecordVO;
	}

}
