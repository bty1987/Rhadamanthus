/**
 * @File Name		: WaterwayCircuitCehckDrawingDaoImpl.java
 * @Package   	: com.fanglin.dao.constructionSchedule.impl
 * @Version		: 1.0
 * @Date			: 2015-4-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.WaterwayCircuitCheckDrawingDao;
import com.fanglin.construction.po.WaterwayCircuitCheckDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("waterwayCircuitCehckDrawingDao")
public class WaterwayCircuitCheckDrawingDaoImpl extends DaoImpl<WaterwayCircuitCheckDrawingPO> implements WaterwayCircuitCheckDrawingDao {
	
	public WaterwayCircuitCheckDrawingDaoImpl(){
		super(WaterwayCircuitCheckDrawingPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<WaterwayCircuitCheckDrawingPO> queryWaterwayCircuitCheckDrawingByCsId(int csId) {
		return session().createCriteria(WaterwayCircuitCheckDrawingPO.class).add(Restrictions.eq(WaterwayCircuitCheckDrawingPO.COLUMN_CSID_STR, csId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WaterwayCircuitCheckDrawingPO> queryWaterwayCircuitCheckDrawingByWcccsId(int wcccsId){
		return session().createCriteria(WaterwayCircuitCheckDrawingPO.class).add(Restrictions.eq(WaterwayCircuitCheckDrawingPO.COLUMN_WCCCSID_STR, wcccsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WaterwayCircuitCheckDrawingPO> queryWaterwayCircuitCheckDrawingByType(short type) {
		return session().createCriteria(WaterwayCircuitCheckDrawingPO.class).add(Restrictions.eq(WaterwayCircuitCheckDrawingPO.COLUMN_TYPE_STR, type)).list();
	}

}
