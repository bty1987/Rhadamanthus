package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.po.ConstructionInfoDO;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("constructionInfoDao")
public class ConstructionInfoDaoImpl extends DaoImpl<ConstructionInfoPO> implements ConstructionInfoDao {

	public ConstructionInfoDaoImpl() {
		super(ConstructionInfoPO.class);
	}

	@Override
	public List<ConstructionInfoDO> pageConstructionInfo(Paging paging, List<Filter> filters, Integer company) {
		PagingQuery<ConstructionInfoDO> query = pagingQuery(paging, ConstructionInfoDO.class);

		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("cid");

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

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("decoration", "decoration");
		query.alias("decoration.designer", "designer");
		query.alias("designer.dept", "designerDept");
		query.alias("designerDept.fatherDept", "designerRegion");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("designerDepartmentId".equals(field)) {
				query.add(query.getCriterion("designerDept.no", data, op));
			} else if ("designerRegionId".equals(field)) {
				query.add(query.getCriterion("designerRegion.no", data, op));
			} else if ("orderId".equals(field)) {
				query.add(query.getCriterion("decoration.orderId", data, op));
			} else if ("keyTime".equals(field)) {
				query.timeranges(ConstructionInfoDO.COLUMN_KEYTIME_STR, data);
			} else if ("drawlineTime".equals(field)) {
				query.timeranges(ConstructionInfoDO.COLUMN_DRAWLINETIME_STR, data);
			} else if ("finishTime".equals(field)) {
				query.timeranges(ConstructionInfoDO.COLUMN_FINISHTIME_STR, data);
			} else if ("designTime".equals(field)) {
				query.timeranges(ConstructionInfoDO.COLUMN_DESIGNTIME_STR, data);
			} else if ("sdesignTimeRange".equals(field)) {
				query.timeranges(ConstructionInfoDO.COLUMN_SDESIGNTIME_STR, data);
			} else if ("edesignTimeRange".equals(field)) {
				query.timeranges(ConstructionInfoDO.COLUMN_EDESIGNTIME_STR, data);
			} else if ("designer".equals(field)) {
				query.add(query.getCriterion("designer.userId", data, op));
			}
		}
	}

}
