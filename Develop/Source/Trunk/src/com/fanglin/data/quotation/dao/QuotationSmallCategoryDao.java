/**
 * @File Name		: QuotationSmallCategoryDao.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationSmallCategoryPO;
import com.fanglin.utils.Paging;

public interface QuotationSmallCategoryDao extends Dao<QuotationSmallCategoryPO>{

	public List<QuotationSmallCategoryPO> pageQuotationSmallCategory(Paging paging, List<Filter> filters);
	
	public List<QuotationSmallCategoryPO> queryQuotationSmallCategory(Integer qtid);
	
}
