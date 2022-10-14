package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.SoodsDao;
import com.fanglin.data.po.SoodsPO;
import com.fanglin.utils.Paging;

@Repository("soodsDao")
public class SoodsDaoImpl extends DaoImpl<SoodsPO> implements SoodsDao {

	public SoodsDaoImpl() {
		super(SoodsPO.class);
	}

	@Override
	public List<SoodsPO> pageSoods(Paging paging, List<Filter> filters, Short status, int company) {

		PagingQuery<SoodsPO> query = pagingQuery(paging, SoodsPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		}

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SoodsPO> querySoodsByName(String name, int limit, int company) {
		return session().createCriteria(SoodsPO.class).createAlias("goods", "goods").add(Restrictions.eq("company", company)).add(Restrictions.eq("status", SoodsPO.STATUS_VALID_INT)).add(Restrictions.or(Restrictions.ilike(SoodsPO.COLUMN_NAME_STR, name, MatchMode.ANYWHERE), Restrictions.ilike(SoodsPO.COLUMN_BRAND_STR, name, MatchMode.ANYWHERE))).setMaxResults(limit).list();
	}

	@Override
	public int deleteSoods(long sid) {

		String sql = "delete `data`.soods,`data`.soodsitem from `data`.soods left join `data`.soodsitem on `data`.soods.sid=`data`.soodsitem.sid where `data`.soods.sid= :sid";
		session().createSQLQuery(sql).setLong("sid", sid).executeUpdate();

		return 0;
	}

	private void queryFilterExcute(PagingQuery<SoodsPO> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (SoodsPO.COLUMN_NAME_STR.equals(field)) {
				query.alias("goods", "goods");
				query.add(query.getCriterion(SoodsPO.COLUMN_NAME_STR, data, op));
			} else if (SoodsPO.COLUMN_BRAND_STR.equals(field)) {
				query.alias("goods", "goods");
				query.add(query.getCriterion(SoodsPO.COLUMN_BRAND_STR, data, op));
			} else if (SoodsPO.COLUMN_CATEGORY_STR.equals(field)) {
				query.alias("goods", "goods");
				query.add(query.getCriterion(SoodsPO.COLUMN_CATEGORY_STR, data, op));
			} else if ("status".equals(filter.getField())) {
				query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
			}
		}
	}

}
