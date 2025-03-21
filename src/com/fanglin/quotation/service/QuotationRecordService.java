package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationRecordVO;
import com.fanglin.utils.Paging;

public interface QuotationRecordService {

	public void pageQuotationRecord(Paging paging, List<Filter> filters, QuotationRecordVO quotationRecord);

	public int addQuotationRecord(QuotationRecordVO quotationRecordVO);

}
