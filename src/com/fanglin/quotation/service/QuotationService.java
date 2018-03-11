/**
 * @File Name		: QuotationService
 * @Package   	: com.fanglin.service.decorationOrder;
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.service;

import java.util.List;
import java.util.Map;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationVO;

public interface QuotationService {
	
	public QuotationVO queryQuotationById(long qId);

	public QuotationVO queryQuotationForDefaultByOrderId(QuotationVO quotationVO) throws FLException;
	
	public List<QuotationVO> queryQuotationByOrderId(QuotationVO quotationVO);
	
	public Map<String, List<String>> queryQuotationForConfig(int company);
	
	public int addQuotation(QuotationVO quotationVO, String userId) throws FLException;
	
	public int updateQuotation(QuotationVO quotationVO) throws FLException;
	
	public int changeQuotationForDefault(QuotationVO quotationVO) throws FLException;
	
	public int updateQuotationForAdvance(QuotationVO quotationVO) throws FLException;
	
	public int updateQuotationForStatus(QuotationVO quotationVO) throws FLException;
	
	public int replicaQuotation(QuotationVO quotationVO, String userId) throws FLException;
	
	public int copyQuotation(QuotationVO quotationVO, String userId) throws FLException;
	
	public int deleteQuotationById(QuotationVO quotationVO) throws FLException;
	
}
