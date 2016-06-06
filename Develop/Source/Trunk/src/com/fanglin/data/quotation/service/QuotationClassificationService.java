/**
 * @File Name		: QuotationClassificationService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.data.quotation.vo.QuotationClassificationVO;

public interface QuotationClassificationService {
	
	List<QuotationClassificationVO> queryQuotationClassification();
	
}
