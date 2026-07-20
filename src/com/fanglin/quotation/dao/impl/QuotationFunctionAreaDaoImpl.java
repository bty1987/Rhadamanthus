/**
 * @File Name		: CustomQuotationItemDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;

@Repository("quotationFunctionAreaDao")
public class QuotationFunctionAreaDaoImpl extends DaoImpl<QuotationFunctionAreaPO> implements QuotationFunctionAreaDao {

	public QuotationFunctionAreaDaoImpl() {
		super(QuotationFunctionAreaPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationFunctionAreaPO> queryQuotationFunctionAreaByQuotationId(long quotationId) {
		return createCriteria(QuotationFunctionAreaPO.class).add(Restrictions.eq("quotation.qid", quotationId)).addOrder(Order.asc("functionAreaOrder")).list();
	}

	@Override
	public QuotationFunctionAreaPO queryQuotationFunctionAreaForTypeByQuotationId(long quotationId, short type) {
		return (QuotationFunctionAreaPO) createCriteria(QuotationFunctionAreaPO.class).add(Restrictions.eq("quotation.qid", quotationId)).add(Restrictions.eq("type", type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int deleteQuotationFunctionArea(List<Long> qfaIds) {

		if (qfaIds.size() == 0) {
			return -1;
		}

		String hql = "delete QuotationFunctionAreaPO q where q.qfaId in :qfaIds";
		int deletedEntities = session().createQuery(hql).setParameterList("qfaIds", qfaIds).executeUpdate();

		return deletedEntities;
	}

}
