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
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.DrawLineDao;
import com.fanglin.construction.po.DrawLinePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("drawLineDao")
public class DrawLineDaoImpl extends DaoImpl<DrawLinePO> implements DrawLineDao {

	public DrawLineDaoImpl() {
		super(DrawLinePO.class);
	}

	@Override
	public List<DrawLinePO> pageDrawLine(Paging paging, List<Filter> filters, int company) {

		PagingQuery<DrawLinePO> query = pagingQuery(paging, DrawLinePO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.asc(DrawLinePO.COLUMN_STARTTIME_STR);

		return query.list();
	}

	@Override
	public List<DrawLinePO> queryDrawLine(List<Filter> filters, int company) {

		PagingQuery<DrawLinePO> query = pagingQuery(new Paging(), DrawLinePO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.notPaging();

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DrawLinePO> queryDrawLineByOrderId(String orderId) {
		return createCriteria(DrawLinePO.class).add(Restrictions.eq("orderId", orderId)).addOrder(Order.desc("dlid")).list();
	}

	@Override
	public int countDrawLine(String orderId) {
		
		List<Short> status = Arrays.asList(DrawLinePO.STATUS_QUEUE_INT, DrawLinePO.STATUS_APPLICATION_INT);
		
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

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {
		if (filters != null) {

			query.alias("decoration", "decoration");
			
			for (Filter filter : filters) {

				if ("orderId".equals(filter.getField())) {
					query.add(query.getCriterion("decoration.orderId", (filter.getData()), filter.getOp()));
				} else if ("drawLineGroupName".equals(filter.getField())) {
					query.add(query.getCriterion("drawLineGroupId", (filter.getData()), filter.getOp()));
				} else if ("salesman".equals(filter.getField())) {
					query.alias("decoration.salesman", "salesman");
					query.add(query.getCriterion("salesman.userId", (filter.getData()), filter.getOp()));
				} else if ("designer".equals(filter.getField())) {
					query.alias("decoration.designer", "designer");
					query.add(query.getCriterion("designer.userId", (filter.getData()), filter.getOp()));
				} else if ("status".equals(filter.getField())) {
					query.add(query.getCriterion("status", Short.parseShort(filter.getData()), filter.getOp()));

				} else if ("actualDate".equals(filter.getField())) {

					if ("between".equals(filter.getOp())) {
						String sTime = filter.getData() + " 00:00:00";
						String eTime = filter.getData() + " 23:59:59";

						Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
						Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

						Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
						Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
						query.add(query.getCriterion(DrawLinePO.COLUMN_STARTTIME_STR, sTimestamp, "ge"));
						query.add(query.getCriterion(DrawLinePO.COLUMN_ENDTIME_STR, eTimestamp, "le"));
					} else {
						query.add(query.getCriterion(DrawLinePO.COLUMN_STARTTIME_STR, filter.getData(), filter.getOp()));
					}
				} else {
					query.add(query.getCriterion(filter.getField(), (filter.getData()), filter.getOp()));
				}
			}
		}
	}
}
