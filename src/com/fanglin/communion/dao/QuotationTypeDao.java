/**
 * @File Name		: QuotationTypeDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-7-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.QuotationTypePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface QuotationTypeDao extends Dao<QuotationTypePO> {
	
	public List<QuotationTypePO> pageQuotationType(Paging paging, List<Filter> filters);
	
}
