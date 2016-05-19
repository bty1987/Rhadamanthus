package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.CustomQuotationItemVO;
import com.fanglin.quotation.vo.QuotationDetailVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;

public interface QuotationDetailService {

	public List<QuotationFunctionAreaVO> queryQuotationFunctionAreaByIds(List<Long> functionAreaAutoIds);
	
	public List<QuotationFunctionAreaVO> queryQuotationFunctionAreaForCommonById(Long quotationId);
	
	public QuotationDetailVO queryQuotationDetailById(Long autoId) throws FLException;

	public QuotationDetailVO queryQuotationDetailForAllInfoById(Long autoId) throws FLException;
	
	public QuotationDetailVO queryQuotationDetailForDefaultByOrderId(String decorationOrderId) throws FLException;
	
	public int addQuotationFuctionArea(List<QuotationFunctionAreaVO> quotationFunctionAreaVOs, QuotationDetailVO quotationDetailVO) throws FLException;
	
	public List<QuotationFunctionAreaVO> addQuotationFuctionAreaByIds(List<Long> functionAreaAutoIds, QuotationDetailVO quotationDetailVO) throws FLException;
	
	public int addCustomQuotationItem(CustomQuotationItemVO customQuotationItemVO, QuotationDetailVO quotationDetailVO) throws FLException;
	
	public int saveQuotationDetail(QuotationDetailVO quotationDetail) throws FLException;
	
	public int updateQuotatoin(QuotationDetailVO quotationDetailVO) throws FLException;
	
	public int updateQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionAreaVO, QuotationDetailVO quotationDetailVO) throws FLException;
	
	public int updateQuotationFunctionAreaItem(QuotationFunctionAreaItemVO quotationFunctionAreaItemVO, QuotationDetailVO quotationDetailVO) throws FLException;
	
	public int updateCustomQuotationItem(CustomQuotationItemVO customQuotationItemVO, QuotationDetailVO quotationDetailVO) throws FLException;

	public int countQuotationDetail(QuotationDetailVO quotationDetail);

	public int ensurseQuotationDetail(QuotationDetailVO quotationDetail);

	public int deleteQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionAreaVO, QuotationDetailVO quotationDetailVO) throws FLException;
	
	public int deleteQuotationFunctionAreaItemByUuids(List<String> uuids, QuotationDetailVO quotationDetailVO) throws FLException;
	
	public int deleteCustomQuotationItemByIds(List<Long> autoIds, QuotationDetailVO quotationDetailVO);

}
