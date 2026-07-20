/**
 * @File Name		: ProtationDaoImpl.java
 * @Package   	: com.fanglin.quotation.dao.impl
 * @Version		: 1.0
 * @Date			: 2021-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.ProtationDao;
import com.fanglin.quotation.po.ProtationDO;
import com.fanglin.quotation.po.ProtationPO;
import com.fanglin.utils.Paging;

@Repository("protationDao")
public class ProtationDaoImpl extends DaoImpl<ProtationPO> implements ProtationDao {

	public ProtationDaoImpl() {
		super(ProtationPO.class);
	}

	@Override
	public List<ProtationDO> pageProtation(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<ProtationDO> query = pagingQuery(paging, ProtationDO.class);

		query.alias("decoration", "decoration");

		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProtationPO> queryProtationByOrderId(String orderId) {
		return createCriteria(ProtationPO.class).add(Restrictions.eq("orderId", orderId)).addOrder(Order.desc("createTime")).list();
	}

	@Override
	public ProtationPO queryProtationForDefaultByOrderId(String orderId) {
		return (ProtationPO) createCriteria(ProtationPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq("defaults", ProtationPO.DEFAULT_DEFAULT_INT)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int countProtationByOrderId(String orderId) {

		String sql = "select count(*) from quotation.protation where orderId = :orderId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return count.intValue();
	}

	@Override
	public int clearProtationForDefaultByOrderId(String orderId) {

		String sql = "update quotation.protation p set p.defaults = 0 where p.orderId = :orderId";
		session().createSQLQuery(sql).setString("orderId", orderId).executeUpdate();

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
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", "createTime", data);
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			}
		}
	}

}
