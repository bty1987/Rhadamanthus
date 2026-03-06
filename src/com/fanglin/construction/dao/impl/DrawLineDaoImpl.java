/**
 * @File Name	: DecorationOrderDrawLineDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date		: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email		: 
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.DrawLineDao;
import com.fanglin.construction.po.DrawLinePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.impl.DecorationDaoImpl;
import com.fanglin.utils.Paging;

@Repository("drawLineDao")
public class DrawLineDaoImpl extends DaoImpl<DrawLinePO> implements DrawLineDao {

	public DrawLineDaoImpl() {
		super(DrawLinePO.class);
	}

	@Override
	public List<DrawLinePO> pageDrawLine(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<DrawLinePO> query = pagingQuery(paging, DrawLinePO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<DrawLinePO> queryDrawLine(List<Filter> filters, int company) throws FLException {

		PagingQuery<DrawLinePO> query = pagingQuery(new Paging(0, 99), DrawLinePO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public int countDrawLine(String orderId) {

		List<Short> status = Arrays.asList(DrawLinePO.STATUS_QUEUE_INT, DrawLinePO.STATUS_APPLICATION_INT, DrawLinePO.STATUS_SUCCESS_INT);

		String sql = "select count(*) from construction.drawline where orderId = :orderId and status in :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setParameterList("status", status).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countDrawLine(long gid, Timestamp startTime, Timestamp endTime, int company) {

		String sql = "select count(*) from construction.drawline where dgid = :dgid and (startTime between :starts and :ends or endTime between :starte and :ende) and status = 0";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("dgid", gid).setTimestamp("starts", startTime).setTimestamp("ends", endTime).setTimestamp("starte", startTime).setTimestamp("ende", endTime).uniqueResult();

		return count.intValue();
	}

	@Override
	public List<?> countDrawLine(long startTime, long endTime, int company) {

		String sql = "select dlg.name, dl.actualTime, count(*) as count from construction.drawline dl, data.drawlinegroup dlg where dl.actualTime between :start and :end and dl.company = :company and dl.dgid = dlg.gid group by dl.actualTime, dlg.gid";

		return session().createSQLQuery(sql).setLong("start", startTime).setLong("end", endTime).setInteger("company", company).list();
	}

	@Override
	public List<?> countDrawLineForTime(long startTime, long endTime, int company) {

		String sql = "select dl.actualTime, count(*) as count from construction.drawline dl where dl.actualTime between :start and :end and dl.company = :company and dl.status != 3 group by dl.actualTime";

		return session().createSQLQuery(sql).setLong("start", startTime).setLong("end", endTime).setInteger("company", company).list();
	}

	@Override
	public DrawLinePO queryDrawLineByOrderId(String orderId) {
		String hql = "from DrawLinePO where decoration.orderId = :orderId order by dlid desc";
		return (DrawLinePO) session().createQuery(hql).setString("orderId", orderId).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			} else if ("actualDate".equals(field)) {

				if ("between".equals(op)) {
					query.timeranges(DrawLinePO.COLUMN_STARTTIME_STR, DrawLinePO.COLUMN_ENDTIME_STR, data, data);
				} else {
					query.add(query.getCriterion(DrawLinePO.COLUMN_STARTTIME_STR, data, op));
				}

			} else if ("applayTime".equals(field)) {
				query.timeranges(DrawLinePO.COLUMN_APPLAYTIME_STR, DrawLinePO.COLUMN_APPLAYTIME_STR, data);

			}
		}
	}
}
