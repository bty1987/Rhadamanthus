/**
 * @File Name     : QuotationAssignRecordPO.java
 * @Package      : com.fanglin.quotation.po
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配记录表实体类
 */

package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.beans.BeanUtils;

import com.fanglin.quotation.vo.QuotationAssignRecordVO;

/**
 * 装修单预算分配记录表实体类
 *
 * <p>
 * 职责：追溯所有分配尝试（成功、失败、重新分配）
 * </p>
 *
 * <p>
 * 核心字段：
 * </p>
 * <ul>
 * <li>qasrid: 记录ID（主键）</li>
 * <li>orderId: 装修单号</li>
 * <li>uid: 预算员用户ID（成功时有值，失败时为NULL）</li>
		 * <li>assignType: 分配类型（1-正向自动，2-手动，3-反向自动，4-转交）</li>
 * <li>assignResult: 分配结果（0-失败，1-成功）</li>
 * <li>assignUid: 分配人用户ID（手动分配时有值）</li>
 * <li>assignTime: 分配时间</li>
 * <li>failReason: 失败原因</li>
 * </ul>
 *
 * @author Claude AI
 * @version 1.0
 */
@Entity
@Table(name = "quotationassignrecord", catalog = "quotation")
public class QuotationAssignRecordPO implements Serializable {

	private static final long serialVersionUID = 1L;

	// ==================== 常量定义 ====================

	/**
	 * 分配类型：正向自动（设计师发起）
	 */
	public static final Short ASSIGN_TYPE_FORWARD_AUTO_INT = 1;

	/**
	 * 分配类型：手动（预算经理手动派单）
	 */
	public static final Short ASSIGN_TYPE_MANUAL_INT = 2;

	/**
	 * 分配类型：反向自动（预算员完成后自动分配）
	 */
	public static final Short ASSIGN_TYPE_REVERSE_AUTO_INT = 3;

	/**
	 * 分配类型：转交（预算员转交给其他预算员）
	 */
	public static final Short ASSIGN_TYPE_TRANSFER_INT = 4;

	/**
	 * 分配结果：失败（无预算员/类型不匹配/其他原因）
	 */
	public static final Byte ASSIGN_RESULT_FAILED_INT = 0;

	/**
	 * 分配结果：成功
	 */
	public static final Byte ASSIGN_RESULT_SUCCESS_INT = 1;

	/**
	 * 失败原因：暂无可用预算员
	 */
	public static final String FAIL_REASON_NO_AVAILABLE_BUDGETER_STR = "暂无可用预算员";

	// ==================== 字段定义 ====================

	/**
	 * 分配记录ID（主键）
	 */
	private long qasrid;

	/**
	 * 装修单号
	 */
	private String orderId;

	/**
	 * 预算员用户ID（成功时有值，失败时为NULL）
	 */
	private Integer uid;

	/**
	 * 分配类型：1-正向自动（设计师发起），2-手动（预算经理手动派单），3-反向自动（预算员完成后自动分配），4-转交
	 */
	private short assignType;

	/**
	 * 分配结果：0-失败（无预算员/类型不匹配/其他原因），1-成功
	 */
	private byte assignResult;

	/**
	 * 分配人用户ID（手动分配时有值，自动分配时为NULL）
	 */
	private Integer assignUid;

	/**
	 * 分配时间（即记录创建时间）
	 */
	private Timestamp assignTime;

	/**
	 * 失败原因（assignResult=0时有值）
	 */
	private String failReason;

	/**
	 * 装修类型（用于追溯分析）
	 */
	private Short decorationType;

	// ==================== 构造函数 ====================

	/**
	 * 默认构造函数
	 */
	public QuotationAssignRecordPO() {
		super();
	}

	/**
	 * 带主键的构造函数
	 *
	 * @param qasrid 分配记录ID
	 */
	public QuotationAssignRecordPO(long qasrid) {
		super();
		this.qasrid = qasrid;
	}

	// ==================== Getter/Setter ====================

