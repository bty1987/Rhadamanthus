package com.fanglin.customer.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.utils.Paging;

@Repository("customerSourceDao")
public class CustomerSourceDaoImpl extends DaoImpl<CustomerSourcePO> implements CustomerSourceDao {

	public CustomerSourceDaoImpl() {
		super(CustomerSourcePO.class);
	}

	@Override
	public List<CustomerSourcePO> pageCustomerSource(Paging paging, List<Filter> filters, int company) {

		PagingQuery<CustomerSourcePO> query = pagingQuery(paging, CustomerSourcePO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("csid");

		return query.list();
	}

	@Override
	public CustomerSourcePO queryCustomerSource(int uid, String phone, int company) {
		return (CustomerSourcePO) session().createCriteria(CustomerSourcePO.class).createAlias("creater", "creater").add(Restrictions.eq("creater.uid", uid)).add(Restrictions.in("phone", SensitiveDataHelper.getAllEncryptedForms(phone))).add(Restrictions.eq("company", company)).add(Restrictions.ne("status", CustomerSourcePO.STATUS_DISABLE_INT)).addOrder(Order.desc("createTime")).setMaxResults(1).uniqueResult();
	}

	@Override
	public CustomerSourcePO queryCustomerSource(int uid, String houseNumber, long vid, int company) {
		return (CustomerSourcePO) session().createCriteria(CustomerSourcePO.class).createAlias("creater", "creater").add(Restrictions.eq("creater.uid", uid))
			.add(Restrictions.disjunction().add(Restrictions.eq("houseNumber", houseNumber)).add(Restrictions.eq("houseNumber", SensitiveDataHelper.decrypt(houseNumber))))
			.add(Restrictions.eq("village.vid", vid)).add(Restrictions.ne("status", CustomerSourcePO.STATUS_DISABLE_INT)).add(Restrictions.eq("company", company)).addOrder(Order.desc("createTime")).setMaxResults(1).uniqueResult();
	}

	@Override
	public CustomerSourcePO queryCustomerSourceByNo(String no) {
		return (CustomerSourcePO) session().createCriteria(CustomerSourcePO.class).add(Restrictions.eq("no", no)).add(Restrictions.ne("status", CustomerSourcePO.STATUS_DISABLE_INT)).addOrder(Order.desc("createTime")).setMaxResults(1).uniqueResult();
	}
	
	@Override
	public Integer countCustomerSource(int uid, String phone, int company) {

		String sql = "SELECT count(1) as count FROM customer.customersource sc, customer.customerchance cc WHERE sc.csid = cc.csid AND cc.buid = :buid AND sc.company = :company AND sc.phone = :phone limit 1";

		SQLQuery query = session().createSQLQuery(sql.toString());

		query.setInteger("company", company).setString("phone", phone).setInteger("buid", uid);

		return ((BigInteger) query.uniqueResult()).intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.contains("user")) {
				query.alias("creater", "creater");
			}

			if (field.contains("dept")) {
				query.alias("creater.dept", "dept");
			}

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("phone".equals(field)) {
				query.add(query.getCriterion("phone", data, op));
			} else if ("creater".equals(field)) {
				query.add(Restrictions.eq(CustomerSourcePO.COLUMN_CREATER_STR, Integer.valueOf(data)));
			} else if ("designer".equals(field)) {
				query.add(Restrictions.eq(CustomerSourcePO.COLUMN_DESIGNER_STR, Integer.valueOf(data)));
			} else if ("salesman".equals(field)) {
				query.add(Restrictions.eq(CustomerSourcePO.COLUMN_SALESMAN_STR, Integer.valueOf(data)));
			} else if ("customertype".equals(field)) {
				query.add(query.getCriterion("customertype", Short.valueOf(data), op));
			} else if ("houseAttr".equals(field)) {
				query.add(query.getCriterion("houseAttr", Short.valueOf(data), op));
			} else if ("demand".equals(field)) {
				query.add(query.getCriterion("demand", Short.valueOf(data), op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("village".equals(field)) {
				query.alias("village", "village");
				query.add(query.getCriterion("village.no", String.valueOf(data), op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("user.userId".equals(field)) {
				query.add(query.getCriterion("creater.userId", data, op));
			} else if ("user.dept".equals(field)) {
				query.add(query.getCriterion("dept.no", data, op));
			} else if ("user.dept.fatherDept".equals(field)) {
				query.alias("dept.fatherDept", "fatherDept");
				query.add(query.getCriterion("fatherDept.no", data, op));
			} else if ("source".equals(field)) {
				query.add(query.getCriterion("source", data, op));
			} else if ("contact".equals(field)) {
				query.add(query.getCriterion("contact", data, op));
			} else if ("referOrderId".equals(field)) {
				query.add(query.getCriterion("referOrderId", data, op));
			}
		}

	}

}
