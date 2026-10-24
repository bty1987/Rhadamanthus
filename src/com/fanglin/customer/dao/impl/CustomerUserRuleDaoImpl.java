package com.fanglin.customer.dao.impl;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.hibernate.type.StandardBasicTypes;
import org.hibernate.type.Type;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerUserRuleDao;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.po.RolePO;
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
		return (CustomerUserRulePO) session().createCriteria(CustomerUserRulePO.class).createAlias("user", "user").add(Restrictions.eq("user.uid", uid)).add(Restrictions.ne("status", CustomerUserRulePO.STATUS_DISABLE_INT)).setMaxResults(1).uniqueResult();
	}

	@Override
	public List<UserPO> queryCustomerUserRuleByPinyin(Paging paging, String pinyin, Short status, Integer company, Integer dtid, Integer did, Integer rid) {

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);

		if (company != null) {
			query.add(Restrictions.eq("company", company));
		}

		query.add(Restrictions.eq("type", UserPO.TYPE_USER_INT));

		query.alias("role", "role");
		query.alias("dept", "dept");
		query.alias("dept.type", "dept.type");

		if (StringUtils.isNotEmpty(pinyin)) {

			Disjunction disjunction = Restrictions.disjunction();

			disjunction.add(Restrictions.like("currentName", pinyin, MatchMode.ANYWHERE));
			disjunction.add(Restrictions.like("pinYin", pinyin, MatchMode.ANYWHERE));
			disjunction.add(Restrictions.like("userId", pinyin, MatchMode.ANYWHERE));

			query.add(disjunction);
		}

		query.add(Restrictions.ne("role.no", RolePO.SUPER_NO_STR));

		if (dtid != 0) {
			query.add(Restrictions.eq("dept.type.dtid", dtid));
		}

		if (did != null) {
			query.add(Restrictions.eq("dept.did", did));
		}

		if (rid != null) {
			query.alias("dept.fatherDept", "fatherDept").add(Restrictions.eq("fatherDept.did", rid));
		}

		if (status != 3) {
			query.add(Restrictions.eq("status", status));
		}

		if (company != null) {
			query.add(Restrictions.sqlRestriction("not exists (select 1 from customer.customeruserrule cur where cur.uid = {alias}.uid and cur.company = ? and cur.status = ?)", new Object[] { company, CustomerUserRulePO.STATUS_ADVANCE_INVALID_INT }, new Type[] { StandardBasicTypes.INTEGER, StandardBasicTypes.SHORT }));
		} else {
			query.add(Restrictions.sqlRestriction("not exists (select 1 from customer.customeruserrule cur where cur.uid = {alias}.uid and cur.status = ?)", CustomerUserRulePO.STATUS_ADVANCE_INVALID_INT, StandardBasicTypes.SHORT));
		}

		return query.list();
	}

	@Override
	public CustomerUserRulePO pullCustomerUserRule(int company) {
		return (CustomerUserRulePO) session().createCriteria(CustomerUserRulePO.class).add(Restrictions.ge("surplus", 1000)).add(Restrictions.eq("company", company)).addOrder(Order.desc("surplus")).add(Restrictions.in("status", new Short[] { CustomerUserRulePO.STATUS_ENABLE_INT, CustomerUserRulePO.STATUS_ADVANCE_ENABLE_INT })).setMaxResults(1).uniqueResult();
	}

	@Override
	public CustomerUserRulePO pullCustomerUserRule(int company, int area, List<Integer> uids) {

		if (uids == null) uids = new ArrayList<Integer>();

		uids.add(0);

		String sql = "select cur.* from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.status in (0, 6) and curi.status = 0 and curi.uppval < :uppval and curi.lowval >= :lowval and TIMEDIFF(now(), cur.updateTime) > '00:05:00' AND cur.uid NOT IN :uids order by curi.priority desc, cur.surplus desc limit 1";

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(CustomerUserRulePO.class);

		query.setInteger("company", company).setInteger("uppval", area).setInteger("lowval", area).setParameterList("uids", uids);

		return (CustomerUserRulePO) query.uniqueResult();
	}

	@Override
	public int existCustomerUserRule(int company, int area) {

		String sql = "select count(*) from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.status != 4 and curi.uppval < :uppval and curi.lowval >= :lowval";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("company", company).setInteger("uppval", area).setInteger("lowval", area).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countCustomerUserRule(int company) {

		String sql = "select count(*) from customer.customeruserrule where company = :company and status = 0";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("company", company).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countCustomerUserRule(int company, int area) {

		String sql = "select count(*) from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.status in (0, 6) and curi.uppval < :uppval and curi.lowval >= :lowval";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("company", company).setInteger("uppval", area).setInteger("lowval", area).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int pollingCustomerUserRule(int company) {

		String sql = "update customer.customeruserrule set surplus = surplus + chance, polling = polling + 1000 where company = :company and status != 4";
		session().createSQLQuery(sql).setInteger("company", company).executeUpdate();

		return 0;
	}

	@Override
	public int disableCustomerUserRule(int company) {

		String sql = "update customer.customeruserrule set status = 4, finishtime = CURRENT_TIMESTAMP where company = :company";
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
