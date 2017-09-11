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

import com.fanglin.core.dao.Dao;
import com.fanglin.payment.po.AdvancePaymentPO;

public interface AdvancePaymentDao extends Dao<AdvancePaymentPO> {
	
	public AdvancePaymentPO queryAdvancePaymentByCid(int cid,int company);
	
	public AdvancePaymentPO queryAdvancePaymentByCustomerId(String customerId,int company);
	
}
