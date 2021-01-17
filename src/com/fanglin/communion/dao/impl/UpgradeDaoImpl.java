package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.UpgradeDao;
import com.fanglin.communion.po.UpgradePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("upgradeDao")
public class UpgradeDaoImpl extends DaoImpl<UpgradePO> implements UpgradeDao {

	public UpgradeDaoImpl() {
		super(UpgradePO.class);
	}

	@Override
	public List<UpgradePO> pageUpgrade(Paging paging, List<Filter> filters) {

		PagingQuery<UpgradePO> query = pagingQuery(paging, UpgradePO.class);

		queryFilterExcute(query, filters);

		query.desc("ugid");

		return query.list();

	}

	@Override
	public List<UpgradePO> queryUpgrade(List<Filter> filters) {

		PagingQuery<UpgradePO> query = pagingQuery(new Paging(), UpgradePO.class);

		query.add(Restrictions.eq("status", UpgradePO.STATUS_ONLINE_INT));

		queryFilterExcute(query, filters);

		query.notPaging();

		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<UpgradePO> matchUpgrade(String trialno) {
		return session().createCriteria(UpgradePO.class).add(Restrictions.eq(UpgradePO.COLUMN_TRIALNO_STR, trialno)).add(Restrictions.eq("status", UpgradePO.STATUS_ONLINE_INT)).list();
	}

	@Override
	public String maxUpgrade() {
		return (String) session().createCriteria(UpgradePO.class).setProjection(Projections.projectionList().add(Projections.max("no"))).add(Restrictions.eq("status", UpgradePO.STATUS_ONLINE_INT)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null && filters.size() > 0) {

			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("trialVersion".equals(field)) {
					query.add(query.getCriterion(UpgradePO.COLUMN_TRIALNO_STR, data, op));
				} else if ("createTime".equals(field)) {
					query.timeranges(UpgradePO.COLUMN_CREATETIME_STR, UpgradePO.COLUMN_CREATETIME_STR, data);
				}
			}
		}
	}
}
