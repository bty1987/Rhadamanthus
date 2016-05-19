/**
 * @File Name		: CarpentConstructionScheduleDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.CarpentConstructionScheduleDao;
import com.fanglin.construction.po.CarpentConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("carpentConstructionScheduleDao")
public class CarpentConstructionScheduleDaoImpl extends DaoImpl<CarpentConstructionSchedulePO> implements CarpentConstructionScheduleDao {
	
	public CarpentConstructionScheduleDaoImpl(){
		super(CarpentConstructionSchedulePO.class);
	}

	@Override
	public CarpentConstructionSchedulePO queryCarpentConstructionScheduleByOrderId(String orderId){
		return (CarpentConstructionSchedulePO) session().createCriteria(CarpentConstructionSchedulePO.class).add(Restrictions.eq(CarpentConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public CarpentConstructionSchedulePO queryCarpentConstructionScheduleByCsId(int csId){
		return (CarpentConstructionSchedulePO) session().createCriteria(CarpentConstructionSchedulePO.class).add(Restrictions.eq(CarpentConstructionSchedulePO.COLUMN_CSID_STR, csId)).uniqueResult();
	}

}
