package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationRefundPO;
import com.fanglin.utils.Paging;

public interface QuotationRefundDao extends Dao<QuotationRefundPO> {

	public List<QuotationRefundPO> pageQuotationRefund(Paging paging, List<Filter> filters, Integer company);

	public QuotationRefundPO queryQuotationRefundByQid(long qid);

}
