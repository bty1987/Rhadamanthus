/**
 * @File Name		: AcceptanceDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.AcceptanceDao;
import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("acceptanceDao")
public class AcceptanceDaoImpl extends DaoImpl<AcceptancePO> implements AcceptanceDao {
	
	public AcceptanceDaoImpl(){
		super(AcceptancePO.class);
	}

	@Override
	public AcceptancePO queryAcceptanceByOrderId(String orderId){
		
		return (AcceptancePO) session().createCriteria(AcceptancePO.class).add(Restrictions.eq(AcceptancePO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
		
	}

}
