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

	public List<AddReduceItemPO> queryAddReduceItemByAddReduceId(long arid);

	public List<AddReduceItemPO> queryAddReduceItemByAddReduceIds(List<Long> arids);

	public long countAddReduceItemForFunctionArea(long qfaid);

	public long countAddReduceItemForFunctionArea(List<QuotationFunctionAreaPO> quotationFunctionAreas);

}
