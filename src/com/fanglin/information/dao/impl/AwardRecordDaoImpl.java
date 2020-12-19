package com.fanglin.information.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.utils.Paging;

@Repository("awardRecordDao")
public class AwardRecordDaoImpl extends DaoImpl<AwardRecordPO> implements AwardRecordDao {

	@Override
	public List<AwardRecordPO> pageAwardRecord(Paging paging, List<Filter> filters, int company) {

		PagingQuery<AwardRecordPO> query = pagingQuery(paging, AwardRecordPO.class);

		query.alias("awardStock", "awardStock");
		query.add(query.getCriterion("awardStock.company", company, "eq"));
		queryFilterExecute(query, filters);
		query.desc("arid");

		return query.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			query.alias("awardStock", "awardStock");

			if ("awardStock".equals(field)) {
				query.add(query.getCriterion("awardStock.asId", Long.valueOf(data), op));
			} else if ("awardStock.name".equals(field)) {
				query.add(query.getCriterion("awardStock.name", data, op));
			} else if ("orderId".equals(field)) {
				query.add(query.getCriterion("orderId", data, op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			} else if ("onetype".equals(field)) {
				query.add(query.getCriterion("onetype", Short.valueOf(data), op));
			} else if ("subtype".equals(field)) {
				query.add(query.getCriterion("subtype", Short.valueOf(data), op));
			} else if ("awardRecordTimeDateRange".equals(field)) {
				query.timeranges("operateTime", data);
			}
		}
	}
}
