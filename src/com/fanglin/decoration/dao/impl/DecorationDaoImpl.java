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

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("decoratioDao")
public class DecorationDaoImpl extends DaoImpl<DecorationPO> implements DecorationDao {

	public DecorationDaoImpl() {
		super(DecorationPO.class);
	}

	@Autowired
	private CustomerPhoneDao customerPhoneDao;
	
	@Override
	public List<DecorationPO> pageDecoration(Paging paging, List<Filter> filters) {
		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecoration(Paging paging, List<Filter> filters, List<Integer> designDepartmentIds, List<Short> statuses, int company) {
		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		query.add(query.getCriterion("company", company, "eq"));

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
	public List<DecorationPO> pageDecorationForGeneral(Paging paging, List<Filter> filters, int company) {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		List<Short> nostatus = Arrays.asList(DecorationPO.STATUS_TERMINATION_INT, DecorationPO.STATUS_WASTE_INT);

		query.add(Restrictions.not(Restrictions.in("status", nostatus)));

		queryFilterExcute(query, filters);
		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecorationForDesign(Paging paging, List<Filter> filters, int company) {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecorationForSalesman(Paging paging, List<Filter> filters, int company) {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		queryFilterExcute(query, filters);

		query.desc("doid");

		return query.list();
	}

	@Override
	public List<DecorationPO> pageDecorationForDesignerManager(Paging paging, List<Filter> filters, List<Integer> designDepartmentIds, List<Short> statuses, int company) {

		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		query.add(query.getCriterion("company", company, "eq"));

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
	public List<DecorationPO> pageDecorationForSalesmanManager(Paging paging, List<Filter> filters, List<Integer> salesmanDepartmentIds, List<Short> statuses) {

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
	public List<DecorationPO> queryDecoration(List<Filter> filters) {

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
	public DecorationPO queryDecorationByHid(long hid, int company) {
		return (DecorationPO) session().createCriteria(DecorationPO.class).createAlias("house", "house").add(Restrictions.eq("house.hid", hid)).add(Restrictions.eq("company", company)).uniqueResult();
	}

	@Override
	public DecorationPO queryDecorationByOrderId(String OrderId) {
		return (DecorationPO) session().createCriteria(DecorationPO.class).add(Restrictions.eq("orderId", OrderId)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPO> queryDecorationByCustomer(Long cid, String customerId, int company) {

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_COMPLETED_INT, DecorationPO.STATUS_TERMINATION_INT });

		Criteria criteria = session().createCriteria(DecorationPO.class).add(Restrictions.eq("company", company)).createAlias("customer", "customer").add(Restrictions.not(Restrictions.in("status", status)));

		if (cid != null) {
			criteria.add(Restrictions.eq("customer.cid", cid));
		} else {
			criteria.add(Restrictions.eq("customer.no", customerId));
		}

		return criteria.list();
	}

	@Override
	public double countDecorationForTotalPrice(List<Filter> filters) {

		PagingQuery<DecorationPO> query = pagingQuery(new Paging(), DecorationPO.class);

		queryFilterExcute(query, filters);

		return query.sumForField("orderTotalPrice");
	}

	@Override
	public void changeDecorationForOrderId(String newOrderId, String oldOrderId) {
		String sql = "update platform.decoration set orderId = :newOrderId where orderId = :oldOrderId";

		session().createSQLQuery(sql).setString("newOrderId", newOrderId).setString("oldOrderId", oldOrderId).executeUpdate();

	}

	@Override
	public List<DecorationPO> checkDeoration(Paging paging, List<Filter> filters, int company) {
		PagingQuery<DecorationPO> query = pagingQuery(paging, DecorationPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		queryFilterExcute(query, filters, company);

		query.desc("doid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				query.alias("house", "house");

				if (field.startsWith("design")) {
					query.alias("designer", "designer");

					if (field.contains("Department")) {
						query.alias("designer.dept", "designerDept");
					}

					if (field.contains("Region")) {
						query.alias("designer.dept", "designerDept");
						query.alias("designerDept.fatherDept", "designerRegion");
					}
				} else if ((field.startsWith("business") || field.startsWith("salesman"))) {

					query.alias("salesman", "salesman");

					if (field.contains("Department")) {
						query.alias("salesman.dept", "salesmanDept");
					}

					if (field.contains("Region")) {
						query.alias("salesman.dept", "salesmanDept");
						query.alias("salesmanDept.fatherDept", "salesmanRegion");
					}
				} else if (field.startsWith("village")) {
					query.alias("house.village", "village");
				} else if (field.startsWith("customer")) {
					query.alias("customer", "customer");
				} else if (field.startsWith("quoter")) {
					query.alias("quoter", "quoter");

					if (field.contains("Department")) {
						query.alias("quoter.dept", "quoterDept");
					}

					if (field.contains("Region")) {
						query.alias("quoter.dept", "quoterDept");
						query.alias("quoterDept.fatherDept", "quoterRegion");
					}
				} else if (field.startsWith("escorter")) {
					query.alias("escorter", "escorter");

					if (field.contains("Department")) {
						query.alias("escorter.dept", "escorterDept");
					}

					if (field.contains("Region")) {
						query.alias("escorter.dept", "escorterDept");
						query.alias("escorterDept.fatherDept", "escorterRegion");
					}
				}

				if ("orderId".equals(field)) {
					query.add(query.getCriterion("orderId", data, op));
				} else if ("customerId".equals(field)) {
					query.add(query.getCriterion("customer.no", data, op));
				} else if ("customercid".equals(field)) {
					query.add(query.getCriterion("customer.cid", Long.valueOf(data), op));
				} else if ("houseNumber".equals(field)) {
					query.add(query.getCriterion("house.houseNumber", data, op));
				} else if ("houseId".equals(field)) {
					query.add(query.getCriterion("house.hid", Long.valueOf(data), op));
				} else if ("houseClass".equals(field)) {
					query.add(query.getCriterion("houseClass", data, op));
				} else if ("status".equals(field)) {
					query.add(query.getCriterion("status", Short.valueOf(data), op));
				} else if ("statuses".equals(field)) {
					query.add(query.getCriterion("status", filter.getRange(), op));
				} else if ("otherStatus".equals(field)) {
					query.add(query.getCriterion("otherStatus", data, "and"));
				} else if ("designerId".equals(field)) {
					query.add(query.getCriterion("designer.userId", data, op));
				} else if ("salesmanId".equals(field)) {
					query.add(query.getCriterion("salesman.userId", data, op));
				} else if ("villageId".equals(field)) {
					query.add(query.getCriterion("village.no", data, op));
				} else if ("designerDepartmentId".equals(field)) {
					query.add(query.getCriterion("designerDept.no", data, op));
				} else if ("salesmanDepartmentId".equals(field)) {
					query.add(query.getCriterion("salesmanDept.no", data, op));
				} else if ("designer".equals(field)) {
					query.add(query.getCriterion("designer.currentName", data, op));
				} else if ("salesman".equals(field)) {
					query.add(query.getCriterion("salesman.currentName", data, op));
				} else if ("supervisor".equals(field)) {
					query.alias("orderSupervisorPO", "supervisor");
					query.add(query.getCriterion("supervisor.currentName", data, op));
				} else if ("quoterId".equals(field)) {
					query.add(query.getCriterion("quoter.userId", data, op));
				} else if ("quoter".equals(field)) {
					query.add(query.getCriterion("quoter.currentName", data, op));
				} else if ("escorterId".equals(field)) {
					query.add(query.getCriterion("escorter.userId", data, op));
				} else if ("escorter".equals(field)) {
					query.add(query.getCriterion("escorter.currentName", data, op));
				} else if ("village".equals(field)) {
					query.add(query.getCriterion("village.name", data, op));
				} else if ("company".equals(field)) {
					try {
						int cid = FormatUtil.decodeCompany(AESHelper.decrypt(filter.getData(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
						query.add(query.getCriterion("company", cid, op));
					} catch (Exception e) {
					}
				} else if ("salesmanDepartment".equals(field)) {
					query.add(query.getCriterion("salesmanDept.name", data, op));
				} else if ("designerDepartment".equals(field)) {
					query.add(query.getCriterion("designerDept.name", data, op));
				} else if ("designerRegionId".equals(field)) {
					query.add(query.getCriterion("designerRegion.no", data, op));
				} else if ("salesmanRegionId".equals(field)) {
					query.add(query.getCriterion("salesmanRegion.no", data, op));
				} else if ("orderType".equals(field)) {
					query.add(query.getCriterion("type", Short.valueOf(data), op));
				} else if ("salesmanType".equals(field)) {
					query.add(query.getCriterion("salesmanType", data, op));
				} else if ("houseArea".equals(field)) {
					int dataF = Integer.parseInt(data);
					query.add(query.getCriterion("house.buildArea", Arith.mul(dataF, 1000000), op));
				} else if ("signTimeDateRange".equals(field)) {
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

					query.add(query.getCriterion("contractTime", eTimestamp, "le"));
					query.add(query.getCriterion("contractTime", sTimestamp, "ge"));
				} else if ("createTimeDateRange".equals(field)) {
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

					query.add(query.getCriterion("createTime", eTimestamp, "le"));
					query.add(query.getCriterion("createTime", sTimestamp, "ge"));
				} else if ("measureTimeDateRange".equals(field)) {
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

					query.add(query.getCriterion("measureTime", eTimestamp, "le"));
					query.add(query.getCriterion("measureTime", sTimestamp, "ge"));
				} else if ("depositTimeDateRange".equals(field)) {
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

					query.add(query.getCriterion("depositTime", eTimestamp, "le"));
					query.add(query.getCriterion("depositTime", sTimestamp, "ge"));
				} else if ("putlineTimeDateRange".equals(field)) {
					String sTime = data.split("-")[0].replaceAll("/", "-");
					String eTime = data.split("-")[1].replaceAll("/", "-");

					query.add(query.getCriterion("putlineConstructionSchedule.putlineTime", eTime, "le"));
					query.add(query.getCriterion("putlineConstructionSchedule.putlineTime", sTime, "ge"));
				} else if ("precontractTime".equals(field)) {
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

					query.add(query.getCriterion("precontractTime", eTimestamp, "le"));
					query.add(query.getCriterion("precontractTime", sTimestamp, "ge"));
				} 
			}
		}

	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, int company) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				if ("customerPhone".equals(field)) {
					Long cid = (long) -1;
					List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhoneByPhone(data, (short) 0, company);
					if (!customerPhones.isEmpty())
						cid = customerPhones.get(0).getCid();
					query.add(query.getCriterion("customer.cid", cid, op));
				}
			}
		}
	}

}
