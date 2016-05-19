/**
 * @File Name		: WaterwayCircuitPowerConstructionScheduleDaoImpl.java
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

import com.fanglin.construction.dao.WaterwayCircuitPowerConstructionScheduleDao;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("waterwayCircuitPowerConstructionScheduleDao")
public class WaterwayCircuitPowerConstructionScheduleDaoImpl extends DaoImpl<WaterwayCircuitPowerConstructionSchedulePO> implements WaterwayCircuitPowerConstructionScheduleDao {

	public WaterwayCircuitPowerConstructionScheduleDaoImpl(){
		super(WaterwayCircuitPowerConstructionSchedulePO.class);
	}

	@Override
	public WaterwayCircuitPowerConstructionSchedulePO queryCircuitPowerConstructionScheduleByOrderId(String orderId){
		return (WaterwayCircuitPowerConstructionSchedulePO) session().createCriteria(WaterwayCircuitPowerConstructionSchedulePO.class).add(Restrictions.eq(WaterwayCircuitPowerConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public WaterwayCircuitPowerConstructionSchedulePO queryCircuitPowerConstructionScheduleByCsId(int csId){
		return (WaterwayCircuitPowerConstructionSchedulePO) session().createCriteria(WaterwayCircuitPowerConstructionSchedulePO.class).add(Restrictions.eq(WaterwayCircuitPowerConstructionSchedulePO.COLUMN_CSID_STR, csId)).uniqueResult();
	}

}
