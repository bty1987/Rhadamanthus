/**
 * @File Name		: BricklayDrawingDaoImpl.java
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

import com.fanglin.construction.dao.BricklayDrawingDao;
import com.fanglin.construction.po.BricklayDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("bricklayDrawingDao")
public class BricklayDrawingDaoImpl extends DaoImpl<BricklayDrawingPO> implements BricklayDrawingDao {
	
	public BricklayDrawingDaoImpl(){
		super(BricklayDrawingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BricklayDrawingPO> queryBricklayDrawingByCsId(int csId) {
		return session().createCriteria(BricklayDrawingPO.class).add(Restrictions.eq(BricklayDrawingPO.COLUMN_CSID_STR, csId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BricklayDrawingPO> queryBricklayDrawingByBcsId(int bcsId){
		return session().createCriteria(BricklayDrawingPO.class).add(Restrictions.eq(BricklayDrawingPO.COLUMN_BCSID_STR, bcsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BricklayDrawingPO> queryBricklayDrawingByType(short type) {
		return session().createCriteria(BricklayDrawingPO.class).add(Restrictions.eq(BricklayDrawingPO.COLUMN_TYPE_STR, type)).list();
	}

}
