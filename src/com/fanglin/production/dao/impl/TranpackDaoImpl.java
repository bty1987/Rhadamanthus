package com.fanglin.production.dao.impl;


import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.TranpackDao;
import com.fanglin.production.po.TranpackPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("tranpackDao")
public class TranpackDaoImpl extends DaoImpl<TranpackPO> implements TranpackDao{

	public TranpackDaoImpl() {
		super(TranpackPO.class);
	}

	@Override
	public List<TranpackPO> pageTranpack(Paging paging, List<Filter> filters) {

		PagingQuery<TranpackPO> query = pagingQuery(paging, TranpackPO.class);

		queryFilterExcute(filters, query);

		query.desc("tid");

		return query.list();
	}

	private void queryFilterExcute(List<Filter> filters,
			PagingQuery<TranpackPO> query) {
		if (filters != null) {
			for (Filter filter : filters) {
				String op = filter.getOp();
				String data = filter.getData();
				String field = filter.getField();

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
				} else if (field.startsWith("sender")) {
					query.alias("sender", "sender");

					if (field.contains("Department")) {
						query.alias("sender.dept", "senderDept");
					}

					if (field.contains("Region")) {
						query.alias("sender.dept", "senderDept");
						query.alias("senderDept.fatherDept", "senderRegion");
					}
				} else if (field.startsWith("mounter")) {
					query.alias("mounter", "mounter");

					if (field.contains("Department")) {
						query.alias("mounter.dept", "mounterDept");
					}

					if (field.contains("Region")) {
						query.alias("mounter.dept", "mounterDept");
						query.alias("mounterDept.fatherDept", "mounterRegion");
					}
				} else if (field.startsWith("village")) {
					query.alias("house.village", "village");
				} 
				
				if (TranpackPO.COLUMN_PNO_STR.equals(field)) {
					query.add(query.getCriterion("production.pno", data, op));
				}else if(TranpackPO.COLUMN_TNO_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				}else if (TranpackPO.COLUMN_TYPE_STR.equals(field)) {
					query.add(query.getCriterion(field, Short.parseShort(data), op));
				}else if (TranpackPO.COLUMN_STATUS_STR.equals(field)) {
					query.add(query.getCriterion(field, Short.parseShort(data), op));
				}else if (TranpackPO.TIME_CREATE_STR.equals(field)) {
					queryFilterTimeInfo(query, data,"createTime");
				}else if (TranpackPO.TIME_PLAN_STR.equals(field)) {
					queryFilterTimeInfo(query, data,"planTime");
				}else if (TranpackPO.TIME_TRAN_STR.equals(field)) {
					queryFilterTimeInfo(query, data,"tranTime");
				}else if (TranpackPO.TIME_MOUNT_STR.equals(field)) {
					queryFilterTimeInfo(query, data,"mountTime");
				} else if ("villageId".equals(field)) {
					query.add(query.getCriterion("village.no", data, op));
				} else if ("houseNumber".equals(field)) {
					query.add(query.getCriterion("house.houseNumber", data, op));
				} else if ("orderId".equals(field)) {
					query.add(query.getCriterion("production.orderId", data, op));
				} else if ("createrId".equals(field)) {
					query.add(query.getCriterion("creater.userId", data, op));
				} else if ("senderId".equals(field)) {
					query.add(query.getCriterion("sender.userId", data, op));
				} else if ("mounterId".equals(field)) {
					query.add(query.getCriterion("mounter.userId", data, op));
				} 
			}
		}

	}

	private void queryFilterTimeInfo(PagingQuery<TranpackPO> query, String data ,String timeType) {

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
	@SuppressWarnings("unchecked")
	public List<TranpackPO> queryTranpackByPid(Long pid) {
		return session().createCriteria(TranpackPO.class).createAlias("production", "production").add(Restrictions.eq("production.pid", pid)).list();
	}


	@Override
	public int countTranpackByRid (Long rid){
		String sql = "select count(*) from production.tranpack where rid = :rid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("rid", rid).uniqueResult();
		return  count.intValue();
	}

	@Override
	public int countTranpackByPid (Long pid,Short status,Long tid){
		String sql = "select count(*) from production.tranpack where pid = :pid and status < :status and tid != :tid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("pid", pid).setShort("status", status).setLong("tid", tid).uniqueResult();
		return  count.intValue();
	}

	@Override
	public int countTranpackByPid(Long pid, Short status) {
		String sql = "select count(*) from production.tranpack where pid = :pid and status < :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("pid", pid).setShort("status", status).uniqueResult();
		return  count.intValue();
	}

	@Override
	public int updateTranpack(Long pid, Short status){
		String sql = "update production.tranpack set status = :newStatus, planTime = :planTime where pid = :pid and status != :nowStatus and status < :nowStatus";
		return  session().createSQLQuery(sql).setLong("pid", pid).setShort("newStatus", status).setShort("nowStatus", status).setTimestamp("planTime", new Timestamp(System.currentTimeMillis())).executeUpdate();
	}

}
