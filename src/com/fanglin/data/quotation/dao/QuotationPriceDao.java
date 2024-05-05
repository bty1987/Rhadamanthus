package com.fanglin.data.quotation.dao;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationPricePO;
import com.fanglin.utils.Paging;

public interface QuotationPriceDao extends Dao<QuotationPricePO> {

	public List<QuotationPricePO> pageQuotationPrice(Paging paging, List<Filter> filters, Long qiid, Short status);

	public List<QuotationPricePO> pageQuotationPrice(Paging paging, List<Filter> filters, String versionId, Timestamp updateTime);

	public List<QuotationPricePO> queryQuotationPrice(long faid, Timestamp updateTime);

}
