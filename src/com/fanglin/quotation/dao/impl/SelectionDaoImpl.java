package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.SelectionDao;
import com.fanglin.quotation.po.SelectionDO;
import com.fanglin.quotation.po.SelectionPO;
import com.fanglin.utils.Paging;

@Repository("selectionDao")
public class SelectionDaoImpl extends DaoImpl<SelectionPO> implements SelectionDao {

	public SelectionDaoImpl() {
		super(SelectionPO.class);
	}

	@Override
	public List<SelectionDO> pageSelection(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<SelectionDO> query = pagingQuery(paging, SelectionDO.class);

		// if (company != null) query.alias("decoration", "decoration").add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	@Override
	public SelectionPO querySelectionByQid(long qid) {
		return (SelectionPO) createCriteria(SelectionPO.class).add(Restrictions.eq(SelectionPO.COLUMN_QID_STR, qid)).uniqueResult();
	}

	@Override
	public int updateSelectionForQidByOrderId(String orderId, long qid) {

		String sql = "update quotation.selection set qid = :qid where orderId = :orderId";
		session().createSQLQuery(sql).setLong(SelectionPO.COLUMN_QID_STR, qid).setString(SelectionPO.COLUMN_ORDERID_STR, orderId).executeUpdate();

		return 0;
	}

	@Override
	public SelectionPO querySelectionByOrderId(String orderId) {
		return (SelectionPO) createCriteria(SelectionPO.class).add(Restrictions.eq(SelectionPO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public int deleteSelectionByQid(long qid) {

		String sql = "delete from quotation.selection where qid = :qid";
		session().createSQLQuery(sql).setLong(SelectionPO.COLUMN_QID_STR, qid).executeUpdate();

		return 0;
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
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", "createTime", data);
			} else if ("isAffirm".equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			} else if ("affirmTime".equals(field)) {
				query.timeranges("affirmTime", "affirmTime", data);
			}
		}
	}
}
