package com.fanglin.payment.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.PointofsalesDao;
import com.fanglin.payment.po.PointofsalesPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("pointofsalesDao")
public class PointofsalesDaoImpl extends DaoImpl<PointofsalesPO> implements PointofsalesDao {

	public PointofsalesDaoImpl() {
		super(PointofsalesPO.class);
	}

	@Override
	public List<PointofsalesPO> pagePointofsales(Paging paging, List<Filter> filters) {
		
		PagingQuery<PointofsalesPO> query = pagingQuery(paging, PointofsalesPO.class);
		
		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PointofsalesPO> queryPointofsalesByPid(String pid, Short type) {
		return session().createCriteria(PointofsalesPO.class).add(Restrictions.eq("pid", pid)).add(Restrictions.eq("type", type)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<PointofsalesPO> queryPointofsalesByPidAndRid(String pid, Long rid) {
		
		Criteria criteria = session().createCriteria(PointofsalesPO.class).add(Restrictions.eq("pid", pid));
		
		if(rid != null){
			criteria.add(Restrictions.eq("rid", rid));
		}
		
		return criteria.list();
	}

	@Override
	public void updatePointofsales(List<Long> posids, Long rid, Short status, Short type) {

		String sql = "update payment.pointofsales set status = :status, rid = :rid, type = :type where posid in :posids";

		session().createSQLQuery(sql).setShort("status", status).setLong("rid", rid).setShort("type", type).setParameterList("posids", posids).executeUpdate();
	}

	@Override
	public long countPointofsales(String sn, Short status) {

		String sql = "select count(*) from payment.pointofsales where sn = :sn and status = :status";
		BigInteger num = (BigInteger) session().createSQLQuery(sql).setString("sn", sn).setShort("status", status).uniqueResult();

		return num.longValue();
	}

	@Override
	public int countPointofsalesByPosids(List<Long> posids) {
		
		String sql = "select count(*) from payment.pointofsales where posid in :posids and status != :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setParameterList("posids", posids).setShort("status", PointofsalesPO.STATUS_SUCCESS_INT).uniqueResult();

		return count.intValue();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			
			query.alias("creater", "creater");
			
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if("sn".equals(field)){
					query.add(query.getCriterion(field, data, op));
				} else if("paymentType".equals(field)){
					query.add(query.getCriterion("type", Short.valueOf(data), op));
				} else if("createTime".equals(field)){
					
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

					query.add(query.getCriterion(field, eTimestamp, "le"));
					query.add(query.getCriterion(field, sTimestamp, "ge"));
				} else if("status".equals(field)){
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				} else if("creater".equals(field)){
					query.add(Restrictions.eq("creater.userId", data));
				}
			}
		}
	}

}
