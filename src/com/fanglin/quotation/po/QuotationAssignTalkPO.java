/**
 * @File Name     : QuotationAssignTalkPO.java
 * @Package       : com.fanglin.quotation.po
 * @Version       : 1.0
 * @Date          : 2026-04-30
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 报价分配沟通消息实体类
 */

package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.beans.BeanUtils;

import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.QuotationAssignTalkVO;

/**
 * 报价分配沟通消息实体类
 *
 * <p>
 * 职责：记录设计师和预算员之间针对某个装修单分配请求的沟通消息
 * </p>
 *
 * <p>
 * 核心字段：
 * </p>
 * <ul>
 * <li>qatid: 消息ID（主键）</li>
 * <li>orderId: 装修单号（关联 decoration.orderId）</li>
 * <li>sender: 发送人</li>
 * <li>content: 消息内容</li>
 * <li>sendTime: 发送时间</li>
 * <li>type: 消息类型（1-设计师发给预算员，2-预算员发给设计师）</li>
 * </ul>
 *
 * @author Claude AI
 * @version 1.0
 */
@Entity
@Table(name = "quotationassigntalk", catalog = "quotation")
public class QuotationAssignTalkPO implements Serializable {

	private static final long serialVersionUID = 1L;

	// ==================== 常量定义 ====================

	/**
	 * 消息类型：设计师发给预算员
	 */
	public static final Short TYPE_DESIGNER_TO_BUDGETER_INT = 1;

	/**
	 * 消息类型：预算员发给设计师
	 */
	public static final Short TYPE_BUDGETER_TO_DESIGNER_INT = 2;

	// ==================== 字段定义 ====================

	/**
	 * 消息ID（主键）
	 */
	private long qatid;

	/**
	 * 装修单号（关联 decoration.orderId）
	 */
	private String orderId;

	/**
	 * 发送人
	 */
	private UserPO sender;

	/**
	 * 消息内容
	 */
	private String content;

	/**
	 * 发送时间
	 */
	private Timestamp sendTime;

	/**
	 * 消息类型：1-设计师发给预算员，2-预算员发给设计师
	 */
	private short type;

	/**
	 * 创建时间
	 */
	private Timestamp createTime;

	// ==================== 构造函数 ====================

	public QuotationAssignTalkPO() {
		super();
	}

	public QuotationAssignTalkPO(long qatid) {
		super();
		this.qatid = qatid;
	}

	// ==================== Getter/Setter ====================

	@Id
	@GeneratedValue
	@Column(name = "qatid", unique = true, nullable = false)
	public long getQatid() {
		return qatid;
	}

	public void setQatid(long qatid) {
		this.qatid = qatid;
	}

	@Column(name = "orderId", nullable = false, length = 15)
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "senderUid", referencedColumnName = "uid")
	public UserPO getSender() {
		return sender;
	}

	public void setSender(UserPO sender) {
		this.sender = sender;
	}

	@Column(name = "content", nullable = false, length = 2000)
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "sendTime", nullable = false)
	public Timestamp getSendTime() {
		return sendTime;
	}

	public void setSendTime(Timestamp sendTime) {
		this.sendTime = sendTime;
	}

	@Column(name = "type", nullable = false)
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "createTime", nullable = false)
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	// ==================== PO/VO 转换方法 ====================

	/**
	 * PO 转 VO
	 *
	 * @param vo VO对象
	 * @return 转换后的VO对象
	 */
	public QuotationAssignTalkVO ptv(QuotationAssignTalkVO vo) {
		BeanUtils.copyProperties(this, vo, "sender");

		if (vo.getSender() != null && getSender() != null) {
			vo.getSender().setBaseInfo(getSender());
		}

		return vo;
	}
}
