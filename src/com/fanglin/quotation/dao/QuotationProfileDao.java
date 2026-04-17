package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationProfilePO;
import com.fanglin.utils.Paging;

public interface QuotationProfileDao extends Dao<QuotationProfilePO> {

	public List<QuotationProfilePO> pageQuotationProfile(Paging paging, List<Filter> filters, int company);

	public List<QuotationProfilePO> queryQuotationProfileByQid(long qid, Short type);

	public List<QuotationProfilePO> queryQuotationProfileByOrderId(String orderId, Short type);

}
