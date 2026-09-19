package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.MaterialPlanNodeDao;
import com.fanglin.data.po.MaterialPlanNodePO;
import com.fanglin.utils.Paging;

@Repository("materialPlanNodeDao")
public class MaterialPlanNodeDaoImpl extends DaoImpl<MaterialPlanNodePO> implements MaterialPlanNodeDao {

	public MaterialPlanNodeDaoImpl() {
		super(MaterialPlanNodePO.class);
	}

	@Override
	public List<MaterialPlanNodePO> pageMaterialPlanNode(Paging paging, List<Filter> filters, int company) {

		PagingQuery<MaterialPlanNodePO> query = pagingQuery(paging, MaterialPlanNodePO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		query.asc("cnid");
		query.asc("action");
		query.asc("offsetDay");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPlanNodePO> queryMaterialPlanNode(int company) {
		return session().createCriteria(MaterialPlanNodePO.class).add(Restrictions.eq(MaterialPlanNodePO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(MaterialPlanNodePO.COLUMN_STATUS_STR, MaterialPlanNodePO.STATUS_ENABLE_SHORT)).addOrder(Order.asc("cnid")).addOrder(Order.asc("action")).addOrder(Order.asc("offsetDay")).list();
	}

	@Override
	public int countMaterialPlanNode(int company, short type, long cid, long bid, long cnid, short action) {

		Number count = (Number) session().createCriteria(MaterialPlanNodePO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("type", type)).add(Restrictions.eq("cid", cid)).add(Restrictions.eq("bid", bid)).add(Restrictions.eq("cnid", cnid)).add(Restrictions.eq("action", action)).setProjection(Projections.rowCount()).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String op = filter.getOp();
			String data = filter.getData();

			if ("type".equals(field)) {
				query.add(Restrictions.eq("type", Short.valueOf(data)));
			} else if ("action".equals(field)) {
				query.add(Restrictions.eq("action", Short.valueOf(data)));
			} else if ("anchor".equals(field)) {
				query.add(Restrictions.eq("anchor", Short.valueOf(data)));
			} else if ("cnid".equals(field)) {
				query.add(Restrictions.eq("cnid", Long.valueOf(data)));
			} else if ("status".equals(field)) {
				query.add(Restrictions.eq("status", Short.valueOf(data)));
			} else if ("categoryName".equals(field)) {
				query.add(query.getCriterion("categoryName", data, op));
			} else if ("brandName".equals(field)) {
				query.add(query.getCriterion("brandName", data, op));
			} else if ("nodeName".equals(field)) {
				query.add(query.getCriterion("nodeName", data, op));
			}
		}
	}

}
