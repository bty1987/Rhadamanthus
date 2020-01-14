package com.fanglin.production.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;


import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.HardwareDao;
import com.fanglin.production.po.HardwarePO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("hardwareDao")
public class HardwareDaoImpl extends DaoImpl<HardwarePO> implements HardwareDao {

	public HardwareDaoImpl() {
		super(HardwarePO.class);
	}

	@Override
	public List<HardwarePO> pageHardware(Paging paging, List<Filter> filters, int company) {

		PagingQuery<HardwarePO> query = pagingQuery(paging, HardwarePO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("hid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<HardwarePO> queryHardwareByPid(long pid) {
		return createCriteria(HardwarePO.class).add(Restrictions.eq(HardwarePO.COLUMN_PID_STR, pid)).addOrder(Order.asc("hid")).list();
	}


	private void queryFilterExcute(PagingQuery<HardwarePO> query, List<Filter> filters) {

		if (filters != null) {

			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

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
				} else if (field.startsWith("village")) {
					query.alias("house.village", "village");
				}
				
				if ("pno".equals(field)) {
					query.add(query.getCriterion(HardwarePO.COLUMN_PNO_STR, data, op));	
				}else if(HardwarePO.COLUMN_NO_STR.equals(field)){
					query.add(query.getCriterion(field, data, op));
				}else if(HardwarePO.COLUMN_STATUS_STR.equals(field)){
					query.add(query.getCriterion(field, Short.parseShort(data), op));
				} else if (HardwarePO.COLUMN_CREATE_STR.equals(field)) {
					queryFilterTimeInfo(query, data,"createTime");
				} else if (HardwarePO.COLUMN_ENDTIME_STR.equals(field)) {
					queryFilterTimeInfo(query, data,"finishTime");
				} else if ("houseNumber".equals(field)) {
					query.add(query.getCriterion("house.houseNumber", data, op));
				} else if ("orderId".equals(field)) {
					query.add(query.getCriterion("production.orderId", data, op));
				} else if ("createrId".equals(field)) {
					query.add(query.getCriterion("creater.userId", data, op));
				} else if ("villageId".equals(field)) {
					query.add(query.getCriterion("village.no", data, op));
				} 
			}
		}
	}

	private void queryFilterTimeInfo(PagingQuery<HardwarePO> query, String data ,String timeType) {

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
	public int countHardware(Long pid, Short status) {
		String sql = "select count(*) from production.hardware where pid = :pid and status < :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("pid", pid).setShort("status", status).uniqueResult();
		return  count.intValue();
	}


}
