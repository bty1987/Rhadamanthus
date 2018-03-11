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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;

public interface QuotationFunctionAreaItemDao extends Dao<QuotationFunctionAreaItemPO> {
	
	public QuotationFunctionAreaItemPO queryQuotationFunctionAreaItemByQfaiId(Class<?> clazz, long qfaiId);
	
	public List<QuotationFunctionAreaItemPO> queryQuotationFunctionAreaItemByFunctionAreaId(Class<?> clazz, long functionAreaId);

	public QuotationFunctionAreaItemPO queryQuotationFunctionAreaItemByQuotationIdAType(Class<?> clazz, long qId, short type);
	
	public QuotationFunctionAreaItemPO queryQuotationFunctionAreaItemForTypeByQuotationFunctionAreaId(Class<?> clazz,Long quotationFunctionAreaId, Short type);
	
	public int updateQuotationFunctionAreaItemForIndex(String table,QuotationFunctionAreaItemVO QuotationFunctionAreaItemVO) throws FLException;

	public int deleteQuotationFunctionAreaItemByFunctionAreaId(String clazz, long functionAreaId);
	
	public int deleteQuotationFunctionAreaItemByQfaiIds(String table,List<Long> qfaiIds);

}
