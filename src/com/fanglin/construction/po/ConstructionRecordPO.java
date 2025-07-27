/**
 * @File Name	: Rework.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2014-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.po;

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

import com.fanglin.construction.vo.ConstructionRecordVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "constructionrecord", catalog = "construction")
public class ConstructionRecordPO implements Serializable {

	private static final long serialVersionUID = -420481503968375196L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final short TYPE_COMMON_INT = 0;

	private long crid;

	private String orderId;

	private long cid;

	private UserPO operater;

	private Timestamp operateTime;

	private short type;

	private String comment;

	public ConstructionRecordPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "crid")
	public long getCrid() {
		return crid;
	}

	public void setCrid(long crid) {
		this.crid = crid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public ConstructionRecordPO init(String orderId, long cid, UserPO operater, short type, String comment) {

		setOrderId(orderId);
		setCid(cid);

		setType(type);

		setOperater(operater);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		setComment(comment);

		return this;
	}

	public ConstructionRecordVO ptv(ConstructionRecordVO constructionRecordVO) {

		BeanUtil.copyProperties(this, constructionRecordVO, Arrays.asList("operater"));

		if (constructionRecordVO.getOperater() != null && getOperater() != null) constructionRecordVO.getOperater().setBaseInfo(getOperater());

		return constructionRecordVO;
	}
}
