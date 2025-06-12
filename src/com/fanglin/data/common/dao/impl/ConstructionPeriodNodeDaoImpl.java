package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.ConstructionPeriodNodeDao;
import com.fanglin.data.po.ConstructionPeriodNodePO;

@Repository("constructionPeriodNodeDao")
public class ConstructionPeriodNodeDaoImpl extends DaoImpl<ConstructionPeriodNodePO> implements ConstructionPeriodNodeDao {

	public ConstructionPeriodNodeDaoImpl() {
		super(ConstructionPeriodNodePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionPeriodNodePO> queryConstructionPeriodNodeByCpid(long cpid) {
		return session().createCriteria(ConstructionPeriodNodePO.class).add(Restrictions.eq("cpid", cpid)).list();
	}

}