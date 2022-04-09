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
import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.data.quotation.vo.NormriceVO;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.quotation.vo.ExtensionVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationNormVO;
import com.fanglin.quotation.vo.QuotationVO;

public interface QuotationNormService {

	public List<QuotationFunctionAreaVO> queryQuotationNormood(QuotationVO quotationVO) throws FLException;

	public List<ExtensionVO> queryExtensionNormood(ExtensionVO extensionVO) throws FLException;

	public List<AddReduceVO> queryAddReduceNormood(AddReduceVO addReduceVO) throws FLException;

	public List<QuotationFunctionAreaVO> queryQuotationNormrice(QuotationVO quotationVO, Short schedule) throws FLException;

	public List<ExtensionVO> queryExtensionNormrice(ExtensionVO extensionVO, Short schedule) throws FLException;

	public List<AddReduceVO> queryAddReduceNormrice(AddReduceVO addReduceVO, Short schedule) throws FLException;

	public List<NormoodVO> amountQuotationNormood(QuotationVO quotationVO) throws FLException;

	public List<NormoodVO> amountExtensionNormood(ExtensionVO extensionVO) throws FLException;

	public List<NormoodVO> amountAddReduceNormood(AddReduceVO addReduceVO) throws FLException;

	public List<NormriceVO> amountQuotationNormrice(QuotationVO quotationVO) throws FLException;

	public List<NormriceVO> amountExtensionNormrice(ExtensionVO extensionVO) throws FLException;

	public List<NormriceVO> amountAddReduceNormrice(AddReduceVO addReduceVO) throws FLException;

	public QuotationNormVO queryQuotationNorm(QuotationNormVO quotationNormVO) throws FLException;

	public int printQuotationNorm(QuotationNormVO quotaionNormVO) throws FLException;

	public int addQuotationNorm(QuotationNormVO quotaioNormVO) throws FLException;
}
