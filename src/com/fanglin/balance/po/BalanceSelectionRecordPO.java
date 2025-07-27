package com.fanglin.balance.po;

import static javax.persistence.GenerationType.IDENTITY;

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

import com.fanglin.balance.vo.BalanceSelectionRecordVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "balanceselectionrecord", catalog = "balance")
public class BalanceSelectionRecordPO implements java.io.Serializable {

	private static final long serialVersionUID = -7332197381283551018L;

	private long bsrid;

	private BalanceSelectionPO balanceSelection;

	private UserPO operater;

	private Timestamp operateTime;

	private short type;

	private String comment;

	public BalanceSelectionRecordPO() {
		super();
	}

	public BalanceSelectionRecordPO(BalanceSelectionPO balanceSelection, UserPO operater) {
		super();
		this.balanceSelection = balanceSelection;
		this.operater = operater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bsrid")
	public long getBsrid() {
		return bsrid;
	}

	public void setBsrid(long bsrid) {
		this.bsrid = bsrid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "bsid", referencedColumnName = "bsid")
	public BalanceSelectionPO getBalanceSelection() {
		return balanceSelection;
	}

	public void setBalanceSelection(BalanceSelectionPO balanceSelection) {
		this.balanceSelection = balanceSelection;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "ouid", referencedColumnName = "uid")
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

	public BalanceSelectionRecordPO init(BalanceSelectionPO balanceSelectionPO, UserPO operater, short type, String comment) {

		setBalanceSelection(balanceSelectionPO);
		setOperater(operater);

		setType(type);

		setComment(comment);

		return this;
	}

	public BalanceSelectionRecordVO ptv(BalanceSelectionRecordVO balanceSelectionRecordVO) {

		BeanUtil.copyPropertie(this, balanceSelectionRecordVO, Arrays.asList("balanceSelection", "operater"));

		if (balanceSelectionRecordVO.getBalanceSelection() != null && getBalanceSelection() != null) BeanUtil.copyProperties(getBalanceSelection(), balanceSelectionRecordVO.getBalanceSelection());

		if (balanceSelectionRecordVO.getOperater() != null && getOperater() != null) balanceSelectionRecordVO.getOperater().setBaseInfo(getOperater());

		return balanceSelectionRecordVO;
	}

}
