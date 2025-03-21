package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationRemeasureItemPO;

public interface QuotationRemeasureItemDao extends Dao<QuotationRemeasureItemPO> {

	public List<QuotationRemeasureItemPO> queryQuotationRemeasureItem(long qrid);

	public List<QuotationRemeasureItemPO> queryQuotationRemeasureItem(long qrid, short type);

}
