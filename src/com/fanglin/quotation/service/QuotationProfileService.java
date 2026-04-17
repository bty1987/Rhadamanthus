package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationProfileVO;
import com.fanglin.utils.Paging;

public interface QuotationProfileService {

	public void pageQuotationProfile(Paging paging, List<Filter> filters, int company);

	public List<QuotationProfileVO> queryQuotationProfileByQid(QuotationProfileVO quotationProfileVO) throws FLException;

	public List<QuotationProfileVO> queryQuotationProfileByOrderId(QuotationProfileVO quotationProfileVO) throws FLException;

	public QuotationProfileVO queryQuotationProfileByQpid(QuotationProfileVO quotationProfileVO) throws FLException;

	public int addQuotationProfile(QuotationProfileVO quotationProfileVO, String userId, int company) throws FLException;

	public int makeQuotationProfile(QuotationProfileVO quotationProfileVO, String userId, int company) throws FLException;

	public void handleQuotationProfile(QuotationProfileVO quotationProfileVO) throws FLException;

}
