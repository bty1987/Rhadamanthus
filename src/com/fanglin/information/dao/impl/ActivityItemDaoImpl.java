/**
 * @File Name		: ActivityItemDaoImpl.java
 * @Package   	: com.fanglin.information.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.information.dao.ActivityItemDao;
import com.fanglin.information.po.ActivityItemPO;

@Repository("activityItemDao")
public class ActivityItemDaoImpl extends DaoImpl<ActivityItemPO> implements ActivityItemDao {
	
	public ActivityItemDaoImpl(){
		super(ActivityItemPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ActivityItemPO> queryActivityItemByAid(long aId) {
		return session().createCriteria(ActivityItemPO.class).add(Restrictions.eq(ActivityItemPO.COLUMN_AID_STR, aId)).list();
	}

}
