package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationRemeasurePO;
import com.fanglin.utils.Paging;

public interface QuotationRemeasureDao extends Dao<QuotationRemeasurePO> {

	public List<QuotationRemeasurePO> pageQuotationRemeasure(Paging paging, List<Filter> filters, Integer company);

	public List<QuotationRemeasurePO> queryQuotationRemeasureByOrderId(String orderId);

}
