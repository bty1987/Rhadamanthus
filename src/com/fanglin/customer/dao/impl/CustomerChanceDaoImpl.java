package com.fanglin.customer.dao.impl;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.Paging;

@Repository("customerChanceDao")
public class CustomerChanceDaoImpl extends DaoImpl<CustomerChancePO> implements CustomerChanceDao {

	public CustomerChanceDaoImpl() {
		super(CustomerChancePO.class);
	}

	@Override
	public List<CustomerChancePO> pageCustomerChance(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<CustomerChancePO> query = pagingQuery(paging, CustomerChancePO.class);

		if (company != null) {
			query.add(query.getCriterion("company", company, "eq"));
		}

		queryFilterExcute(query, filters);

		query.desc("ccid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerChancePO> queryCustomerChance(long csid) {
		return session().createCriteria(CustomerChancePO.class).createAlias("source", "source").add(Restrictions.eq("source.csid", csid)).list();
	}

	@Override
	public CustomerChancePO queryCustomerChance(long csid, int company) {

		List<Short> statuses = Arrays.asList(CustomerChancePO.STATUS_INIT_INT, CustomerChancePO.STATUS_APPROVE_INT, CustomerChancePO.STATUS_CONFIRM_INT, CustomerChancePO.STATUS_COMPLETE_INT);

		return (CustomerChancePO) session().createCriteria(CustomerChancePO.class).createAlias("source", "source").add(Restrictions.eq("source.csid", csid)).add(Restrictions.eq("company", company)).add(Restrictions.in("status", statuses)).setMaxResults(1).uniqueResult();
	}

	@Override
	public CustomerChancePO queryCustomerChance(String orderId) {
		return (CustomerChancePO) session().createCriteria(CustomerChancePO.class).add(Restrictions.eq("orderId", orderId)).setMaxResults(1).uniqueResult();
	}

	@Override
	public CustomerChancePO queryCustomerChanceByCno(String cno) {
		return (CustomerChancePO) session().createCriteria(CustomerChancePO.class).add(Restrictions.eq("cno", cno)).add(Restrictions.ne("status", CustomerChancePO.STATUS_DISABLE_INT)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int countCustomerSchance(long csid) {

		String sql = "select count(*) from customer.customerchance cc where cc.csid = :csid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("csid", csid).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.contains("dept")) {
				query.alias("department", "department");
			}

			if (field.contains("house")) {
				query.alias("house", "house");
			}

			if (field.contains("village")) {
				query.alias("house.village", "village");
			}

			if (field.contains("customer")) {
				query.alias("customer", "customer");
			}

			if (field.contains("source")) {
				query.alias("source", "source");

				if (field.contains("creater")) {
					query.alias("source.creater", "designer");
				}

				if (field.contains("dept")) {
					query.alias("designer.dept", "designerDept");
				}
			}

			if (field.contains("belonger")) {
				query.alias("belonger", "salesman");

				if (field.contains("dept")) {
					query.alias("salesman.dept", "salesmanDept");
				}
			}

			if (field.contains("finer")) {
				query.alias("finer", "finer");
			}

			if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("user.userId".equals(field)) {
				query.alias("belonger", "belonger");
				query.add(query.getCriterion("belonger.userId", data, op));
			} else if ("user.dept".equals(field)) {
				query.add(query.getCriterion("department.no", data, op));
			} else if ("user.dept.fatherDept".equals(field)) {
				query.alias("department.fatherDept", "fatherDept");
				query.add(query.getCriterion("fatherDept.no", data, op));
			} else if ("source.csid".equals(field)) {
				query.add(query.getCriterion("source.csid", Long.valueOf(data), op));
			} else if ("source.name".equals(field)) {
				query.add(query.getCriterion("source.name", data, op));
			} else if ("source.buildArea".equals(field)) {
				int dataF = Integer.parseInt(data);
				query.add(query.getCriterion("source.buildArea", Arith.mul(dataF, 1000000), op));
			} else if ("source.houseAttr".equals(field)) {
				query.add(query.getCriterion("source.houseAttr", Short.valueOf(data), op));
			} else if ("source.creater".equals(field)) {
				query.add(query.getCriterion("designer.userId", data, op));
			} else if ("source.creater.dept".equals(field)) {
				query.add(query.getCriterion("designerDept.no", data, op));
			} else if ("belonger".equals(field)) {
				query.add(query.getCriterion("salesman.userId", data, op));
			} else if ("belonger.dept".equals(field)) {
				query.add(query.getCriterion("salesmanDept.no", data, op));
			} else if ("customer.phone".equals(field)) {
				query.add(query.getCriterion("customer.phone", data, op));
			} else if ("house.village.no".equals(field)) {
				query.add(query.getCriterion("village.no", data, op));
			} else if ("house.houseNumber".equals(field)) {
				query.add(query.getCriterion("house.houseNumber", data, op));
			} else if ("orderId".equals(field)) {
				query.add(query.getCriterion("orderId", data, op));
			} else if ("finer".equals(field)) {
				query.add(query.getCriterion("finer.userId", data, op));
			} else if ("fineTime".equals(field)) {
				query.timeranges("fineTime", data);
			} else if ("isFine".equals(field)) {
				query.add(query.getCriterion("isFine", Short.valueOf(data), op));
			} else if ("source.createTime".equals(field)) {
				query.timeranges("source.createTime", data);
			}
		}
	}
}
