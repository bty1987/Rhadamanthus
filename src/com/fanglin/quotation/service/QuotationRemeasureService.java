package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationRemeasureItemVO;
import com.fanglin.quotation.vo.QuotationRemeasureVO;
import com.fanglin.utils.Paging;

public interface QuotationRemeasureService {

	public void pageQuotationRemeasure(Paging paging, List<Filter> filters, QuotationRemeasureVO quotationRemeasure);

	public QuotationRemeasureVO queryQuotationRemeasure(QuotationRemeasureVO quotationRemeasureVO);

	public List<QuotationRemeasureItemVO> quotationRemeasureItem(QuotationRemeasureVO quotationRemeasureVO);

	public int makeQuotationRemeasure(QuotationRemeasureVO quotationRemeasureVO);

	public int updateQuotationRemesaureItem(QuotationRemeasureVO quotationRemeasureVO, QuotationRemeasureItemVO quotationRemeasureItemVO);

}
