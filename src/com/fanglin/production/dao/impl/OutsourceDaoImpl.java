package com.fanglin.production.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.OutsourceDao;
import com.fanglin.production.po.OutsourcePO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("outsourceDao")
public class OutsourceDaoImpl extends DaoImpl<OutsourcePO> implements OutsourceDao {

	public OutsourceDaoImpl() {
		super(OutsourcePO.class);
	}

	@Override
	public List<OutsourcePO> pageOutsource(Paging paging, List<Filter> filter,int company) {

		PagingQuery<OutsourcePO> query = pagingQuery(paging, OutsourcePO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(filter, query);

		query.desc("oid");

		return query.list();

	}

	public void queryFilterExcute(List<Filter> filter, PagingQuery<OutsourcePO> query) {

		if (filter != null) {
			for (Filter filters : filter) {
				
				String op = filters.getOp();
				String data = filters.getData();
				String field = filters.getField();
				
				query.alias("production", "production");
				query.alias("production.house", "house");
				
				if (field.startsWith("creater")) {
					query.alias("creater", "creater");

					if (field.contains("Department")) {
						query.alias("creater.dept", "createrDept");
					}

					if (field.contains("Region")) {
						query.alias("creater.dept", "createrDept");
						query.alias("createrDept.fatherDept", "createrRegion");
					}
				} else if (field.startsWith("supplier")) {
					query.alias("supplier", "supplier");

					if (field.contains("Department")) {
						query.alias("supplier.dept", "supplierDept");
					}

					if (field.contains("Region")) {
						query.alias("supplier.dept", "supplierDept");
						query.alias("supplierDept.fatherDept", "supplierRegion");
					}
				} else if (field.startsWith("village")) {
					query.alias("house.village", "village");
				}
				
				if (OutsourcePO.COLUMN_PNO_STR.equals(field)) {
					query.add(query.getCriterion("production.pno",data, op));
				} else if(OutsourcePO.COLUMN_NO_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if (OutsourcePO.COLMU_STATUS_STR.equals(field)) {
					query.add(query.getCriterion(field, Short.parseShort(data), op));
				} else if ("createrId".equals(field)) {
					query.add(query.getCriterion("creater.userId", data, op));
				} else if ("supplierId".equals(field)) {
					query.add(query.getCriterion("supplier.userId", data, op));
				} else if ("villageId".equals(field)) {
					query.add(query.getCriterion("village.no", data, op));
				} else if ("createTime".equals(field)) {
					queryFilterTimeInfo(query, data,"createTime");
				} else if ("finishTime".equals(field)) {
					queryFilterTimeInfo(query, data,"finishTime");
				} else if ("houseNumber".equals(field)) {
					query.add(query.getCriterion("house.houseNumber", data, op));
				} else if ("orderId".equals(field)) {
					query.add(query.getCriterion("production.orderId", data, op));
				}  
			}
		}
	}

	private void queryFilterTimeInfo(PagingQuery<OutsourcePO> query, String data ,String timeType) {

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
	public List<OutsourcePO> pageOutsourceForSupplier(Paging paging, List<Filter> filters, int uid,int company) {

		PagingQuery<OutsourcePO> query = pagingQuery(paging, OutsourcePO.class);

		query.alias("supplier", "supplier");
		query.add(Restrictions.eq(OutsourcePO.COLMU_SUPPLIER_STR, uid));
		query.add(Restrictions.eq("company", company));

		queryFilterExcute(filters, query);

		query.desc("oid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OutsourcePO> queryOutsourceByPid(Long pid,int company) {
		return session().createCriteria(OutsourcePO.class).add(Restrictions.eq(OutsourcePO.COLUMN_COMPANY_STR, company)).createAlias("production", "production").add(Restrictions.eq("production.pid", pid)).list();
	}

	@Override
	public int countOutsource(Long pid, Short status) {
		String sql = "select count(*) from production.outsource where pid = :pid and status < :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("pid", pid).setShort("status", status).uniqueResult();
		return  count.intValue();
	}
}
