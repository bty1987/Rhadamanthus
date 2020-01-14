/**
 * @File Name		: AdvancePaymentDao.java
 * @Package   	: com.fanglin.finance.dao
 * @Version		: 1.0
 * @Date			: 2015-9-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.utils.Paging;

public interface AdvancePaymentDao extends Dao<AdvancePaymentPO> {
	
	public List<AdvancePaymentPO> pageAdvancePayment(Paging paging, List<Filter> filters);
	
	public AdvancePaymentPO queryAdvancePaymentByOrderId(String orderId);
	
}
