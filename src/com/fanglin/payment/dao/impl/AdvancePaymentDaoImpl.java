/**
 * @File Name		: AdvancePaymentDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-9-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.impl.DecorationDaoImpl;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.utils.Paging;

@Repository("advancePaymentDao")
public class AdvancePaymentDaoImpl extends DaoImpl<AdvancePaymentPO> implements AdvancePaymentDao {

	public AdvancePaymentDaoImpl() {
		super(AdvancePaymentPO.class);
	}

	@Override
	public List<AdvancePaymentPO> pageAdvancePayment(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<AdvancePaymentPO> query = pagingQuery(paging, AdvancePaymentPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public AdvancePaymentPO queryAdvancePaymentByOrderId(String orderId) {
		return (AdvancePaymentPO) session().createCriteria(AdvancePaymentPO.class).createAlias("decoration", "decoration").add(Restrictions.eq("decoration.orderId", orderId)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("company".equals(field)) {
				query.alias("decoration", "decoration");
				query.add(query.getCriterion("decoration.company", Integer.valueOf(data), op));
			}

		}

	}
}
