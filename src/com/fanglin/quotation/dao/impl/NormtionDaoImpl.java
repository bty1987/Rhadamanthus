package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.NormtionDao;
import com.fanglin.quotation.po.NormtionDO;
import com.fanglin.quotation.po.NormtionPO;
import com.fanglin.utils.Paging;

@Repository("normtionDao")
public class NormtionDaoImpl extends DaoImpl<NormtionPO> implements NormtionDao {

	public NormtionDaoImpl() {
		super(NormtionPO.class);
	}

	@Override
	public List<NormtionDO> pageNormtion(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<NormtionDO> query = pagingQuery(paging, NormtionDO.class);

		query.alias("decoration", "decoration");

		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	@Override
	public NormtionPO queryNormtion(long qid) {
		return (NormtionPO) createCriteria(NormtionPO.class).add(Restrictions.eq("qid", qid)).setMaxResults(1).uniqueResult();
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
			} else if ("villageId".equals(field)) {
				query.alias("decoration.house", "house");
				query.alias("house.village", "village");
				query.add(query.getCriterion("village.no", data, op));
			} else if ("designerId".equals(field)) {
				query.alias("decoration.designer", "designer");
				query.add(query.getCriterion("designer.userId", data, op));
			} else if ("salesmanId".equals(field)) {
				query.alias("decoration.salesman", "salesman");
				query.add(query.getCriterion("salesman.userId", data, op));
			} else if ("decorationOrderStatus".equals(field)) {
				query.alias("decoration", "decoration");
				query.add(query.getCriterion("decoration.status", Short.valueOf(data), op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", "createTime", data);
			}
		}
	}

}
