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
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;

public interface QuotationFunctionAreaItemDao extends Dao<QuotationFunctionAreaItemPO> {

	public List<QuotationFunctionAreaItemPO> queryQuotationFunctionAreaItemByFunctionAreaId(long functionAreaId);
	
	public List<QuotationFunctionAreaItemPO> queryQuotationFunctionAreaItemByFunctionAreaIds(List<Long> functionAreaIds);
	
	public int updateQuotationFunctionAreaItemForNum(long qfaiId, float num);
	
	public int deleteQuotationFunctionAreaItemByFunctionAreaId(long functionAreaId);
	
	public int deleteQuotationFunctionAreaItemByFunctionAreaIds(List<Long> functionAreaIds);
	
	public int deleteQuotationFunctionAreaItemByUuids(List<String> uuids);
}
