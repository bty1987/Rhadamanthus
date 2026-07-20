package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotetionFunctionAreaDao;
import com.fanglin.quotation.po.QuotetionFunctionAreaPO;

@Repository("quotetionFunctionAreaDao")
public class QuotetionFunctionAreaDaoImpl extends DaoImpl<QuotetionFunctionAreaPO> implements QuotetionFunctionAreaDao {

	public QuotetionFunctionAreaDaoImpl() {
		super(QuotetionFunctionAreaPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotetionFunctionAreaPO> queryQuotetionFunctionAreaByQuotetionId(long qid) {
		return createCriteria(QuotetionFunctionAreaPO.class).add(Restrictions.eq("qid", qid)).addOrder(Order.asc("functionAreaOrder")).list();
	}

	@Override
	public QuotetionFunctionAreaPO queryQuotetionFunctionAreaForTypeByQuotetionId(long qid, short type) {
		return (QuotetionFunctionAreaPO) createCriteria(QuotetionFunctionAreaPO.class).add(Restrictions.eq("qid", qid)).add(Restrictions.eq("type", type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int deleteQuotetionFunctionAreaByIds(List<Long> qfaIds) {

		if (qfaIds.size() == 0) {
			return -1;
		}

		String hql = "delete QuotetionFunctionAreaPO q where q.qfaId in :qfaIds";
		int deletedEntities = session().createQuery(hql).setParameterList("qfaIds", qfaIds).executeUpdate();

		return deletedEntities;
	}

}
