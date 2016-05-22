/**
 * @File Name		: GroundLevelingDrawingDaoImpl.java
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

import com.fanglin.construction.dao.GroundLevelingDrawingDao;
import com.fanglin.construction.po.GroundLevelingDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("groundLevelingDrawingDao")
public class GroundLevelingDrawingDaoImpl extends DaoImpl<GroundLevelingDrawingPO> implements GroundLevelingDrawingDao {
	
	public GroundLevelingDrawingDaoImpl(){
		super(GroundLevelingDrawingPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<GroundLevelingDrawingPO> queryGroundLevelingDrawingByCsId(int csId) {
		return session().createCriteria(GroundLevelingDrawingPO.class).add(Restrictions.eq(GroundLevelingDrawingPO.COLUMN_CSID_STR, csId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GroundLevelingDrawingPO> queryGroundLevelingDrawingByGlcsId(int glcsId){
		return session().createCriteria(GroundLevelingDrawingPO.class).add(Restrictions.eq(GroundLevelingDrawingPO.COLUMN_GLCSID_STR, glcsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GroundLevelingDrawingPO> queryGroundLevelingDrawingByType(short type) {
		return session().createCriteria(GroundLevelingDrawingPO.class).add(Restrictions.eq(GroundLevelingDrawingPO.COLUMN_TYPE_STR, type)).list();
	}

}
