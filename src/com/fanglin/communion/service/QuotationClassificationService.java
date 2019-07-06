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

package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.QuotationClassificationVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface QuotationClassificationService {

	List<QuotationClassificationVO> queryQuotationClassification();

	public void pageQuotationClassification(Paging paging, List<Filter> filters);
}
