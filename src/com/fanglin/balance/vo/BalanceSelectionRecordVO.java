package com.fanglin.balance.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class BalanceSelectionRecordVO implements java.io.Serializable {

	private static final long serialVersionUID = -7732227581203551118L;

	private Long bsrid;

	private BalanceSelectionVO balanceSelection;

	private UserVO operater;

	private Timestamp operateTime;

	private Short type;

	private String comment;

	public BalanceSelectionRecordVO() {
		super();
	}

	public BalanceSelectionRecordVO(UserVO operater) {
		super();
		this.operater = operater;
	}

	public BalanceSelectionRecordVO(BalanceSelectionVO balanceSelection, UserVO operater) {
		super();
		this.balanceSelection = balanceSelection;
		this.operater = operater;
	}

	public Long getBsrid() {
		return bsrid;
	}

	public void setBsrid(Long bsrid) {
		this.bsrid = bsrid;
	}

	public BalanceSelectionVO getBalanceSelection() {
		return balanceSelection;
	}

	public void setBalanceSelection(BalanceSelectionVO balanceSelection) {
		this.balanceSelection = balanceSelection;
	}

	public UserVO getOperater() {
		return operater;
	}

	public void setOperater(UserVO operater) {
		this.operater = operater;
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

}
