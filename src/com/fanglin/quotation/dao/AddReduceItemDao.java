/**
 * @File Name		: AddReduceItemDao.java
 * @Package   	: com.fanglin.decoration.dao
 * @Version		: 1.0
 * @Date			: 2016-6-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;

public interface AddReduceItemDao extends Dao<AddReduceItemPO> {
	
	public List<AddReduceItemPO> queryAddReduceItemByAddReduceId(int addReduceId);
	
	public List<AddReduceItemPO> queryAddReduceItemByAddReduceIds(List<Integer> addReduceIds);
	
	public int countAddReduceItemForFunctionArea(long qfaid);
	
	public int countAddReduceItemForFunctionArea(List<QuotationFunctionAreaPO> quotationFunctionAreas);
	
}
