package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationRefundItemVO;
import com.fanglin.quotation.vo.QuotationRefundVO;

public interface QuotationRefundItemService {

	public List<QuotationRefundItemVO> queryQuotationRefundItem(QuotationRefundItemVO quotationRefundItemVO) throws FLException;

	public QuotationRefundItemVO updateQuotationRefundItem(QuotationRefundItemVO quotationRefundItemVO, QuotationRefundVO quotationRefundVO) throws FLException;

	public int updateQuotationRefundItemForIndex(List<QuotationRefundItemVO> quotationRefundItemVOs) throws FLException;

	public int deleteQuotationRefundItem(QuotationRefundItemVO quotationRefundItemVO, QuotationRefundVO quotationRefundVO) throws FLException;

}
