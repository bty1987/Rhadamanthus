package com.fanglin.balance.vo;

import com.fanglin.quotation.vo.SelectionItemVO;

public class BalanceSelectionItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 6767029717412126427L;

	private Long bsiid;

	private Long bsid;

	private SelectionItemVO selectionItem;

	public BalanceSelectionItemVO() {
		super();
	}

	public BalanceSelectionItemVO(SelectionItemVO selectionItem) {
		super();
		this.selectionItem = selectionItem;
	}

	public Long getBsiid() {
		return bsiid;
	}

	public void setBsiid(Long bsiid) {
		this.bsiid = bsiid;
	}

	public Long getBsid() {
		return bsid;
	}

	public void setBsid(Long bsid) {
		this.bsid = bsid;
	}

	public SelectionItemVO getSelectionItem() {
		return selectionItem;
	}

	public void setSelectionItem(SelectionItemVO selectionItem) {
		this.selectionItem = selectionItem;
	}

}
