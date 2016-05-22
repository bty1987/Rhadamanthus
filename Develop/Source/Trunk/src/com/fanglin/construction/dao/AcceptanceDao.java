/**
 * @File Name		: AcceptanceDao.java
 * @Package   	: com.fanglin.dao.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.core.dao.Dao;

public interface AcceptanceDao extends Dao<AcceptancePO> {
	
	public AcceptancePO queryAcceptanceByOrderId(String orderId);

}
