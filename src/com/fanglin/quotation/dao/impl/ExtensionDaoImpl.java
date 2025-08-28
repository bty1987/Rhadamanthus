package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.po.ExtensionDO;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.utils.Paging;

@Repository("extensionDao")
public class ExtensionDaoImpl extends DaoImpl<ExtensionPO> implements ExtensionDao {

	public ExtensionDaoImpl() {
		super(ExtensionPO.class);
	}

	@Override
	public List<ExtensionDO> pageExtension(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<ExtensionDO> query = pagingQuery(paging, ExtensionDO.class);

		query.alias("decoration", "decoration");

		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	@Override
	public List<ExtensionPO> pageExtensionByOrderId(Paging paging, List<Filter> filters) {

		PagingQuery<ExtensionPO> query = pagingQuery(paging, ExtensionPO.class);

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ExtensionPO> queryExtensionByOrderId(String orderId) {
		return session().createCriteria(ExtensionPO.class).add(Restrictions.eq(ExtensionPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ExtensionPO> queryExtensionForTypeByOrderId(String orderId, Short type) {
		return session().createCriteria(ExtensionPO.class).add(Restrictions.eq(ExtensionPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(ExtensionPO.COLUMN_TYPE_STR, type)).list();
	}

	@Override
	public ExtensionPO queryExtension(long qid, short type, short atttype) {
		return (ExtensionPO) session().createCriteria(ExtensionPO.class).add(Restrictions.eq("qid", qid)).add(Restrictions.eq("type", type)).add(Restrictions.eq("atttype", atttype)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int deleteExtension(String orderId) {
		String sql = "delete from quotation.extension where orderId = :orderId";
		session().createSQLQuery(sql).setString("orderId", orderId).executeUpdate();

		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (ExtensionPO.COLUMN_ORDERID_STR.equals(field)) {
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
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", "createTime", data);
			} else if ("decorationOrderStatus".equals(field)) {
				query.alias("decoration", "decoration");
				query.add(query.getCriterion("decoration.status", Short.valueOf(data), op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			}
		}
	}
}
