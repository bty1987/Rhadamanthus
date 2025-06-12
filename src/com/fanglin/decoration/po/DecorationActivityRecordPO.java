package com.fanglin.decoration.po;

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

import com.fanglin.decoration.vo.DecorationActivityRecordVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "decorationactivityrecord", catalog = "decoration")
public class DecorationActivityRecordPO implements Serializable {

	private static final long serialVersionUID = 4370702027168204430L;

	private long darid;

	private long daid;

	private DecorationActivityItemPO decorationActivityItem;

	private UserPO operate;

	private Timestamp operateTime;

	private short type;

	private String comment;

	@Id
	@GeneratedValue
	@Column(name = "darid")
	public long getDarid() {
		return darid;
	}

	public void setDarid(long darid) {
		this.darid = darid;
	}

	@Column(name = "daid")
	public long getDaid() {
		return daid;
	}

	public void setDaid(long daid) {
		this.daid = daid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "daiid", referencedColumnName = "daiId")
	public DecorationActivityItemPO getDecorationActivityItem() {
		return decorationActivityItem;
	}

	public void setDecorationActivityItem(DecorationActivityItemPO decorationActivityItem) {
		this.decorationActivityItem = decorationActivityItem;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ouid", referencedColumnName = "uid")
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

	public DecorationActivityRecordPO init(long daid, DecorationActivityItemPO item, short type, UserPO operater, String comment) {

		setDaid(daid);

		setDecorationActivityItem(item);
		setOperate(operater);
		setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		setType(type);
		setComment(comment);

		return this;
	}

	public DecorationActivityRecordVO ptv(DecorationActivityRecordVO decorationActivityRecordVO) {

		BeanUtil.copyProperties(this, decorationActivityRecordVO, Arrays.asList("decorationActivityItem", "operate"));

		if (decorationActivityRecordVO.getDecorationActivityItem() != null) BeanUtil.copyProperties(getDecorationActivityItem(), decorationActivityRecordVO.getDecorationActivityItem(), Arrays.asList("creater", "receiver", "refunder"));
		if (decorationActivityRecordVO.getOperate() != null) BeanUtil.copyProperties(getOperate(), decorationActivityRecordVO.getOperate(), Arrays.asList("duty", "dept", "role"));

		return decorationActivityRecordVO;

	}
}
