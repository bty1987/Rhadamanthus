package com.fanglin.upgrade.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.upgrade.dao.UpgradeDao;
import com.fanglin.upgrade.po.UpgradePO;
import com.fanglin.utils.DateUtil;
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

		return query.list();

	}

	@Override
	public List<UpgradePO> queryUpgrade(List<Filter> filters) {

		PagingQuery<UpgradePO> query = pagingQuery(new Paging(),UpgradePO.class);

		queryFilterExcute(query, filters);

		query.notPaging();

		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<UpgradePO> matchUpgrade(String trialno) {

		return session().createCriteria(UpgradePO.class).add(Restrictions.eq(UpgradePO.COLUMN_TRIALNO_STR,trialno)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {
		if (filters != null && filters.size() > 0) {

			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("trialVersion".equals(field)) {
					query.add(query.getCriterion(UpgradePO.COLUMN_TRIALNO_STR,data, op));
				} else if ("createTime".equals(field)) {
					
					String sTime = data + " 00:00:00";
					String eTime = data + " 23:59:59";
					Date sdate = DateUtil.parseDate(sTime,"yyyy-MM-dd HH:mm:ss");
					Date edate = DateUtil.parseDate(eTime,"yyyy-MM-dd HH:mm:ss");

					Timestamp stimestamp = DateUtil.getDateToTimestamp(sdate);
					Timestamp etimestamp = DateUtil.getDateToTimestamp(edate);

					query.add(query.getCriterion(UpgradePO.COLUMN_CREATETIME_STR, stimestamp,"ge"));
					query.add(query.getCriterion(UpgradePO.COLUMN_CREATETIME_STR, etimestamp,"le"));

				} 
			}
		}
	}

}
