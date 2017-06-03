/**
 * @File Name		: PutlineDrawingDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.PutlineDrawingDao;
import com.fanglin.construction.po.PutlineDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("putlineDrawingDao")
public class PutlineDrawingDaoImpl extends DaoImpl<PutlineDrawingPO> implements PutlineDrawingDao {
	
	public PutlineDrawingDaoImpl(){
		super(PutlineDrawingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PutlineDrawingPO> queryPutlineDrawingByCsId(long csId) {
		return session().createCriteria(PutlineDrawingPO.class).add(Restrictions.eq(PutlineDrawingPO.COLUMN_CSID_STR, csId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PutlineDrawingPO> queryPutlineDrawingByPlcsId(int plcsId){
		return session().createCriteria(PutlineDrawingPO.class).add(Restrictions.eq(PutlineDrawingPO.COLUMN_PLCSID_STR, plcsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PutlineDrawingPO> queryPutlineDrawingByType(short type) {
		return session().createCriteria(PutlineDrawingPO.class).add(Restrictions.eq(PutlineDrawingPO.COLUMN_TYPE_STR, type)).list();
	}

}
