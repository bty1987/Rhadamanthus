package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationRecordPO;
import com.fanglin.utils.Paging;

public interface QuotationRecordDao extends Dao<QuotationRecordPO>{

	public List<QuotationRecordPO> pageQuotationRecord(Paging paging, List<Filter> filters, Short type, Long qid);

}
