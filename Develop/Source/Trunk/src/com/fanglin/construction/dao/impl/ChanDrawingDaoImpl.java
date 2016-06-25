/**
 * @File Name		: ChanDrawingDaoImpl.java
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

import com.fanglin.construction.dao.ChanDrawingDao;
import com.fanglin.construction.po.ChanDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("chanDrawingDao")
public class ChanDrawingDaoImpl extends DaoImpl<ChanDrawingPO> implements ChanDrawingDao {
	
	public ChanDrawingDaoImpl(){
		super(ChanDrawingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ChanDrawingPO> queryChanDrawingByCsId(int csId) {
		return session().createCriteria(ChanDrawingPO.class).add(Restrictions.eq(ChanDrawingPO.COLUMN_CSID_STR, csId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ChanDrawingPO> queryChanDrawingByCcsId(int ccsId){
		return session().createCriteria(ChanDrawingPO.class).add(Restrictions.eq(ChanDrawingPO.COLUMN_CCSID_STR, ccsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ChanDrawingPO> queryChanDrawingByType(short type) {
		return session().createCriteria(ChanDrawingPO.class).add(Restrictions.eq(ChanDrawingPO.COLUMN_TYPE_STR, type)).list();
	}

}
