package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.po.ConstructionInfoDO;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.impl.DecorationDaoImpl;
import com.fanglin.utils.Paging;

@Repository("constructionInfoDao")
public class ConstructionInfoDaoImpl extends DaoImpl<ConstructionInfoPO> implements ConstructionInfoDao {

	public ConstructionInfoDaoImpl() {
		super(ConstructionInfoPO.class);
	}

	@Override
	public List<ConstructionInfoDO> pageConstructionInfo(Paging paging, List<Filter> filters, Integer company) throws FLException {
		PagingQuery<ConstructionInfoDO> query = pagingQuery(paging, ConstructionInfoDO.class);

		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		query.asc("drawlineTime");

		return query.list();
	}

	@Override
	public ConstructionInfoPO queryConstructionInfo(long cid) {
		return (ConstructionInfoPO) session().createCriteria(ConstructionInfoPO.class).add(Restrictions.eq(ConstructionInfoPO.COLUMN_CID_STR, cid)).uniqueResult();
	}

	@Override
	public ConstructionInfoPO queryConstructionInfoByOrderId(String orderId) {

		return (ConstructionInfoPO) session().createCriteria(ConstructionInfoPO.class).add(Restrictions.eq(ConstructionInfoPO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public List<?> countConstructionInfo(long startTime, long endTime, int company) {

		String sql = "select ci.actuaTime, count(*) as count from construction.constructioninfo ci, decoration.decoration d where ci.actuaTime between :start and :end and ci.orderId = d.orderId and d.company = :company group by ci.actuaTime";

		return session().createSQLQuery(sql).setLong("start", startTime).setLong("end", endTime).setInteger("company", company).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("isIssue".equals(field)) {
				query.add(Restrictions.eq("isIssus", Short.parseShort(data)));
			} else if ("isCheck".equals(field)) {
				query.add(Restrictions.eq("isCheck", Short.parseShort(data)));
			} else if ("keyTime".equals(field)) {
				query.timeranges(ConstructionInfoDO.COLUMN_KEYTIME_STR, data);
			} else if ("drawlineTime".equals(field)) {
				query.timeranges(ConstructionInfoDO.COLUMN_DRAWLINETIME_STR, data);
			} else if ("drawlineTimeFlag".equals(field)) {
				query.add(Restrictions.isNotNull(ConstructionInfoDO.COLUMN_DRAWLINETIME_STR));
			} else if ("finishTime".equals(field)) {
				query.timeranges(ConstructionInfoDO.COLUMN_FINISHTIME_STR, data);
			} else if ("designTime".equals(field)) {
				query.timeranges(ConstructionInfoDO.COLUMN_DESIGNTIME_STR, data);
			}
		}
	}
}
