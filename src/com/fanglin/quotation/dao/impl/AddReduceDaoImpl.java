/**
 * @File Name		: AddReduceDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.po.AddReduceDO;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.Paging;

@Repository("addReduceDao")
public class AddReduceDaoImpl extends DaoImpl<AddReducePO> implements AddReduceDao {

	public AddReduceDaoImpl() {
		super(AddReducePO.class);
	}

	@Override
	public List<AddReduceDO> pageAddReduce(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<AddReduceDO> query = pagingQuery(paging, AddReduceDO.class);

		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	@Override
	public List<AddReducePO> pageAddReduce(Paging paging, List<Filter> filters, String orderId) {

		PagingQuery<AddReducePO> query = pagingQuery(paging, AddReducePO.class);

		query.add(query.getCriterion(AddReducePO.COLUMN_ORDERID_STR, orderId, "eq"));

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AddReducePO> queryAddReduce(String orderId, List<Short> statuses) {

		Criteria query = session().createCriteria(AddReducePO.class).add(Restrictions.eq(AddReducePO.COLUMN_ORDERID_STR, orderId));

		if (statuses != null && statuses.size() != 0) {
			query.add(Restrictions.in(AddReducePO.COLUMN_STATUS_STR, statuses));
		}

		return query.list();
	}

	public List<AddReducePO> queryAddReduceByOrderId(String orderId) {
		return queryAddReduce(orderId, null);
	}

	@Override
	public AddReducePO queryAddReduce(Long decorationPaymentId) {
		return (AddReducePO) createCriteria(AddReducePO.class).add(Restrictions.eq(AddReducePO.COLUMN_DPID_STR, decorationPaymentId)).uniqueResult();
	}

	@Override
	public int countAddReduceByOrderId(String orderId) {

		String sql = "select count(*) from quotation.addreduce where orderId = :orderId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		query.alias("decoration", "decoration");
		if (filters == null || filters.size() == 0) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.startsWith("village")) {
				query.alias("decoration.house", "house");
				query.alias("house.village", "village");
			}

			if (AddReducePO.COLUMN_ORDERID_STR.equals(field)) {
				query.alias("decoration", "decoration");
				query.add(query.getCriterion("decoration.orderId", data, op));
			} else if (AddReducePO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			} else if (AddReducePO.COLUMN_TYPE_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			} else if (AddReducePO.COLUMN_PAYTYPE_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			} else if ("designerId".equals(field)) {
				query.alias("decoration.designer", "designer");
				query.add(query.getCriterion("designer.userId", data, op));
			} else if ("buildArea".equals(field)) {
				int dataF = Integer.parseInt(data);
				query.alias("decoration.house", "house");
				query.add(query.getCriterion("house.buildArea", Arith.mul(dataF, 1000000), op));
			} else if ("houseNumber".equals(field)) {
				query.alias("decoration.house", "house");
				query.add(query.getCriterion("house.houseNumber", data, op));
			} else if ("villageId".equals(field)) {
				query.add(query.getCriterion("village.no", data, op));
			}
		}
	}
}
