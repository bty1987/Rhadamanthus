package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.AwardPurchaseDao;
import com.fanglin.information.po.AwardPurchasePO;
import com.fanglin.utils.Paging;

@Repository("awardPurchaseDao")
public class AwardPurchaseDaoImpl extends DaoImpl<AwardPurchasePO> implements AwardPurchaseDao {

	public AwardPurchaseDaoImpl() {
		super(AwardPurchasePO.class);
	}

	@Override
	public List<AwardPurchasePO> pageAwardPurchase(Paging paging, List<Filter> filters, int company) {

		PagingQuery<AwardPurchasePO> query = pagingQuery(paging, AwardPurchasePO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExecute(query, filters);

		query.desc("apid");

		return query.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			query.alias("awardStock", "awardStock");

			if ("awardStock.no".equals(field)) {
				query.add(query.getCriterion("awardStock.no", data, op));
			} else if ("awardStock.name".equals(field)) {
				query.add(query.getCriterion("awardStock.name", data, op));
			} else if ("activity".equals(field)) {
				query.add(query.getCriterion("activity", data, op));
			} else if ("dept".equals(field)) {
				query.add(query.getCriterion("dept", data, op));
			} else if ("awardStock.type".equals(field)) {
				query.add(query.getCriterion("awardStock.type", Short.valueOf(data), op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("createTimeAwardPurchase".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("purchaseTimeAwardPurchase".equals(field)) {
				query.timeranges("purchaseTime", data);
			} else if ("instoreTimeAwardPurchase".equals(field)) {
				query.timeranges("instoreTime", data);
			}

		}
	}
}
