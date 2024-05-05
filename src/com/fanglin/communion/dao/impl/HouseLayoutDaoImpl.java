package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.HouseLayoutDao;
import com.fanglin.communion.po.HouseLayoutPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("houseLayoutDao")
public class HouseLayoutDaoImpl extends DaoImpl<HouseLayoutPO> implements HouseLayoutDao {

	public HouseLayoutDaoImpl() {
		super(HouseLayoutPO.class);
	}

	@Override
	public List<HouseLayoutPO> pageHouseLayout(Paging paging, List<Filter> filters) {

		PagingQuery<HouseLayoutPO> query = pagingQuery(paging, HouseLayoutPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<HouseLayoutPO> queryHouseLayout(long vid) {
		return session().createCriteria(HouseLayoutPO.class).createAlias("village", "village").add(Restrictions.eq("village.vid", vid)).list();

	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("layout".equals(filter.getField())) {
				query.add(query.getCriterion("layout", data, op));
			} else if ("area".equals(filter.getField())) {

				String area[] = filter.getData().split("-");

				query.add(Restrictions.ge("area", Long.valueOf(area[0]) * 1000));
				query.add(Restrictions.le("area", Long.valueOf(area[1]) * 1000));
			} else if ("villageName".equals(filter.getField())) {
				query.alias("village", "village");
				query.add(Restrictions.or(Restrictions.ilike("village.name", data, MatchMode.ANYWHERE), Restrictions.or(Restrictions.ilike("village.pinyinAB", data, MatchMode.ANYWHERE), Restrictions.ilike("village.pinyinAll", data, MatchMode.ANYWHERE))));
			}
		}
	}

}
