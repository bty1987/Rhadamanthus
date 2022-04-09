package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationNormriceItemVO;
import com.fanglin.quotation.vo.QuotationVO;

public interface QuotationNormriceItemService {

	public List<QuotationNormriceItemVO> queryQuotationNormrice(QuotationNormriceItemVO quotationNormriceItem);

	public int addQuotationNormriceItem(QuotationVO quotationVO, QuotationNormriceItemVO quotationNormriceItemVO) throws FLException;

	public int deleteQuotationNormriceItem(QuotationNormriceItemVO quotationNormriceItemVO) throws FLException;
}