	/**
	 * 获取分配记录ID
	 *
	 * @return 分配记录ID
	 */
	@Id
	@GeneratedValue
	@Column(name = "qasrid", unique = true, nullable = false)
	public long getQasrid() {
		return qasrid;
	}

	/**
	 * 设置分配记录ID
	 *
	 * @param qasrid 分配记录ID
	 */
	public void setQasrid(long qasrid) {
		this.qasrid = qasrid;
	}

	/**
	 * 获取装修单号
	 *
	 * @return 装修单号
	 */
	@Column(name = "orderId", nullable = false, length = 15)
	public String getOrderId() {
		return orderId;
	}

	/**
	 * 设置装修单号
	 *
	 * @param orderId 装修单号
	 */
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	/**
	 * 获取预算员用户ID
	 *
	 * @return 预算员用户ID
	 */
	@Column(name = "uid")
	public Integer getUid() {
		return uid;
	}

	/**
	 * 设置预算员用户ID
	 *
	 * @param uid 预算员用户ID
	 */
	public void setUid(Integer uid) {
		this.uid = uid;
	}

	/**
	 * 获取分配类型
	 *
	 * @return 分配类型
	 */
	@Column(name = "assignType", nullable = false)
	public short getAssignType() {
		return assignType;
	}

	/**
	 * 设置分配类型
	 *
	 * @param assignType 分配类型
	 */
	public void setAssignType(short assignType) {
		this.assignType = assignType;
	}

	/**
	 * 获取分配结果
	 *
	 * @return 分配结果
	 */
	@Column(name = "assignResult", nullable = false)
	public byte getAssignResult() {
		return assignResult;
	}

	/**
	 * 设置分配结果
	 *
	 * @param assignResult 分配结果
	 */
	public void setAssignResult(byte assignResult) {
		this.assignResult = assignResult;
	}

	/**
	 * 获取分配人用户ID
	 *
	 * @return 分配人用户ID
	 */
	@Column(name = "assignUid")
	public Integer getAssignUid() {
		return assignUid;
	}

	/**
	 * 设置分配人用户ID
	 *
	 * @param assignUid 分配人用户ID
	 */
	public void setAssignUid(Integer assignUid) {
		this.assignUid = assignUid;
	}

	/**
	 * 获取分配时间
	 *
	 * @return 分配时间
	 */
	@Column(name = "assignTime", nullable = false)
	public Timestamp getAssignTime() {
		return assignTime;
	}

	/**
	 * 设置分配时间
	 *
	 * @param assignTime 分配时间
	 */
	public void setAssignTime(Timestamp assignTime) {
		this.assignTime = assignTime;
	}

	/**
	 * 获取失败原因
	 *
	 * @return 失败原因
	 */
	@Column(name = "failReason", length = 255)
	public String getFailReason() {
		return failReason;
	}

	/**
	 * 设置失败原因
	 *
	 * @param failReason 失败原因
	 */
	public void setFailReason(String failReason) {
		this.failReason = failReason;
	}

	/**
	 * 获取装修类型
	 *
	 * @return 装修类型
	 */
	@Column(name = "decorationType")
	public Short getDecorationType() {
		return decorationType;
	}

	/**
	 * 设置装修类型
	 *
	 * @param decorationType 装修类型
	 */
	public void setDecorationType(Short decorationType) {
		this.decorationType = decorationType;
	}

	// ==================== PO/VO 转换方法 ====================

	/**
	 * PO 转 VO
	 *
	 * @param vo VO对象
	 * @return 转换后的VO对象
	 */
	public QuotationAssignRecordVO ptv(QuotationAssignRecordVO vo) {
		BeanUtils.copyProperties(this, vo);
		return vo;
	}

	/**
	 * VO 转 PO
	 *
	 * @param vo VO对象
	 * @return 转换后的PO对象
	 */
	public QuotationAssignRecordPO vtp(QuotationAssignRecordVO vo) {
		BeanUtils.copyProperties(vo, this);
		return this;
	}
}
