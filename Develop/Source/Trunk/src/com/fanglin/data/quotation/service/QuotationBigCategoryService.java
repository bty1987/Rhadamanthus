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

package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.QuotationBigCategoryVO;
import com.fanglin.utils.Paging;

public interface QuotationBigCategoryService {
	
	public List<QuotationBigCategoryVO> queryQuotationBigCategory();
	
	public void pageQuotationBigCategory(Paging paging, List<Filter> filters);

}
