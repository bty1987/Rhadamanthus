package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PresignPricePO;
import com.fanglin.data.quotation.dao.PresignPriceDao;
import com.fanglin.utils.Paging;

@Repository("PresignPriceDao")
public class PresignPriceDaoImpl extends DaoImpl<PresignPricePO> implements PresignPriceDao {

	public PresignPriceDaoImpl() {
		super(PresignPricePO.class);
	}

	@Override
	public List<PresignPricePO> pagePresignPrice(Paging paging, List<Filter> filters, Long ppid, Short status) {

		PagingQuery<PresignPricePO> query = pagingQuery(paging, PresignPricePO.class);

		if (ppid != null) {
			query.add(Restrictions.eq("ppid", ppid));
		}

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		}

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PresignPricePO> queryPresignPrice(long ppid) {
		return session().createCriteria(PresignPricePO.class).add(Restrictions.eq("ppid", ppid)).add(Restrictions.eq("status", PresignPricePO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public PresignPricePO queryPresignPrice(Long ppid, Integer quoteArea) {

		Criteria query = session().createCriteria(PresignPricePO.class);

		query.add(Restrictions.eq("ppid", ppid));
		query.add(Restrictions.le("upperArea", quoteArea));
		query.add(Restrictions.ge("lowerArea", quoteArea));
		query.setMaxResults(1);

		return (PresignPricePO) query.uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("pspid".equals(field)) {
				query.add(query.getCriterion("pspid", data, op));
			} else if ("name".equals(filter.getField())) {
				query.add(query.getCriterion("name", filter));
			} else if ("status".equals(filter.getField())) {
				query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
			}
		}
	}

}
