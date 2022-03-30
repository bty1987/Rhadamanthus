package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationNormriceItemVO;
import com.fanglin.quotation.vo.QuotationVO;

public interface QuotationNormriceItemService {

	public List<QuotationNormriceItemVO> queryQuotationNormrice(QuotationNormriceItemVO quotationNormriceItem);

	public List<QuotationNormriceItemVO> addQuotationNormriceItem(QuotationVO quotationVO, List<QuotationNormriceItemVO> quotationNormriceItemVOs) throws FLException;

	public int deleteQuotationNormriceItem(QuotationNormriceItemVO quotationNormriceItemVO) throws FLException;
}
