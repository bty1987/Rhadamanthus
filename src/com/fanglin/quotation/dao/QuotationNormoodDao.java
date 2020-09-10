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

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemAO;

public interface QuotationNormoodDao extends Dao<QuotationFunctionAreaItemAO> {

	public List<?> queryQuotationFunctionAreaItem(short index, long functionAreaId);

	public List<?> amountQuotationNormood(short index, long functionAreaId);

}
