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
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.data.quotation.vo.NormriceVO;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.quotation.vo.ExtensionVO;
import com.fanglin.quotation.vo.NormtionVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.Paging;

public interface NormtionService {

	public void pageNormtion(Paging paging, List<Filter> filters, Integer company) throws FLException;

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

	public NormtionVO queryNormtion(NormtionVO normtionVO) throws FLException;

	public int makeNormtion(NormtionVO normtionVO, String userId) throws FLException;

	public int makeNormtion(NormtionVO normtionVO, Short schedule, String userId) throws FLException;

	public int makeNormtion(NormtionVO normtionVO, ExtensionVO extensionVO, Short schedule, String userId) throws FLException;

	public int makeNormtion(NormtionVO normtionVO, AddReduceVO addReduceVO, Short schedule, String userId) throws FLException;

	public int printNormtion(NormtionVO normtionVO) throws FLException;

	public int addNormtion(NormtionVO normtionVO, String userId) throws FLException;

	public int updateNormtionForStatus(NormtionVO normtionVO) throws FLException;

}
