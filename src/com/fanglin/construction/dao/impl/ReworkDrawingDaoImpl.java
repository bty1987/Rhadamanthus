/**
 * @File Name	: ReworkDrawingDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ReworkDrawingDao;
import com.fanglin.construction.po.ReworkDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("reworkDrawingDao")
public class ReworkDrawingDaoImpl extends DaoImpl<ReworkDrawingPO> implements ReworkDrawingDao {
	
	public ReworkDrawingDaoImpl(){
		super(ReworkDrawingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ReworkDrawingPO> queryDrawingByReworkId(int reworkId){
		
		return session().createCriteria(ReworkDrawingPO.class).add(Restrictions.eq(ReworkDrawingPO.COLUMN_RWID_STR, reworkId)).list();
	
	}
	
}
