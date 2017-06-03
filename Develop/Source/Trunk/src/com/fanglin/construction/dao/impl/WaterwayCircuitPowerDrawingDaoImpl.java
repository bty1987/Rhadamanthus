/**
 * @File Name		: WaterwayCircuitPowerDrawingDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.WaterwayCircuitPowerDrawingDao;
import com.fanglin.construction.po.WaterwayCircuitPowerDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("waterwayCircuitPowerDrawingDao")
public class WaterwayCircuitPowerDrawingDaoImpl extends DaoImpl<WaterwayCircuitPowerDrawingPO> implements WaterwayCircuitPowerDrawingDao {

	public WaterwayCircuitPowerDrawingDaoImpl(){
		super(WaterwayCircuitPowerDrawingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WaterwayCircuitPowerDrawingPO> queryWaterwayCircuitPowerDrawingByCsId(long csId) {
		return session().createCriteria(WaterwayCircuitPowerDrawingPO.class).add(Restrictions.eq(WaterwayCircuitPowerDrawingPO.COLUMN_CSID_STR, csId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WaterwayCircuitPowerDrawingPO> queryWaterwayCircuitPowerDrawingByWcpcsId(int wcpdcsId){
		return session().createCriteria(WaterwayCircuitPowerDrawingPO.class).add(Restrictions.eq(WaterwayCircuitPowerDrawingPO.COLUMN_WCPCSID_STR, wcpdcsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WaterwayCircuitPowerDrawingPO> queryWaterwayCircuitPowerDrawingByType(short type) {
		return session().createCriteria(WaterwayCircuitPowerDrawingPO.class).add(Restrictions.eq(WaterwayCircuitPowerDrawingPO.COLUMN_TYPE_STR, type)).list();
	}

}
