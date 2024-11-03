/**
 * Title: PaymentPO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.information.po.ActivityPO;
import com.fanglin.payment.vo.PaymentActivityVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "paymentActivity", catalog = "payment")
public class PaymentActivityPO implements Serializable {

	private static final long serialVersionUID = 2824538783794654738L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_ACTIVITY_STR = "activity.aid";

	public static final String COLUMN_CREATETIME_STR = "createTime";

	public static final short TYPE_ADVANCE_INT = 0; // 预付

	public static final short TYPE_DECORATION_INT = 1; // 装修

	public static final short TYPE_MATERIAL_INT = 2; // 主材

	public static final short TYPE_SALES_INT = 3; // 销售

	public static final short TYPE_SERVICE_INT = 4; // 服务

	private long paid;

	private String orderId;

	private short type;

	private long pid;

	private long rid;

	private ActivityPO activity;

	private int realMoney;

	private int multiple;

	private Timestamp createTime;

	private String comment;

	public PaymentActivityPO() {
		super();
	}

	public PaymentActivityPO(ActivityPO activity) {
		super();
		this.activity = activity;
	}

	public PaymentActivityPO(String orderId, short type, long pid, long rid, ActivityPO activity, int realMoney, int multiple) {
		super();
		this.orderId = orderId;
		this.type = type;
		this.pid = pid;
		this.rid = rid;
		this.activity = activity;
		this.realMoney = realMoney;
		this.multiple = multiple;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "paid")
	public long getPaid() {
		return paid;
	}

	public void setPaid(long paid) {
		this.paid = paid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "rid")
	public long getRid() {
		return rid;
	}

	public void setRid(long rid) {
		this.rid = rid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "aid", referencedColumnName = "aid")
	public ActivityPO getActivity() {
		return activity;
	}

	public void setActivity(ActivityPO activity) {
		this.activity = activity;
	}

	@Column(name = "realMoney")
	public int getRealMoney() {
		return realMoney;
	}

	public void setRealMoney(int realMoney) {
		this.realMoney = realMoney;
	}

	@Column(name = "multiple")
	public int getMultiple() {
		return multiple;
	}

	public void setMultiple(int multiple) {
		this.multiple = multiple;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public PaymentActivityVO ptv(PaymentActivityVO paymentActivityVO) {

		BeanUtil.copyProperties(this, paymentActivityVO, Arrays.asList("activity"));

		if (paymentActivityVO.getActivity() != null) {
			BeanUtil.copyProperties(getActivity(), paymentActivityVO.getActivity(), Arrays.asList("creater"));
			paymentActivityVO.getActivity().getCreater().ptv(getActivity().getCreater());
		}

		return paymentActivityVO;
	}
}
