package com.fanglin.decoration.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationMeasureDao;
import com.fanglin.decoration.po.DecorationMeasurePO;
import com.fanglin.utils.Paging;

@Repository("decorationMeasureDao")
public class DecorationMeasureDaoImpl extends DaoImpl<DecorationMeasurePO> implements DecorationMeasureDao {
	
	public DecorationMeasureDaoImpl() {
		super(DecorationMeasurePO.class);
	}


	@Override
	public List<DecorationMeasurePO> pageDecorationMeasure(Paging paging,List<Filter> filters, int company) throws FLException {
		
		PagingQuery<DecorationMeasurePO> query = pagingQuery(paging, DecorationMeasurePO.class);
		
		query.add(query.getCriterion(DecorationMeasurePO.COLUMN_COMPANY_STR, company, "eq"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	public int countDecorationMeasure(String orderId) {

		List<Short> status = Arrays.asList(DecorationMeasurePO.STATUS_QUEUE_INT, DecorationMeasurePO.STATUS_APPLICATION_INT, DecorationMeasurePO.STATUS_SUCCESS_INT);

		String sql = "select count(*) from decoration.decorationMeasure where orderId = :orderId and status in :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setParameterList("status", status).uniqueResult();

		return count.intValue();
	}
	
	@Override
	public int countDecorationMeasure(Timestamp startTime, Timestamp endTime, int company) {

		String sql = "select count(*) from decoration.decorationMeasure where status = 0 and (startTime between :starts and :ends or endTime between :starte and :ende)";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setTimestamp("starts", startTime).setTimestamp("ends", endTime).setTimestamp("starte", startTime).setTimestamp("ende", endTime).uniqueResult();

		return count.intValue();
	}

	@Override
	public List<DecorationMeasurePO> queryDecorationMeasure(List<Filter> filters, int company) throws FLException {
		
		PagingQuery<DecorationMeasurePO> query = pagingQuery(new Paging(0, 99), DecorationMeasurePO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}
	
	@Override
	public DecorationMeasurePO queryDecorationMeasure(String orderId) {

		return (DecorationMeasurePO) session().createCriteria(DecorationMeasurePO.class).add(Restrictions.eq(DecorationMeasurePO.DECORATIONMEASURE_ORDERID_STR, orderId)).setMaxResults(1).uniqueResult();

	}

	

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null || filters.size() == 0) return;
		
		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			} else if ("actualDate".equals(field)) {

				if ("between".equals(op)) {
					query.timeranges(DecorationMeasurePO.COLUMN_STARTTIME_STR, DecorationMeasurePO.COLUMN_ENDTIME_STR, data, data);
				} else {
					query.add(query.getCriterion(DecorationMeasurePO.COLUMN_STARTTIME_STR, data, op));
				}

			} else if ("applayTime".equals(field)) {
				query.timeranges(DecorationMeasurePO.COLUMN_APPLAYTIME_STR, DecorationMeasurePO.COLUMN_APPLAYTIME_STR, data);

			}
		}
	}
	
}
