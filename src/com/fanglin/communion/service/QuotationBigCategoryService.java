/**
 * @File Name		: QuotationBigCategoryService.java
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

import com.fanglin.communion.vo.QuotationBigCategoryVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface QuotationBigCategoryService {
	
	public List<QuotationBigCategoryVO> queryQuotationBigCategory(QuotationBigCategoryVO quotationBigCategory);
	
	public void pageQuotationBigCategory(Paging paging, List<Filter> filters);

}
