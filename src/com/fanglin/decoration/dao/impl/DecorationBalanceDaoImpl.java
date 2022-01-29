package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationBalanceDao;
import com.fanglin.decoration.po.DecorationBalancePO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("decorationBalanceDao")
public class DecorationBalanceDaoImpl extends DaoImpl<DecorationBalancePO> implements DecorationBalanceDao {
	
	public DecorationBalanceDaoImpl(){
		super(DecorationBalancePO.class);
	}

	@Override
	public List<DecorationBalancePO> pageDecorationBalance(Paging paging, List<Filter> filters) {

		PagingQuery<DecorationBalancePO> query = pagingQuery(paging, DecorationBalancePO.class);

		queryFilterExcute(query, filters);

		query.desc("dbid");

		return query.list();
	}

	@Override
	public DecorationBalancePO queryDecorationBalance(Long doid) {
		
		return (DecorationBalancePO) session().createCriteria(DecorationBalancePO.class).createAlias("decoration", "decoration").add(Restrictions.eq(DecorationBalancePO.COLUMN_DOID_STR, doid)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("balanceTime".equals(field)) {
					query.timeranges("balanceTime", "balanceTime", data);
				}

				query.alias("decoration", "decoration");
				query.alias("decoration.house", "house");

				if (field.startsWith("design")) {
					query.alias("decoration.designer", "designer");

					if (field.contains("Department")) {
						query.alias("designer.dept", "designerDept");
					}

					if (field.contains("Region")) {
						query.alias("designer.dept", "designerDept");
						query.alias("designerDept.fatherDept", "designerRegion");
					}
				} else if ((field.startsWith("business") || field.startsWith("salesman"))) {

					query.alias("decoration.salesman", "salesman");

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
					query.alias("decoration.customer", "customer");
				} else if (field.startsWith("quoter")) {
					query.alias("decoration.quoter", "quoter");

					if (field.contains("Department")) {
						query.alias("quoter.dept", "quoterDept");
					}

					if (field.contains("Region")) {
						query.alias("quoter.dept", "quoterDept");
						query.alias("quoterDept.fatherDept", "quoterRegion");
					}
				} else if (field.startsWith("escorter")) {
					query.alias("decoration.escorter", "escorter");

					if (field.contains("Department")) {
						query.alias("escorter.dept", "escorterDept");
					}

					if (field.contains("Region")) {
						query.alias("escorter.dept", "escorterDept");
						query.alias("escorterDept.fatherDept", "escorterRegion");
					}
				}

				if ("orderId".equals(field)) {
					query.add(query.getCriterion("decoration.orderId", data, op));
				} else if ("customerId".equals(field)) {
					query.add(query.getCriterion("customer.no", data, op));
				} else if ("customercid".equals(field)) {
					query.add(query.getCriterion("customer.cid", Long.valueOf(data), op));
				} else if ("houseNumber".equals(field)) {
					query.add(query.getCriterion("house.houseNumber", data, op));
				} else if ("houseId".equals(field)) {
					query.add(query.getCriterion("house.hid", Long.valueOf(data), op));
				} else if ("houseClass".equals(field)) {
					query.add(query.getCriterion("decoration.houseClass", data, op));
				} else if ("status".equals(field)) {
					query.add(query.getCriterion("decoration.status", Short.valueOf(data), op));
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
					query.add(query.getCriterion("decoration.typeness", Short.valueOf(data), op));
				} else if ("busitype".equals(field)) {
					query.add(query.getCriterion("decoration.busitype", Long.valueOf(data), op));
				} else if ("houseArea".equals(field)) {
					int dataF = Integer.parseInt(data);
					query.add(query.getCriterion("house.buildArea", Arith.mul(dataF, 1000000), op));
				} else if ("designStatus".equals(field)) {
					query.add(query.getCriterion("decoration.designStatus", Short.valueOf(data), op));
				} else if ("projectStatus".equals(field)) {
					query.add(query.getCriterion("decoration.projectStatus", Short.valueOf(data), op));
				} else if ("sourceStatus".equals(field)) {
					query.add(query.getCriterion("decoration.sourceStatus", Short.valueOf(data), op));
				} else if ("repairStatus".equals(field)) {
					query.add(query.getCriterion("decoration.repairStatus", Short.valueOf(data), op));
				} else if ("signTimeDateRange".equals(field)) {
					query.timeranges("decoration.contractTime", "decoration.contractTime", data);
				} else if ("createTimeDateRange".equals(field)) {
					query.timeranges("decoration.createTime", "decoration.createTime", data);
				} else if ("measureTimeDateRange".equals(field)) {
					query.timeranges("decoration.measureTime", "decoration.measureTime", data);
				} else if ("depositTimeDateRange".equals(field)) {
					query.timeranges("decoration.depositTime", "decoration.depositTime", data);
				} else if ("precontractTime".equals(field)) {
					query.timeranges("decoration.precontractTime", "decoration.precontractTime", data);
				} else if ("accountTime".equals(field)) {
					query.timeranges("decoration.accountTime", "decoration.accountTime", data);
				} else if ("designTimeRange".equals(field)) {
					query.timeranges("decoration.sdesignTime", "decoration.edesignTime", data);
				} else if ("sdesignTime".equals(field)) {
					query.timeranges("decoration.sdesignTime", "decoration.sdesignTime", data);
				} else if ("edesignTime".equals(field)) {
					query.timeranges("decoration.edesignTime", "decoration.edesignTime", data);
				}
			}
		}

	}
}
