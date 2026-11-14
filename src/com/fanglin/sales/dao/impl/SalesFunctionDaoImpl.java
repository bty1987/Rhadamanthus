package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.SalesFunctionDao;
import com.fanglin.sales.po.SalesFunctionPO;
import com.fanglin.utils.Paging;

@Repository("salesFunctionDao")
public class SalesFunctionDaoImpl extends DaoImpl<SalesFunctionPO>  implements SalesFunctionDao{

	public SalesFunctionDaoImpl(){
		super(SalesFunctionPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesFunctionPO> querySalesFunction(Short type) {
		if(type != null){
			return session().createCriteria(SalesFunctionPO.class).add(Restrictions.eq("type", type)).list();
		}else{
			return session().createCriteria(SalesFunctionPO.class).list();
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesFunctionPO> querySalesFunctionByName(String name) {
		return session().createCriteria(SalesFunctionPO.class).add(Restrictions.eq("name", name)).list();
	}

	@Override
	public List<SalesFunctionPO> pageSalesFunction(Paging paging, List<Filter> filters) {

		PagingQuery<SalesFunctionPO> query = pagingQuery(paging, SalesFunctionPO.class);

		queryFilterExcute(query, filters);

		query.asc("sort").asc("sfid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("key".equals(field)) {
				query.add(query.getCriterion("key", data, op));
			} else if ("group".equals(field)) {
				query.add(query.getCriterion("group", data, op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", data, op));
			} else if ("subtype".equals(field)) {
				query.add(query.getCriterion("subtype", data, op));
			}
		}
	}

	@Override
	public long countSalesFunctionRightBySfid(long sfid) {
		return ((Number) session().createQuery("select count(*) from SalesFunctionRightPO where salesFunction.sfid = :sfid").setParameter("sfid", sfid).uniqueResult()).longValue();
	}

}
