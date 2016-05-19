/**
 * @File Name		: OilConstructionScheduleDaoImpl.java
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

import com.fanglin.construction.dao.OilConstructionScheduleDao;
import com.fanglin.construction.po.OilConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("oilConstructionScheduleDao")
public class OilConstructionScheduleDaoImpl extends DaoImpl<OilConstructionSchedulePO> implements OilConstructionScheduleDao {

	public OilConstructionScheduleDaoImpl(){
		super(OilConstructionSchedulePO.class);
	}

	@Override
	public OilConstructionSchedulePO queryConstructionScheduleByOrderId(String orderId){
		return (OilConstructionSchedulePO) session().createCriteria(OilConstructionSchedulePO.class).add(Restrictions.eq(OilConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public OilConstructionSchedulePO queryConstructionScheduleByCsId(int csId){
		return (OilConstructionSchedulePO) session().createCriteria(OilConstructionSchedulePO.class).add(Restrictions.eq(OilConstructionSchedulePO.COLUMN_CSID_STR, csId)).uniqueResult();
	}

}
