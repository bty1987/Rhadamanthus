/**
 * @File Name		: CarpentDrawingDaoImpl.java
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

import com.fanglin.construction.dao.CarpentDrawingDao;
import com.fanglin.construction.po.CarpentDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("carpentDrawingDao")
public class CarpentDrawingDaoImpl extends DaoImpl<CarpentDrawingPO> implements CarpentDrawingDao {

	
	public CarpentDrawingDaoImpl(){
		super(CarpentDrawingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CarpentDrawingPO> queryCarpentDrawingByCsId(int csId) {
		return session().createCriteria(CarpentDrawingPO.class).add(Restrictions.eq(CarpentDrawingPO.COLUMN_CSID_STR, csId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CarpentDrawingPO> queryCarpentDrawingByCcsId(int ccsId){
		return session().createCriteria(CarpentDrawingPO.class).add(Restrictions.eq(CarpentDrawingPO.COLUMN_CCSID_STR, ccsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CarpentDrawingPO> queryCarpentDrawingByType(short type) {
		return session().createCriteria(CarpentDrawingPO.class).add(Restrictions.eq(CarpentDrawingPO.COLUMN_TYPE_STR, type)).list();
	}

}
