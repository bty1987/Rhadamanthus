package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.RuotationDao;
import com.fanglin.quotation.po.RuotationPO;
import com.fanglin.utils.Paging;

@Repository("ruotationDao")
public class RuotationDaoImpl extends DaoImpl<RuotationPO> implements RuotationDao {

	public RuotationDaoImpl(){
		super(RuotationPO.class);
	}

	@Override
	public List<RuotationPO> pageRuotation(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<RuotationPO> query = pagingQuery(paging, RuotationPO.class);

		query.alias("decoration", "decoration");

		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public RuotationPO queryRuotationByQid(long qid) {

		return (RuotationPO) createCriteria(RuotationPO.class).add(Restrictions.eq("quotation.qid", qid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public RuotationPO queryRuotationByOrderId(String orderId, List<Short> status) {

		return (RuotationPO) createCriteria(RuotationPO.class).add(Restrictions.eq("decoration.orderId", orderId)).add(Restrictions.in("status", status)).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("orderId".equals(field)) {
				query.alias("decoration", "decoration");
				query.add(query.getCriterion("decoration.orderId", data, op));
			}
		}
	}

}
