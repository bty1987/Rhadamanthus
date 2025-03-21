/**
 * @File Name		: QuotationItemDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.QuotationRtemPO;

public interface QuotationRtemDao extends Dao<QuotationRtemPO> {

	public List<QuotationRtemPO> queryQuotationRtem(Long sid, Long tid);

	public List<QuotationRtemPO> queryQuotationRtem(Long sid);

}
