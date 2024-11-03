package com.fanglin.quotation.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationPreferVO;
import com.fanglin.quotation.vo.QuotationVO;

public interface QuotationPreferService {

	public QuotationPreferVO queryQuotationPrefer(QuotationPreferVO quotationPreferVO) throws FLException;

	public int updateQuotationPrefer(QuotationPreferVO quotationPreferVO, QuotationVO quotationVO) throws FLException;
}
