/**
 * @File Name		: QuotationDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
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
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationDO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.Paging;

@Repository("quotationDao")
public class QuotationDaoImpl extends DaoImpl<QuotationPO> implements QuotationDao {

	public QuotationDaoImpl() {
		super(QuotationPO.class);
	}

	@Override
	public List<QuotationDO> pageQuotation(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<QuotationDO> query = pagingQuery(paging, QuotationDO.class);

		// if (company != null) query.alias("decoration", "decoration").add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationPO> queryQuotationByOrderId(String orderId) {
		return createCriteria(QuotationPO.class).add(Restrictions.eq("orderId", orderId)).addOrder(Order.desc("createTime")).list();
	}

	@Override
	public QuotationPO queryQuotationForDefaultByOrderId(String orderId) {
		return (QuotationPO) createCriteria(QuotationPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq("defaults", QuotationPO.DEFAULTS_DEFAULT_INT)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int countQuotationByOrderId(String orderId, short status) {

		String sql = "select count(*) from quotation.quotation where orderId = :orderId and status = :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setShort("status", status).uniqueResult();

		return count.intValue();
	}

	@Override
	public int updateQuotationForStatusByOrderId(String orderId, short status) {
		String hql = "update  QuotationPO set status = :status where orderId = :orderId";
		session().createQuery(hql).setShort("status", status).setString("orderId", orderId).executeUpdate();

		return 0;
	}

	@Override
	public int countQuotationByOrderId(String orderId) {

		String sql = "select count(*) from quotation.quotation where orderId = :orderId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return count.intValue();
	}

	@Override
	public int clearQuotationForDefaultByOrderId(String orderId) {

		String sql = "update quotation.quotation q set q.defaults = 0 where q.orderId = :orderId";
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
