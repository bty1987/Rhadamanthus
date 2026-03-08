package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.NormtimePO;
import com.fanglin.data.quotation.dao.NormtimeDao;
import com.fanglin.utils.Paging;

@Repository("normtimeDao")
public class NormtimeDaoImpl extends DaoImpl<NormtimePO> implements NormtimeDao{

	public NormtimeDaoImpl() {
		super(NormtimePO.class);
	}

	@Override
	public List<NormtimePO> pageNormtime(Paging paging, List<Filter> filters) {

		PagingQuery<NormtimePO> query = pagingQuery(paging, NormtimePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormtimePO> queryNormtimeByQiid(Long qiid) {
		return createCriteria(NormtimePO.class).createAlias("quotationItem", "quotationItem").add(Restrictions.eq(NormtimePO.COLUMN_QIID_STR, qiid)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("quotationItem", "quotationItem");
		query.alias("constructionNode", "constructionNode");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (NormtimePO.COLUMN_QIID_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (NormtimePO.COLUMN_QUOTATIONITEMNAME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (NormtimePO.COLUMN_QUOTATIONVERSION_STR.equals(field)) {
				query.alias("quotationItem.quotationVersion", "quotationVersion");
				query.add(query.getCriterion(field, data, op));
			} else if (NormtimePO.COLUMN_CONSTRUCTIONNODENAME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			}
		}
	}

}
