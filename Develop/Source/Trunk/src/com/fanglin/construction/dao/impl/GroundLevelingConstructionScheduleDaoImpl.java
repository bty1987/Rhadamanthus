/**
 * @File Name		: GroundLevelingConstructionScheduleDaoImpl.java
 * @Package   	: com.fanglin.dao.constructionSchedule.impl
 * @Version		: 1.0
 * @Date			: 2015-4-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.GroundLevelingConstructionScheduleDao;
import com.fanglin.construction.po.GroundLevelingConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("groundLevelingConstructionScheduleDao")
public class GroundLevelingConstructionScheduleDaoImpl extends DaoImpl<GroundLevelingConstructionSchedulePO> implements GroundLevelingConstructionScheduleDao {
	
	public GroundLevelingConstructionScheduleDaoImpl(){
		super(GroundLevelingConstructionSchedulePO.class);
	}

	@Override
	public GroundLevelingConstructionSchedulePO queryGroundLevelingConstructionScheduleByOrderId(String orderId){
		return (GroundLevelingConstructionSchedulePO) session().createCriteria(GroundLevelingConstructionSchedulePO.class).add(Restrictions.eq(GroundLevelingConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public GroundLevelingConstructionSchedulePO queryGroundLevelingConstructionScheduleByCsId(int csId){
		return (GroundLevelingConstructionSchedulePO) session().createCriteria(GroundLevelingConstructionSchedulePO.class).add(Restrictions.eq(GroundLevelingConstructionSchedulePO.COLUMN_CSID_STR, csId)).uniqueResult();
	}

}
