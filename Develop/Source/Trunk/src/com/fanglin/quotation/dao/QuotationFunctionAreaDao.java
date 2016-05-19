/**
 * @File Name		: CustomQuotationItemDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 
 * @Describing	: 
 */
package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;

public interface QuotationFunctionAreaDao extends Dao<QuotationFunctionAreaPO> {
	
	public List<QuotationFunctionAreaPO> queryQuotationFunctionAreaByQuotationId(long quotationId);
	
	public int deleteQuotationFunctionAreaByIds(List<Long> ids);
	
}
