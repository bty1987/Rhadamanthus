package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.vo.QuotationFormatVO;

public interface QuotationFormatService {

	public List<QuotationFormatVO> queryQuotationFormat(QuotationFormatVO quotationFormatVO);

	public List<QuotationFormatVO> queryQuotationFormatByQcid(Long qcid);

	public int addQuotationFormat(QuotationFormatVO quotationFormatVO) throws FLException;

	public int updateQuotationFormat(QuotationFormatVO quotationFormatVO) throws FLException;

	public int updateQuotationFormatForStatus(QuotationFormatVO quotationFormatVO) throws FLException;

	public int deleteQuotationFormat(QuotationFormatVO quotationFormatVO);

}
