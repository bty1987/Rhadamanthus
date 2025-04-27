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
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.Paging;

public interface QuotationService {

	public void pageQuotation(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public QuotationVO queryQuotationByQid(QuotationVO quotationVO) throws FLException;

	public QuotationVO queryQuotationForDefaultByOrderId(QuotationVO quotationVO) throws FLException;

	public List<QuotationVO> queryQuotationByOrderId(QuotationVO quotationVO) throws FLException;

	public Map<String, List<String>> queryQuotationForConfig(int company);

	public int addQuotation(QuotationVO quotationVO, String userId, int company) throws FLException;

	public int updateQuotation(QuotationVO quotationVO) throws FLException;

	public int changeQuotationForDefault(QuotationVO quotationVO) throws FLException;

	public int updateQuotationForAdvance(QuotationVO quotationVO) throws FLException;

	public int updateQuotationForPrice(QuotationVO quotationVO) throws FLException;

	public int updateQuotationForStatus(QuotationVO quotationVO, String userId) throws FLException;

	public int updateQuotationForTime(QuotationVO quotationVO) throws FLException;

	public int lockQuotation(QuotationVO quotationVO, String userId) throws FLException;

	public int unlockQuotation(QuotationVO quotationVO, String userId) throws FLException;

	public int auditQuotation(QuotationVO quotationVO, String userId) throws FLException;

	public int finishQuotation(QuotationVO quotationVO, String userId) throws FLException;

	public int replicaQuotation(QuotationVO quotationVO, String userId, int company) throws FLException;

	public int cloneQuotation(QuotationVO quotationVO, String no, String userId, int company) throws FLException;

	public int copyQuotation(QuotationVO quotationVO, String userId, int company) throws FLException;

	public int deleteQuotationById(QuotationVO quotationVO) throws FLException;

}
