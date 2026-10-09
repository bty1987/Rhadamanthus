package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationFormatPO;
import com.fanglin.utils.Paging;

public interface QuotationFormatDao extends Dao<QuotationFormatPO> {

	public List<QuotationFormatPO> queryQuotationFormat(Paging paging, String pinyin);

	public List<QuotationFormatPO> queryQuotationFormatByQcid(Long qcid, List<Filter> filters);

}
