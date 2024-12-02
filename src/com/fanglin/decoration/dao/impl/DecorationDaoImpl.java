/**
 * @File Name		: DecorationDaoImpl
 * @Package   	: com.fanglin.dao.impl.decoration
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.util.Arrays;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.Arith;
import com.fanglin.utils.Paging;

@Repository("decoratioDao")
public class DecorationDaoImpl extends DaoImpl<DecorationPO> implements DecorationDao {

	public DecorationDaoImpl() {
		super(DecorationPO.class);
	}

	@Override
	public List<DecorationPO> pageDecoration(Paging paging, List<Filter> filters, Integer company) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		if (company != null) {
			query.add(query.getCriterion("company", company, "eq"));
		}

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecoration(Paging paging, List<Filter> filters, List<Integer> designDepartmentIds, List<Short> statuses, Integer company) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		if (company != null) {
			query.add(query.getCriterion("company", company, "eq"));
		}

		if (designDepartmentIds != null && designDepartmentIds.size() > 0) {
			query.alias("designer", "designer");
			query.alias("designer.dept", "designerDept");
			query.add(Restrictions.in("designerDept.did", designDepartmentIds));
		}

		if (statuses != null && statuses.size() > 0) {
			query.add(Restrictions.in("status", statuses));
		}

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecorationForCompany(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecorationForGeneral(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		List<Short> nostatus = Arrays.asList(DecorationPO.STATUS_TERMINATION_INT, DecorationPO.STATUS_WASTE_INT);

		query.add(Restrictions.not(Restrictions.in("status", nostatus)));

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecorationForGrade(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		query.add(query.getCriterion("company", company, "eq"));
		query.add(query.getCriterion("grade", "A", "eq"));// 默认 等级条件 A

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecorationForDesign(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecorationForDesignDept(Paging paging, List<Filter> filters, List<Integer> dids, int company) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		if (dids != null && dids.size() > 0) {
			query.alias("designDept", "designDept");
			query.add(Restrictions.in("designDept.did", dids));
		}

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecorationForDesignerManager(Paging paging, List<Filter> filters, List<Integer> dids, List<Short> statuses, int company) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		if (dids != null && dids.size() > 0) {
			query.alias("designer", "designer");
			query.alias("designer.dept", "designerDept");
			query.add(Restrictions.in("designerDept.did", dids));
		}

		if (statuses != null && statuses.size() > 0) {
			query.add(Restrictions.in("status", statuses));
		}

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecorationForSalesman(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecorationForSalesDept(Paging paging, List<Filter> filters, List<Integer> dids) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		if (dids != null && dids.size() > 0) {
			query.alias("salesDept", "salesDept");
			query.add(Restrictions.in("salesDept.did", dids));
		}

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecorationForSalesmanManager(Paging paging, List<Filter> filters, List<Integer> salesmanDepartmentIds, List<Short> statuses) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		if (salesmanDepartmentIds != null && salesmanDepartmentIds.size() > 0) {
			query.alias("salesman", "salesman");
			query.alias("salesman.dept", "salesmanDept");
			query.add(Restrictions.in("salesmanDept.did", salesmanDepartmentIds));
		}

		if (statuses != null && statuses.size() > 0) {
			query.add(Restrictions.in("status", statuses));
		}

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> queryDecoration(List<Filter> filters) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(new Paging(), DecorationPO.class);

		queryFilterExcute(query, filters);

		query.notPaging();

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPO> queryDecorationByCustomerId(Long customerId) {
		return session().createCriteria(DecorationPO.class).createAlias("customer", "customer").add(Restrictions.eq("customer.cid", customerId)).list();
	}

	@Override
	public DecorationPO queryDecorationByHid(long hid, List<Integer> companys) {

		List<Short> statuss = Arrays.asList(DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_TERMINATION_INT, DecorationPO.STATUS_FINAL_INT, DecorationPO.STATUS_COMPLETED_INT);

		return (DecorationPO) session().createCriteria(DecorationPO.class).createAlias("house", "house").add(Restrictions.eq("house.hid", hid)).add(Restrictions.not(Restrictions.in("status", statuss))).add(Restrictions.in("company", companys)).uniqueResult();
	}

	@Override
	public DecorationPO queryDecorationByOrderId(String OrderId) {
		return (DecorationPO) session().createCriteria(DecorationPO.class).add(Restrictions.eq("orderId", OrderId)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPO> queryDecorationByCustomer(Long cid, String customerId, List<Integer> companys) {

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_TERMINATION_INT, DecorationPO.STATUS_FINAL_INT, DecorationPO.STATUS_COMPLETED_INT });

		Criteria criteria = session().createCriteria(DecorationPO.class).add(Restrictions.in("company", companys)).createAlias("customer", "customer").add(Restrictions.not(Restrictions.in("status", status)));

		if (cid != null) {
			criteria.add(Restrictions.eq("customer.cid", cid));
		} else {
			criteria.add(Restrictions.eq("customer.no", customerId));
		}

		return criteria.list();
	}

	@Override
	public double countDecorationForTotalPrice(List<Filter> filters) throws FLException {

		PagingQuery<DecorationPO> query = pagingQuery(new Paging(), DecorationPO.class);

		queryFilterExcute(query, filters);

		return query.sumForField("orderTotalPrice");
	}

	@Override
	public void changeDecorationForOrderId(String newOrderId, String oldOrderId) {
		String sql = "update decoration.decoration set orderId = :newOrderId where orderId = :oldOrderId";

		session().createSQLQuery(sql).setString("newOrderId", newOrderId).setString("oldOrderId", oldOrderId).executeUpdate();

	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {
		queryFilterExcute(query, filters, "");
	}

	public static void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) throws FLException {

		if (filters == null) return;

		if (prefix == null) {
			prefix = "";
		}

		if (!"".equals(prefix)) {

			query.alias(prefix, prefix);
			prefix = String.format("%s.", prefix);
		}

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.contains("house")) {
				query.alias(String.format("%shouse", prefix), "house");
			} else if (field.contains("village")) {
				query.alias(String.format("%shouse", prefix), "house");
				query.alias("house.village", "village");
			} else if (field.contains("customer")) {
				query.alias(String.format("%scustomer", prefix), "customer");
			} else if (field.contains("designer")) {

				query.alias(String.format("%sdesigner", prefix), "designer");

				if (field.contains("department")) {
					query.alias("designer.dept", "designerDept");
				}

				if (field.contains("region")) {
					query.alias("designer.dept", "designerDept");
					query.alias("designerDept.fatherDept", "designerRegion");
				}
			} else if ((field.contains("business") || field.contains("salesman"))) {

				query.alias(String.format("%ssalesman", prefix), "salesman");

				if (field.contains("department")) {
					query.alias("salesman.dept", "salesmanDept");
				}

				if (field.contains("region")) {
					query.alias("salesman.dept", "salesmanDept");
					query.alias("salesmanDept.fatherDept", "salesmanRegion");
				}
			} else if (field.contains("supervisor")) {

				query.alias(String.format("%ssupervisor", prefix), "supervisor");
			} else if (field.contains("quoter")) {

				query.alias(String.format("%squoter", prefix), "quoter");
			} else if (field.contains("escorter")) {

				query.alias(String.format("%sescorter", prefix), "escorter");
			}else if (field.contains("busitype")) {

				query.alias(String.format("%sbusitype", prefix), "busitype");
			}

			if ("decoration.orderId".equals(field)) {
				query.add(query.getCriterion(String.format("%sorderId", prefix), data, op));
			} else if ("decoration.customer.no".equals(field)) {
				query.add(query.getCriterion("customer.no", data, op));
			} else if ("decoration.customer.cid".equals(field)) {
				query.add(query.getCriterion("customer.cid", Long.valueOf(data), op));
			} else if ("decoration.house.houseNumber".equals(field)) {
				query.add(query.getCriterion("house.houseNumber", data, op));
			} else if ("decoration.house.hid".equals(field)) {
				query.add(query.getCriterion("house.hid", Long.valueOf(data), op));
			} else if ("decoration.houseClass".equals(field)) {
				query.add(query.getCriterion(String.format("%shouseClass", prefix), data, op));
			} else if ("decoration.status".equals(field)) {
				query.add(query.getCriterion(String.format("%sstatus", prefix), Short.valueOf(data), op));
			} else if ("decoration.statuses".equals(field)) {
				query.add(query.getCriterion(String.format("%sstatus", prefix), filter.getShorts(), op));
			} else if ("decoration.otherStatus".equals(field)) {
				query.add(query.getCriterion(String.format("%sotherStatus", prefix), data, "and"));
			} else if ("decoration.designer.userId".equals(field)) {
				query.add(query.getCriterion("designer.userId", data, op));
			} else if ("decoration.salesman.userId".equals(field)) {
				query.add(query.getCriterion("salesman.userId", data, op));
			} else if ("decoration.village.no".equals(field)) {
				query.add(query.getCriterion("village.no", data, op));
			} else if ("decoration.designer.department.no".equals(field)) {
				query.add(query.getCriterion("designerDept.no", data, op));
			} else if ("decoration.salesman.department.no".equals(field)) {
				query.add(query.getCriterion("salesmanDept.no", data, op));
			} else if ("decoration.designer.name".equals(field)) {
				query.add(query.getCriterion("designer.currentName", data, op));
			} else if ("decoration.salesman.name".equals(field)) {
				query.add(query.getCriterion("salesman.currentName", data, op));
			} else if ("decoration.supervisor.userId".equals(field)) {
				query.add(query.getCriterion("supervisor.userId", data, op));
			} else if ("decoration.supervisor.name".equals(field)) {
				query.add(query.getCriterion("supervisor.currentName", data, op));
			} else if ("decoration.quoter.userId".equals(field)) {
				query.add(query.getCriterion("quoter.userId", data, op));
			} else if ("decoration.quoter.name".equals(field)) {
				query.add(query.getCriterion("quoter.currentName", data, op));
			} else if ("decoration.escorter.userId".equals(field)) {
				query.add(query.getCriterion("escorter.userId", data, op));
			} else if ("decoration.escorter.name".equals(field)) {
				query.add(query.getCriterion("escorter.currentName", data, op));
			} else if ("decoration.village.name".equals(field)) {
				query.add(query.getCriterion("village.name", data, op));
			} else if ("decoration.company".equals(field)) {
				query.add(query.getCriterion(String.format("%scompany", prefix), CompanyServiceImpl.decode(filter.getData()), op));
			} else if ("decoration.salesman.department.name".equals(field)) {
				query.add(query.getCriterion("salesmanDept.name", data, op));
			} else if ("decoration.designer.department.name".equals(field)) {
				query.add(query.getCriterion("designerDept.name", data, op));
			} else if ("decoration.designer.region.no".equals(field)) {
				query.add(query.getCriterion("designerRegion.no", data, op));
			} else if ("decoration.salesman.region.no".equals(field)) {
				query.add(query.getCriterion("salesmanRegion.no", data, op));
			} else if ("decoration.orderType".equals(field)) {
				query.add(query.getCriterion(String.format("%stypeness", prefix), Short.valueOf(data), op));
			} else if ("decoration.busitype.no".equals(field)) {
				query.add(query.getCriterion("busitype.no", Long.valueOf(data), op));
			} else if ("decoration.houseArea".equals(field)) {
				int dataF = Integer.parseInt(data);
				query.add(query.getCriterion("house.buildArea", Arith.mul(dataF, 1000000), op));
			} else if ("decoration.designStatus".equals(field)) {
				query.add(query.getCriterion(String.format("%sdesignStatus", prefix), Short.valueOf(data), op));
			} else if ("decoration.projectStatus".equals(field)) {
				query.add(query.getCriterion(String.format("%sprojectStatus", prefix), Long.valueOf(data), op));
			} else if ("decoration.sourceStatus".equals(field)) {
				query.add(query.getCriterion(String.format("%ssourceStatus", prefix), Short.valueOf(data), op));
			} else if ("decoration.repairStatus".equals(field)) {
				query.add(query.getCriterion(String.format("%srepairStatus", prefix), Short.valueOf(data), op));
			} else if ("decoration.balanceStatus".equals(field)) {
				query.add(query.getCriterion(String.format("%sbalanceStatus", prefix), Short.valueOf(data), op));
			} else if ("decoration.signTime.range".equals(field)) {
				query.timeranges(String.format("%scontractTime", prefix), String.format("%scontractTime", prefix), data);
			} else if ("decoration.createTime.range".equals(field)) {
				query.timeranges(String.format("%screateTime", prefix), String.format("%screateTime", prefix), data);
			} else if ("decoration.measureTime.range".equals(field)) {
				query.timeranges(String.format("%smeasureTime", prefix), String.format("%smeasureTime", prefix), data);
			} else if ("decoration.depositTime.range".equals(field)) {
				query.timeranges(String.format("%sdepositTime", prefix), String.format("%sdepositTime", prefix), data);
			} else if ("decoration.precontractTime.range".equals(field)) {
				query.timeranges(String.format("%sprecontractTime", prefix), String.format("%sprecontractTime", prefix), data);
			} else if ("decoration.accountTime.range".equals(field)) {
				query.timeranges(String.format("%saccountTime", prefix), String.format("%saccountTime", prefix), data);
			} else if ("decoration.designTime.range".equals(field)) {
				query.timeranges(String.format("%ssdesignTime", prefix), String.format("%sedesignTime", prefix), data);
			} else if ("decoration.sdesignTime.range".equals(field)) {
				query.timeranges(String.format("%ssdesignTime", prefix), String.format("%ssdesignTime", prefix), data);
			} else if ("decoration.edesignTime.range".equals(field)) {
				query.timeranges(String.format("%sedesignTime", prefix), String.format("%sedesignTime", prefix), data);
			} else if ("decoration.balanceTime.range".equals(field)) {
				query.timeranges(String.format("%sbalanceTime", prefix), String.format("%sbalanceTime", prefix), data);
			} else if ("decoration.terminalTime.range".equals(field)) {
				query.timeranges(String.format("%sterminalTime", prefix), String.format("%sterminalTime", prefix), data);
			}
		}
	}
}
