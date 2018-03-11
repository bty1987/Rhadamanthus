/**
 * @File Name		: QuotationClassificationDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.QuotationClassificationPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface QuotationClassificationDao extends Dao<QuotationClassificationPO> { 
	
	public List<QuotationClassificationPO> pageQuotationClassification(Paging paging, List<Filter> filters);
}
