/**
 * @File Name		: QuotationTypeService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-7-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.data.quotation.vo.QuotationTypeVO;


public interface QuotationTypeService {
	
	public List<QuotationTypeVO> queryQuotationType();
	
}
