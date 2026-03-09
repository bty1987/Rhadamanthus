/**
 * @File Name		: QuotationNormtimeDao.java
 * @Package   	: com.fanglin.quotation.dao
 * @Version		: 1.0
 * @Date			: 2025-12-01
 * @Copyright	: Copyright Creators 2014
 * @Author		: AI Assistant
 * @Email			:
 * @Describing	: 定额工时查询 DAO
 */

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemMO;

public interface QuotationNormtimeDao extends Dao<QuotationFunctionAreaItemMO> {

	public List<?> queryQuotationFunctionAreaItem(short index, long functionAreaId, Short schedule);

	public List<?> queryExtensionItem(long eid, Short schedule);

	public List<?> queryAddReduceItem(long arid, Short schedule);

	public List<?> amountQuotationNormtime(short index, long functionAreaId);

	public List<?> amountExtensionNormtime(long eid);

	public List<?> amountAddReduceNormtime(long arid);

}
