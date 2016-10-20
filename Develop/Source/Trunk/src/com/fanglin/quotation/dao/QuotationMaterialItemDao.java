/**
 * @File Name		: QuotationMaterialItemDao.java
 * @Package   	: com.fanglin.quotation.dao
 * @Version		: 1.0
 * @Date			: 2016-10-20
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationMaterialItemPO;

public interface QuotationMaterialItemDao extends Dao<QuotationMaterialItemPO> {
	
	public List<QuotationMaterialItemPO> queryQuotationMaterialItemByQId(long qid);

}
