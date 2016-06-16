/**
 * @File Name		: ChanConstructionScheduleDaoImpl.java
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

import com.fanglin.construction.dao.ChanConstructionScheduleDao;
import com.fanglin.construction.po.ChanConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("chanConstructionScheduleDao")
public class ChanConstructionScheduleDaoImpl extends DaoImpl<ChanConstructionSchedulePO> implements ChanConstructionScheduleDao {
	
	public ChanConstructionScheduleDaoImpl(){
		super(ChanConstructionSchedulePO.class);
	}

	@Override
	public ChanConstructionSchedulePO queryChanConstructionScheduleByOrderId(String orderId){
		return (ChanConstructionSchedulePO) session().createCriteria(ChanConstructionSchedulePO.class).add(Restrictions.eq(ChanConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public ChanConstructionSchedulePO queryChanConstructionScheduleByCsId(int csId){
		return (ChanConstructionSchedulePO) session().createCriteria(ChanConstructionSchedulePO.class).add(Restrictions.eq(ChanConstructionSchedulePO.COLUMN_CSID_STR, csId)).uniqueResult();
	}

}
