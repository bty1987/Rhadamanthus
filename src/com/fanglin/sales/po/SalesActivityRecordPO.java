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
import com.fanglin.sales.vo.SalesActivityRecordVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "salesactivityrecord", catalog = "sales")
public class SalesActivityRecordPO implements Serializable {

	private static final long serialVersionUID = -7705807872458688160L;

	private long sarid;

	private long said;

	private SalesActivityItemPO salesActivityItem;

	private UserPO operate;

	private Timestamp operateTime;

	private short type;

	private String comment;

	@Id
	@GeneratedValue
	@Column(name = "sarid")
	public long getSarid() {
		return sarid;
	}

	public void setSarid(long sarid) {
		this.sarid = sarid;
	}

	@Column(name = "said")
	public long getSaid() {
		return said;
	}

	public void setSaid(long said) {
		this.said = said;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "saiid", referencedColumnName = "saiid")
	public SalesActivityItemPO getSalesActivityItem() {
		return salesActivityItem;
	}

	public void setSalesActivityItem(SalesActivityItemPO salesActivityItem) {
		this.salesActivityItem = salesActivityItem;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public SalesActivityRecordPO init(long said, SalesActivityItemPO item, short type, UserPO operater, String comment) {

		setSaid(said);

		setSalesActivityItem(item);
		setOperate(operater);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		setType(type);
		setComment(comment);

		return this;
	}

	public SalesActivityRecordVO ptv(SalesActivityRecordVO salesActivityRecordVO) {

		BeanUtil.copyProperties(this, salesActivityRecordVO, Arrays.asList("salesActivityItem", "operate"));

		if (salesActivityRecordVO.getSalesActivityItem() != null) BeanUtil.copyProperties(getSalesActivityItem(), salesActivityRecordVO.getSalesActivityItem(), Arrays.asList("creater", "operater", "refunder"));
		if (salesActivityRecordVO.getOperate() != null) BeanUtil.copyProperties(getOperate(), salesActivityRecordVO.getOperate(), Arrays.asList("duty", "dept", "role"));

		return salesActivityRecordVO;

	}
}
