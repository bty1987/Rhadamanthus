/**
 * @File Name		: CustomQuotationItemDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.dao;

import java.util.List;

import org.apache.poi.ss.formula.functions.T;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemMO;

public interface QuotationNormriceDao extends Dao<QuotationFunctionAreaItemMO> {

	public List<T> queryQuotationFunctionAreaItem(short index, long functionAreaId, Short schedule);

	public List<T> queryExtensionItem(long eid, Short schedule);

	public List<T> queryAddReduceItem(long arid, Short schedule);

	public List<T> amountQuotationNormrice(short index, long functionAreaId);

	public List<T> amountExtensionNormrice(long eid);

	public List<T> amountAddReduceNormrice(long arid);

}
