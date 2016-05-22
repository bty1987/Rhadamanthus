/**
 * @File Name		: BricklayConstructionScheduleDaoImpl.java
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

import com.fanglin.construction.dao.BricklayConstructionScheduleDao;
import com.fanglin.construction.po.BricklayConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("bricklayConstructionScheduleDao")
public class BricklayConstructionScheduleDaoImpl extends DaoImpl<BricklayConstructionSchedulePO> implements BricklayConstructionScheduleDao {
	
	public BricklayConstructionScheduleDaoImpl(){
		super(BricklayConstructionSchedulePO.class);
	}

	@Override
	public BricklayConstructionSchedulePO queryBricklayConstructionScheduleByOrderId(String orderId){
		return (BricklayConstructionSchedulePO) session().createCriteria(BricklayConstructionSchedulePO.class).add(Restrictions.eq(BricklayConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public BricklayConstructionSchedulePO queryBricklayConstructionScheduleByCsId(int csId){
		return (BricklayConstructionSchedulePO) session().createCriteria(BricklayConstructionSchedulePO.class).add(Restrictions.eq(BricklayConstructionSchedulePO.COLUMN_CSID_STR, csId)).uniqueResult();
	}

}
