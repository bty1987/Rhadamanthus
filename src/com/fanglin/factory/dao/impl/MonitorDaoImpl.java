/**
 * @File Name		: MonitorDaoImpl.java
 * @Package   	: com.fanglin.monitor.dao.impl
 * @Version		: 1.0
 * @Date			: 2017-9-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.factory.dao.MonitorDao;
import com.fanglin.factory.po.MonitorPO;

@Repository("monitoryDao")
public class MonitorDaoImpl extends DaoImpl<MonitorPO> implements MonitorDao {
	
	public MonitorDaoImpl(){
		super(MonitorPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<MonitorPO> queryMonitor() {
		return session().createCriteria(MonitorPO.class).list();
	}

	@Override
	public MonitorPO queryMonitor(String name, String type) {
		return (MonitorPO) session().createCriteria(MonitorPO.class).add(Restrictions.eq(MonitorPO.COLUMN_NAME_STR, name)).add(Restrictions.eq(MonitorPO.COLUMN_TYPE_STR, type)).setMaxResults(1).uniqueResult();
	}

}
