/**
 * @File Name		: PutlineConstructionScheduleDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.PutlineConstructionScheduleDao;
import com.fanglin.construction.po.PutlineConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("putlineConstructionScheduleDao")
public class PutlineConstructionScheduleDaoImpl extends DaoImpl<PutlineConstructionSchedulePO> implements PutlineConstructionScheduleDao {
	
	public PutlineConstructionScheduleDaoImpl(){
		super(PutlineConstructionSchedulePO.class);
	}

	@Override
	public PutlineConstructionSchedulePO queryConstructionScheduleByOrderId(String orderId){
		//junhao edit 20141231
		return (PutlineConstructionSchedulePO) session().createCriteria(PutlineConstructionSchedulePO.class).add(Restrictions.eq("decorationOrder.orderId", orderId)).uniqueResult();
	}

	@Override
	public PutlineConstructionSchedulePO queryConstructionScheduleByCsId(int csId){
		return (PutlineConstructionSchedulePO) session().createCriteria(PutlineConstructionSchedulePO.class).add(Restrictions.eq(PutlineConstructionSchedulePO.COLUMN_CSID_STR, csId)).uniqueResult();
	}

}
