package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.AssistanceItemDao;
import com.fanglin.communion.po.AssistanceItemPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("AssistanceItemDao")
public class AssistanceItemDaoImpl extends DaoImpl<AssistanceItemPO> implements AssistanceItemDao {

	public AssistanceItemDaoImpl() {
		super(AssistanceItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AssistanceItemPO> queryAssistanceItem(Long aid) {
		return session().createCriteria(AssistanceItemPO.class).add(Restrictions.eq("aid", aid)).list();

	}

}
