package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationNormriceItemVO;

public interface QuotationNormriceItemService {

	public List<QuotationNormriceItemVO> queryQuotationNormrice(QuotationNormriceItemVO quotationNormriceItem);

	public int deleteQuotationNormriceItem(QuotationNormriceItemVO quotationNormriceItemVO) throws FLException;
}
