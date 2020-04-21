/**
 * @File Name		: QuotationDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.dao;

import java.util.List;
import java.util.Map;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationPO;

public interface QuotationDao extends Dao<QuotationPO> {

	public List<QuotationPO> queryQuotationByOrderId(String orderId);

	public List<QuotationPO> queryQuotationForDefaultByOrderIds(List<String> orderIds);

	public QuotationPO queryQuotationForDefaultByOrderId(String orderId);
	
	public int countQuotationByOrderId(String orderId);
	
	public int countQuotationByOrderId(String orderId, short status);
	
	public Map<String, Integer> countQuotationForNormood(List<Long> qiids);
	
	public Map<String, Integer> countQuotationForNormrice(List<Long> qiids);
	
	public int updateQuotationForStatusByOrderId(String orderId, short status);

	public int clearQuotationForDefaultByOrderId(String orderId);
	
}
