/**
 * @File Name		: DecorationActivityItemDaoImpl.java
 * @Package   	: com.fanglin.decoration.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.Paging;
import com.fanglin.utils.DateUtil;

@Repository("decorationActivityItemDao")
public class DecorationActivityItemDaoImpl extends DaoImpl<DecorationActivityItemPO> implements DecorationActivityItemDao {

	public DecorationActivityItemDaoImpl() {
		super(DecorationActivityItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationActivityItemPO> queryDecorationActivityItemByOrderId(String orderId) {
		return session().createCriteria(DecorationActivityItemPO.class).add(Restrictions.eq(DecorationActivityItemPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationActivityItemPO> queryDecorationActivityItemByOrderId(String orderId, short type, short status) {
		return session().createCriteria(DecorationActivityItemPO.class).add(Restrictions.eq(DecorationActivityItemPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(DecorationActivityItemPO.COLUMN_TYPE_STR, type)).add(Restrictions.eq(DecorationActivityItemPO.COLUMN_STATUS_STR, status)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationActivityItemPO> queryDecorationActivityItem(String orderId, String no) {
		return session().createCriteria(DecorationActivityItemPO.class).add(Restrictions.eq(DecorationActivityItemPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq("no", no)).list();
	}

	@Override
	public long amountDecorationActivityItem(String orderId, short isPayment) {

		String sql = "SELECT COALESCE(SUM(money*num), 0) as priceSum FROM decoration.decorationActivityitem WHERE orderId =:orderId AND type = 0 AND isPayment =:isPayment AND ((atttype = 0 AND state = 0) OR (atttype = 1 AND state IN (2, 10)))";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).setShort("isPayment", isPayment).uniqueResult();

		return Arith.div(sqlQuery.longValue(), 1000000);
	}

	@Override
	public long amountDecorationActivityItem(String orderId, Short type, Short isPrefor, Short isPayment) {

		StringBuffer sql = new StringBuffer();

		sql.append("SELECT COALESCE(SUM(money*num), 0) AS priceSum FROM decoration.decorationActivityitem WHERE orderId = :orderId AND ((atttype = 0 and state in (:state)) OR (atttype = 1 and state IN (2, 10)))");

		if (type != null) {
			sql.append(" AND type = :type");
		}

		if (isPrefor != null) {
			sql.append(" AND isPrefor = :isPrefor");
		}

		if (isPayment != null) {
			sql.append(" AND isPayment = :isPayment");
		}

		SQLQuery sqlQuery = session().createSQLQuery(sql.toString());

		sqlQuery.setString("orderId", orderId);

		if (type != null) {
			sqlQuery.setShort("type", type);
		}

		if (isPrefor != null) {
			sqlQuery.setShort("isPrefor", isPrefor);
		}

		if (isPayment != null) {
			sqlQuery.setShort("isPayment", isPayment);
		}

		List<Short> states = Arrays.asList(DecorationActivityItemPO.STATUS_INIT_INT, DecorationActivityItemPO.STATUS_RECEIVE_INT, DecorationActivityItemPO.STATUS_DELIVERY_INT, DecorationActivityItemPO.STATUS_WAIT_INT, DecorationActivityItemPO.STATUS_UPGRADE_INT, DecorationActivityItemPO.STATUS_VERIFY_INT);

		sqlQuery.setParameterList("state", states);

		BigDecimal amount = (BigDecimal) sqlQuery.setMaxResults(1).uniqueResult();

		return Arith.div(amount.longValue(), 1000000);
	}

	@Override
	public long amountDecorationActivityItem(String orderId, Short type, List<Short> states, Short isPrefor, Short isPayment) {

		StringBuffer sql = new StringBuffer();

		sql.append("SELECT COALESCE(SUM(money*num), 0) AS priceSum FROM decoration.decorationActivityitem WHERE orderId =:orderId");

		if (type != null) {
			sql.append(" AND type = :type");
		}

		if (states != null) {
			sql.append(" AND state IN (:state)");
		}

		if (isPrefor != null) {
			sql.append(" AND isPrefor = :isPrefor");
		}

		if (isPayment != null) {
			sql.append(" AND isPayment = :isPayment");
		}

		SQLQuery sqlQuery = session().createSQLQuery(sql.toString());

		sqlQuery.setString("orderId", orderId);

		if (type != null) {
			sqlQuery.setShort("type", type);
		}

		if (states != null) {
			sqlQuery.setParameterList("state", states);
		}

		if (isPrefor != null) {
			sqlQuery.setShort("isPrefor", isPrefor);
		}

		if (isPayment != null) {
			sqlQuery.setShort("isPayment", isPayment);
		}

		BigDecimal amount = (BigDecimal) sqlQuery.setMaxResults(1).uniqueResult();

		return Arith.div(amount.longValue(), 1000000);
	}

	@Override
	public long pointDecorationActivityItem(String orderId) {

		String sql = "select COALESCE(SUM(money * num), 0) as priceSum from decoration.decorationActivityitem dai, information.activity a where dai.orderId = :orderId and dai.aid = a.aid and a.atttype = 1 and dai.state = 1";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return Arith.div(sqlQuery.longValue(), 1000000);
	}

	@Override
	public long countDecorationActivityItem(String orderId, Short type, List<Short> states, Short isPrefor, Short isPayment) {

		StringBuffer sql = new StringBuffer();

		// 使用 COUNT(*) 统计数量
		sql.append("SELECT COUNT(*) FROM decoration.decorationActivityitem WHERE orderId =:orderId");

		if (type != null) {
			sql.append(" AND type = :type");
		}

		if (states != null) {
			sql.append(" AND state IN (:state)");
		}

		if (isPrefor != null) {
			sql.append(" AND isPrefor = :isPrefor");
		}

		if (isPayment != null) {
			sql.append(" AND isPayment = :isPayment");
		}

		SQLQuery sqlQuery = session().createSQLQuery(sql.toString());

		sqlQuery.setString("orderId", orderId);

		if (type != null) {
			sqlQuery.setShort("type", type);
		}

		if (states != null) {
			sqlQuery.setParameterList("state", states);
		}

		if (isPrefor != null) {
			sqlQuery.setShort("isPrefor", isPrefor);
		}

		if (isPayment != null) {
			sqlQuery.setShort("isPayment", isPayment);
		}

		// COUNT(*) 返回 BigInteger 或 Long
		Object result = sqlQuery.setMaxResults(1).uniqueResult();
		if (result == null) {
			return 0L;
		}

		// 处理不同类型的返回值
		if (result instanceof BigDecimal) {
			return ((BigDecimal) result).longValue();
		} else if (result instanceof Number) {
			return ((Number) result).longValue();
		}

		return 0L;
	}

	@Override
	public int countDecorationActivityItem(String orderId, short atttype) {

		String sql = "SELECT COUNT(*) FROM decoration.decorationactivityitem WHERE orderId = :orderId AND atttype = :atttype AND state <> :state";

		Object result = session().createSQLQuery(sql).setString("orderId", orderId).setShort("atttype", atttype).setShort("state", DecorationActivityItemPO.STATUS_UNVALID_INT).setMaxResults(1).uniqueResult();

		if (result == null) return 0;

		if (result instanceof BigDecimal) return ((BigDecimal) result).intValue();
		if (result instanceof Number) return ((Number) result).intValue();

		return 0;
	}

	@Override
	public long countDecorationActivityItem(String no) {

		String sql = "SELECT COUNT(*) FROM decoration.decorationactivityitem WHERE no = :no AND state <> :state";

		Object result = session().createSQLQuery(sql).setString("no", no).setShort("state", DecorationActivityItemPO.STATUS_UNVALID_INT).setMaxResults(1).uniqueResult();

		if (result == null) return 0L;

		if (result instanceof BigDecimal) return ((BigDecimal) result).longValue();
		if (result instanceof Number) return ((Number) result).longValue();

		return 0L;
	}

	@Override
	public int banchDecorationActivityItem(String orderId, short atttype, short targetState, List<Short> excludeStates, long receiverId) {

		StringBuffer sql = new StringBuffer();

		sql.append("update decoration.decorationactivityitem set state = :state, ruid = :ruid, receiveTime = :receiveTime, content = :content");
		sql.append(" where orderId = :orderId and atttype = :atttype and state = :initState");

		if (excludeStates != null && !excludeStates.isEmpty()) {
			sql.append(" and state not in (:excludeStates)");
		}

		SQLQuery sqlQuery = session().createSQLQuery(sql.toString());

		sqlQuery.setShort("state", targetState);
		sqlQuery.setLong("ruid", receiverId);
		sqlQuery.setTimestamp("receiveTime", DateUtil.getDateToTimestamp(new Date()));
		sqlQuery.setString("content", "签约自动核销");
		sqlQuery.setString("orderId", orderId);
		sqlQuery.setShort("atttype", atttype);
		sqlQuery.setShort("initState", DecorationActivityItemPO.STATUS_INIT_INT);

		if (excludeStates != null && !excludeStates.isEmpty()) {
			sqlQuery.setParameterList("excludeStates", excludeStates);
		}

		return sqlQuery.executeUpdate();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationActivityItemPO> queryDecorationActivityItemForLottery(String orderId, List<Long> asids) {
		return session().createCriteria(DecorationActivityItemPO.class)
				.add(Restrictions.eq(DecorationActivityItemPO.COLUMN_ORDERID_STR, orderId))
				.add(Restrictions.eq(DecorationActivityItemPO.COLUMN_TYPE_STR, DecorationActivityItemPO.TYPE_COUPON_INT))
				.add(Restrictions.eq(DecorationActivityItemPO.COLUMN_STATUS_STR, DecorationActivityItemPO.STATUS_INIT_INT))
				.add(Restrictions.in("asid", asids))
				.addOrder(Order.desc("daiId")).list();
	}

	@Override
	public int countDecorationActivityItemForLottery(String orderId, List<Long> asids) {

		String sql = "select count(*) from decoration.decorationactivityitem where orderId = :orderId and type = :type and asid in (:asids) and state not in (:excludeStates)";

		BigInteger count = (BigInteger) session().createSQLQuery(sql)
				.setString("orderId", orderId)
				.setShort("type", DecorationActivityItemPO.TYPE_COUPON_INT)
				.setParameterList("asids", asids)
				.setParameterList("excludeStates", Arrays.asList(DecorationActivityItemPO.STATUS_UNVALID_INT, DecorationActivityItemPO.STATUS_RETREAT_INT))
				.uniqueResult();

		return count.intValue();
	}

	@Override
	public List<DecorationActivityItemPO> pageDecorationActivityItem(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<DecorationActivityItemPO> query = pagingQuery(paging, DecorationActivityItemPO.class);

		queryFilterExcute(query, filters);

		query.desc("daiId");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<DecorationActivityItemPO> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		for (Filter filter : filters) {

			if ("decorationActivityItem.orderId".equals(filter.getField())) {
				query.add(query.getCriterion("orderId", filter.getData(), "eq"));
			} else if ("decorationActivityItem.no".equals(filter.getField())) {
				query.add(query.getCriterion("no", filter.getData(), "eq"));
			} else if ("decorationActivityItem.activityName".equals(filter.getField())) {
				query.add(query.getCriterion("activityName", filter.getData(), "like"));
			} else if ("decorationActivityItem.activityItemName".equals(filter.getField())) {
				query.add(query.getCriterion("activityItemName", filter.getData(), "like"));
			} else if ("decorationActivityItem.state".equals(filter.getField())) {
				query.add(query.getCriterion("state", filter.getData(), "eq"));
			} else if ("decorationActivityItem.atttype".equals(filter.getField())) {
				query.add(query.getCriterion("atttype", filter.getData(), "eq"));
			}
			else if ("decorationActivityItem.type".equals(filter.getField())) {
				query.add(query.getCriterion("type", filter.getData(), "eq"));
			}
		}
	}
}
