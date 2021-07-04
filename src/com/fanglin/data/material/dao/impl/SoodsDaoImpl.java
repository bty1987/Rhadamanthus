package com.fanglin.data.material.dao.impl;

import java.math.BigInteger;
import java.util.List;

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
	public List<SoodsPO> pageSoods(Paging paging, List<Filter> filters, int company) {

		PagingQuery<SoodsPO> query = pagingQuery(paging, SoodsPO.class);
		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<SoodsPO> pageSoodsByQiid(Paging paging, List<Filter> filters, long qiid) {

		PagingQuery<SoodsPO> query = pagingQuery(paging, SoodsPO.class);

		query.alias("quotationItem", "quotationItem");

		query.add(query.getCriterion("quotationItem.qiid", qiid, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SoodsPO> querySoodsByQiid(long qiid) {
		return session().createCriteria(SoodsPO.class).createAlias("quotationItem", "quotationItem").add(Restrictions.eq(SoodsPO.COLUMN_QIID_STR, qiid)).list();
	}

	@Override
	public int countSoods(long gid, long qiid) {

		String sql = "SELECT COUNT(*) FROM `data`.soods WHERE gid= :gid AND qiid= :qiid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("gid", gid).setLong("qiid", qiid).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<SoodsPO> query, List<Filter> filters) {

		if (filters != null) {
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
				} else if (SoodsPO.COLUMN_VERSION_STR.equals(field)) {
					query.alias("quotationItem", "quotationItem");
					query.add(query.getCriterion(SoodsPO.COLUMN_VERSION_STR, data, op));
				} else if (SoodsPO.COLUMN_QNAME_STR.equals(field)) {
					query.alias("quotationItem", "quotationItem");
					query.add(query.getCriterion(SoodsPO.COLUMN_QNAME_STR, data, op));
				} else if (SoodsPO.COLUMN_QUOTATIONSMALLCATEGORYID_STR.equals(field)) {
					query.alias("quotationItem", "quotationItem");
					query.alias("quotationItem.quotationSmallCategory", "quotationSmallCategory");
					query.add(query.getCriterion(SoodsPO.COLUMN_QUOTATIONSMALLCATEGORYID_STR, Integer.valueOf(data), op));
				}
			}
		}
	}

}
