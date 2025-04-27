package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.QuotationLabelVO;
import com.fanglin.utils.Paging;

public interface QuotationLabelService {

	public void pageQuotationLabel(Paging paging, List<Filter> filters);

	public int addQuotationLabel(QuotationLabelVO quotationLabelVO) throws FLException;

	public int updateQuotationLabel(QuotationLabelVO quotationLabelVO) throws FLException;

	public int deleteQuotationLabel(QuotationLabelVO quotationLabelVO) throws FLException;

}
