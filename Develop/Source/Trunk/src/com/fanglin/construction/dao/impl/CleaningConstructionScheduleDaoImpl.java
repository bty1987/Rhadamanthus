/**
 * @File Name		: CleaningConstructionScheduleDaoImpl.java
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

import com.fanglin.construction.dao.CleaningConstructionScheduleDao;
import com.fanglin.construction.po.CleaningConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("cleaningConstructionScheduleDao")
public class CleaningConstructionScheduleDaoImpl extends DaoImpl<CleaningConstructionSchedulePO> implements CleaningConstructionScheduleDao {

	public CleaningConstructionScheduleDaoImpl(){
		super(CleaningConstructionSchedulePO.class);
	}

	@Override
	public CleaningConstructionSchedulePO queryCleaningConstructionScheduleByOrderId(String orderId){
		return (CleaningConstructionSchedulePO) session().createCriteria(CleaningConstructionSchedulePO.class).add(Restrictions.eq(CleaningConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public CleaningConstructionSchedulePO queryCleaningConstructionScheduleByCsId(int csId){
		return (CleaningConstructionSchedulePO) session().createCriteria(CleaningConstructionSchedulePO.class).add(Restrictions.eq(CleaningConstructionSchedulePO.COLUMN_CSID_STR, csId)).uniqueResult();
	}

}
