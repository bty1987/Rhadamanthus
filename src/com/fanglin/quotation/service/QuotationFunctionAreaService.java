/**
 * @File Name		: QuotationFunctionAreaService.java
 * @Package   	: com.fanglin.quotation.service
 * @Version		: 1.0
 * @Date			: 2016-6-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;

public interface QuotationFunctionAreaService {

	public List<QuotationFunctionAreaVO> queryQuotationFunctionAreaByQuotationId(QuotationVO quotationVO) throws FLException;

	public List<QuotationFunctionAreaVO> queryQuotationFunctionAreaForCommonByQuotationId(QuotationVO quotationVO) throws FLException;

	public List<QuotationFunctionAreaVO> addQuotationFunctionAreaByFunctionAreaIds(List<Long> functionAreaIds, QuotationVO quotationVO) throws FLException;

	public int addQuotationFunctionArea(List<Long> functionAreaIds, QuotationVO quotationVO) throws FLException;

	public int updateQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionAreaVO, QuotationVO quotationVO) throws FLException;

	public int deleteQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionAreaVO, QuotationVO quotationVO) throws FLException;

}
