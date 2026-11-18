package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.NormricePO;
import com.fanglin.data.quotation.dao.NormriceDao;
import com.fanglin.utils.Paging;

@Repository("normriceDao")
public class NormriceDaoImpl extends DaoImpl<NormricePO> implements NormriceDao{

	public NormriceDaoImpl() {
		super(NormricePO.class);
	}
	
	@Override
	public List<NormricePO> pageNormrice(Paging paging, List<Filter> filters) {

		PagingQuery<NormricePO> query = pagingQuery(paging, NormricePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<NormricePO> queryNormriceByQiid(Long qiid) {
		return createCriteria(NormricePO.class).createAlias("quotationItem", "quotationItem").add(Restrictions.eq(NormricePO.COLUMN_QIID_STR, qiid)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("quotationItem", "quotationItem");
		query.alias("constructionNode", "constructionNode");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (NormricePO.COLUMN_QIID_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (NormricePO.COLUMN_QUOTATIONITEMNAME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (NormricePO.COLUMN_QUOTATIONVERSION_STR.equals(field)) {
				query.alias("quotationItem.quotationVersion", "quotationVersion");
				query.add(query.getCriterion(field, data, op));
			} else if (NormricePO.COLUMN_CONSTRUCTIONNODENAME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			}
		}
	}
	
}
