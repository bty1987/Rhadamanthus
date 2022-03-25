package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationNormoodItemVO;
import com.fanglin.quotation.vo.QuotationVO;

public interface QuotationNormoodItemService {
	
	public List<QuotationNormoodItemVO> queryQuotationNormoodItem(QuotationNormoodItemVO quotationNormoodItem);
	
	public List<QuotationNormoodItemVO> addQuotationNormoodItem(QuotationVO quotationVO, List<QuotationNormoodItemVO> quotationNormoodItemVOs) throws FLException;

	public int deleteQuotationNormoodItem(QuotationNormoodItemVO quotationNormoodItemVO) throws FLException;
}
