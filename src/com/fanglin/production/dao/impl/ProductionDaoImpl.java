package com.fanglin.production.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.ProductionDao;
import com.fanglin.production.po.ProductionPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("productionDao")
public class ProductionDaoImpl extends DaoImpl<ProductionPO> implements ProductionDao {

	public ProductionDaoImpl() {
		super(ProductionPO.class);
	}

	@Override
	public List<ProductionPO> pageProduction(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ProductionPO> query = pagingQuery(paging, ProductionPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("pid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<ProductionPO> query, List<Filter> filters) {

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
				} else if (field.startsWith("spliter")) {
					query.alias("spliter", "spliter");

					if (field.contains("Department")) {
						query.alias("spliter.dept", "spliterDept");
					}

					if (field.contains("Region")) {
						query.alias("spliter.dept", "spliterDept");
						query.alias("spliterDept.fatherDept", "spliterRegion");
					}
				} else if (field.startsWith("creater")) {
					query.alias("creater", "creater");

					if (field.contains("Department")) {
						query.alias("creater.dept", "createrDept");
					}

					if (field.contains("Region")) {
						query.alias("creater.dept", "createrDept");
						query.alias("createrDept.fatherDept", "createrRegion");
					}
				} 
				
				if (ProductionPO.COLUMN_ORDERID_STR.equals(field)) {
					query.add(query.getCriterion(ProductionPO.COLUMN_ORDERID_STR, data, op));
				} else if (ProductionPO.COLUMN_STATUS_STR.equals(field)) {
					query.add(query.getCriterion(field, Short.parseShort(data), op));
				} else if (ProductionPO.COLUMN_TYPE_STR.equals(field)) {
					query.add(query.getCriterion(field, Short.parseShort(data), op));
				} else if (ProductionPO.COLUMN_PNO_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if ("createrId".equals(field)) {
					query.add(query.getCriterion("creater.userId", data, op));
				} else if ("designerId".equals(field)) {
					query.add(query.getCriterion("designer.userId", data, op));
				} else if ("salesmanId".equals(field)) {
					query.add(query.getCriterion("salesman.userId", data, op));
				} else if ("spliterId".equals(field)) {
					query.add(query.getCriterion("spliter.userId", data, op));
				} else if ("houseNumber".equals(field)) {
					query.add(query.getCriterion("house.houseNumber", data, op));
				} else if ("villageId".equals(field)) {
					query.add(query.getCriterion("village.no", data, op));
				} else if ("createTime".equals(field)) {
					queryFilterTimeInfo(query, data,"createTime");
				} else if ("designTime".equals(field)) {
					queryFilterTimeInfo(query, data,"designTime");
				} else if ("divideTime".equals(field)) {
					queryFilterTimeInfo(query, data,"divideTime");
				} else if ("storeTime".equals(field)) {
					queryFilterTimeInfo(query, data,"storeTime");
				} else if ("planTime".equals(field)) {
					queryFilterTimeInfo(query, data,"planTime");
				} else if ("tranTime".equals(field)) {
					queryFilterTimeInfo(query, data,"tranTime");
				} else if ("mountTime".equals(field)) {
					queryFilterTimeInfo(query, data,"mountTime");
				} else if ("finishTime".equals(field)) {
					queryFilterTimeInfo(query, data,"finishTime");
				}   
			}
		}
	}
	
	private void queryFilterTimeInfo(PagingQuery<ProductionPO> query, String data ,String timeType) {

		String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
		String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

		Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
		Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

		Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
		Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

		query.add(query.getCriterion(timeType, eTimestamp, "le"));
		query.add(query.getCriterion(timeType, sTimestamp, "ge"));
	}

	@Override
	public ProductionPO queryProductionByPno(String pno) {
		return (ProductionPO) session().createCriteria(ProductionPO.class).add(Restrictions.eq("pno", pno)).uniqueResult();
	}

}
