package com.fanglin.customer.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerUserRuleDao;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.utils.Paging;

@Repository("customerUserRuleDao")
public class CustomerUserRuleDaoImpl extends DaoImpl<CustomerUserRulePO> implements CustomerUserRuleDao {

	public CustomerUserRuleDaoImpl() {
		super(CustomerUserRulePO.class);
	}

	@Override
	public List<CustomerUserRulePO> pageCustomerUserRule(Paging paging, List<Filter> filters, int company) {

		PagingQuery<CustomerUserRulePO> query = pagingQuery(paging, CustomerUserRulePO.class);

		query.add(Restrictions.eq(CustomerUserRulePO.COLUMN_COMPANY_STR, company));

		queryFilterExcute(query, filters);

		query.desc("chance");

		return query.list();
	}

	@Override
	public CustomerUserRulePO queryCustomerUserRule(Integer uid) {
		return (CustomerUserRulePO) session().createCriteria(CustomerUserRulePO.class).createAlias("user", "user").add(Restrictions.eq("user.uid", uid)).add(Restrictions.eq("status", CustomerUserRulePO.STATUS_ENABLE_INT)).setMaxResults(1).uniqueResult();
	}

	@Override
	public CustomerUserRulePO pullCustomerUserRule(int company) {
		return (CustomerUserRulePO) session().createCriteria(CustomerUserRulePO.class).add(Restrictions.ge("surplus", 1000)).add(Restrictions.eq("company", company)).addOrder(Order.desc("surplus")).add(Restrictions.eq("status", CustomerUserRulePO.STATUS_ENABLE_INT)).setMaxResults(1).uniqueResult();
	}

	@Override
	public CustomerUserRulePO pullCustomerUserRule(int company, int area) {

		String sql = "select cur.* from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.surplus >= 1000 and cur.status = 0 and curi.uppval < :uppval and curi.lowval >= :lowval order by cur.surplus desc limit 1";

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(CustomerUserRulePO.class);

		query.setInteger("company", company).setInteger("uppval", area).setInteger("lowval", area);

		return (CustomerUserRulePO) query.uniqueResult();
	}

	@Override
	public int existCustomerUserRule(int company, int area) {

		String sql = "select count(*) from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.status in (0 ,1) and curi.uppval < :uppval and curi.lowval >= :lowval";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("company", company).setInteger("uppval", area).setInteger("lowval", area).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countCustomerUserRule(int company) {

		String sql = "select count(*) from customer.customeruserrule where surplus >= 1000 and company = :company and status = 0";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("company", company).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countCustomerUserRule(int company, int area) {

		String sql = "select count(*) from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.surplus >= 1000 and cur.status = 0 and curi.uppval < :uppval and curi.lowval >= :lowval";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("company", company).setInteger("uppval", area).setInteger("lowval", area).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int pollingCustomerUserRule(int company) {

		String sql = "update customer.customeruserrule set surplus = surplus + chance, polling = polling + 1000 where company = :company and status in (0, 1)";
		session().createSQLQuery(sql).setInteger("company", company).executeUpdate();

		return 0;
	}

	@Override
	public int disableCustomerUserRule(int company) {

		String sql = "update customer.customeruserrule set status = 2, finishtime = CURRENT_TIMESTAMP where company = :company";
		session().createSQLQuery(sql).setInteger("company", company).executeUpdate();

		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.contains("user")) {
				query.alias("user", "user");
			}

			if (field.contains("dept")) {
				query.alias("user.dept", "dept");
			}

			if ("user".equals(field)) {
				query.add(query.getCriterion(CustomerUserRulePO.COLUMN_USER_STR, data, op));
			} else if ("creater".equals(field)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion(CustomerUserRulePO.COLUMN_CREATER_STR, data, op));
			} else if ("createTime".equals(field)) {
				query.timeranges(CustomerUserRulePO.COLUMN_CREATETIME_STR, CustomerUserRulePO.COLUMN_CREATETIME_STR, data);
			} else if ("finishTime".equals(field)) {
				query.timeranges(CustomerUserRulePO.COLUMN_FINISHTIME_STR, CustomerUserRulePO.COLUMN_FINISHTIME_STR, data);
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(CustomerUserRulePO.COLUMN_STATUS_STR, Short.valueOf(data), op));
			} else if ("company".equals(field)) {
				query.add(query.getCriterion(CustomerUserRulePO.COLUMN_COMPANY_STR, Integer.valueOf(data), op));
			} else if ("user.dept".equals(field)) {
				query.add(query.getCriterion("dept.no", data, op));
			} else if ("user.dept.fatherDept".equals(field)) {
				query.alias("dept.fatherDept", "fatherDept");
				query.add(query.getCriterion("fatherDept.no", data, op));
			}
		}
	}

}
