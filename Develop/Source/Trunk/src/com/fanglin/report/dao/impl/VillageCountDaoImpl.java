/**
 * @File Name		: VillageCountDaoImpl.java
 * @Package   	: com.fanglin.report.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-11-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.report.dao.VillageCountDao;
import com.fanglin.report.po.VillageCountPO;

@Repository("villageCountDao")
public class VillageCountDaoImpl extends DaoImpl<VillageCountPO> implements VillageCountDao {
	
	public VillageCountDaoImpl(){
		super(VillageCountPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<VillageCountPO> queryVillageCountByXY(double x, double y, double range) {
		return session().createCriteria(VillageCountPO.class).createAlias("village", "village").add(Restrictions.between(VillageCountPO.COLUMN_VILLAGE_X_STR, x-range, x+range)).add(Restrictions.between(VillageCountPO.COLUMN_VILLAGE_Y_STR, y-range, y+range)).list();
	}

}
