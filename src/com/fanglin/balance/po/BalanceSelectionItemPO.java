package com.fanglin.balance.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.balance.vo.BalanceSelectionItemVO;
import com.fanglin.quotation.po.SelectionItemPD;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "balanceselectionitem", catalog = "balance")
public class BalanceSelectionItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -5151660660364198401L;

	public static final String COLUMN_BSBID_STR = "bsbid";

	public static final String COLUMN_BSID_STR = "bsid";

	private long bsiid;

	private long bsid;

	private SelectionItemPD selectionItem;

	public BalanceSelectionItemPO() {
		super();
	}

	public BalanceSelectionItemPO(SelectionItemPD selectionItem) {
		super();
		this.selectionItem = selectionItem;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bsiid")
	public long getBsiid() {
		return bsiid;
	}

	public void setBsiid(long bsiid) {
		this.bsiid = bsiid;
	}

	@Column(name = "bsid")
	public long getBsid() {
		return bsid;
	}

	public void setBsid(long bsid) {
		this.bsid = bsid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "siid", referencedColumnName = "siid")
	public SelectionItemPD getSelectionItem() {
		return selectionItem;
	}

	public void setSelectionItem(SelectionItemPD selectionItem) {
		this.selectionItem = selectionItem;
	}

	public BalanceSelectionItemVO ptv(BalanceSelectionItemVO balanceSelectionItemVO) {

		BeanUtil.copyProperties(this, balanceSelectionItemVO, Arrays.asList("selectionItem"));

		if (balanceSelectionItemVO.getSelectionItem() != null && getSelectionItem() != null) getSelectionItem().ptv(balanceSelectionItemVO.getSelectionItem());
		if (balanceSelectionItemVO.getSelectionItem() != null && balanceSelectionItemVO.getSelectionItem().getDecoration() != null && getSelectionItem() != null && getSelectionItem().getDecoration() != null) getSelectionItem().getDecoration().ptvcascade(balanceSelectionItemVO.getSelectionItem().getDecoration());

		return balanceSelectionItemVO;
	}

}
