/**
 * @File Name		: QuotationRtemService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.vo.QuotationRtemVO;

public interface QuotationRtemService {

	public List<QuotationRtemVO> queryQuotationRtem(QuotationRtemVO quotationRtemVO) throws FLException;

	public int addQuotationRtem(QuotationRtemVO quotationRtemVO) throws FLException;

	public int deleteQuotationRtem(QuotationRtemVO quotationRtemVO) throws FLException;

}
