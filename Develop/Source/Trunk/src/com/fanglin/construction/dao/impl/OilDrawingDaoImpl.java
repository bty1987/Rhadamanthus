/**
 * @File Name		: OilDrawingDaoImpl.java
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

import com.fanglin.construction.dao.OilDrawingDao;
import com.fanglin.construction.po.OilDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("oilDrawingDao")
public class OilDrawingDaoImpl extends DaoImpl<OilDrawingPO> implements OilDrawingDao {
	
	public OilDrawingDaoImpl(){
		super(OilDrawingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OilDrawingPO> queryOilDrawingByCsId(int csId) {
		return session().createCriteria(OilDrawingPO.class).add(Restrictions.eq(OilDrawingPO.COLUMN_CSID_STR, csId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OilDrawingPO> queryOilDrawingByOcsId(int ocsId){
		return session().createCriteria(OilDrawingPO.class).add(Restrictions.eq(OilDrawingPO.COLUMN_OCSID_STR, ocsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OilDrawingPO> queryOilDrawingByType(short type) {
		return session().createCriteria(OilDrawingPO.class).add(Restrictions.eq(OilDrawingPO.COLUMN_TYPE_STR, type)).list();
	}

}
