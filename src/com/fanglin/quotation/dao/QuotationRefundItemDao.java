package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationRefundItemPO;

public interface QuotationRefundItemDao extends Dao<QuotationRefundItemPO> {

	public List<QuotationRefundItemPO> queryQuotationRefundItem(long qrid, long qfaId);

	public long updateQuotationRefundItemForIndex(long qriid, int index);

}
