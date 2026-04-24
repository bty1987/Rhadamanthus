package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.po.HousePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("houseDao")
public class HouseDaoImpl extends DaoImpl<HousePO> implements HouseDao {

	public HouseDaoImpl() {
		super(HousePO.class);
	}

	@Override
	public List<HousePO> pageHouse(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<HousePO> query = pagingQuery(paging, HousePO.class);

		queryFilterExcute(query, filters);

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			query.add(Restrictions.eq("company", company));
		}

		query.asc("hid");

		return query.list();
	}

	@Override
	public HousePO queryHouseByNoAHnum(String no, String houseNumber, Integer company) {

		Criteria criteria = session().createCriteria(HousePO.class).createAlias("village", "village").add(Restrictions.eq(HousePO.COLUMN_VILLAGE_NO_STR, no)).add(Restrictions.eq(HousePO.COLUMN_HOUSENUMBER_STR, houseNumber));

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			criteria.add(Restrictions.eq("company", company));
		}

		return (HousePO) criteria.uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("village", "village");

		for (Filter filter : filters) {

			if ("villageName".equals(filter.getField())) {
				query.add(Restrictions.or(Restrictions.ilike("village.name", filter.getData(), MatchMode.ANYWHERE), Restrictions.or(Restrictions.ilike("village.pinyinAB", filter.getData(), MatchMode.ANYWHERE), Restrictions.ilike("village.pinyinAll", filter.getData(), MatchMode.ANYWHERE))));
			} else if ("type".equals(filter.getField())) {
				query.add(Restrictions.eq("type", Short.valueOf(filter.getData())));
			} else if ("through".equals(filter.getField())) {
				query.add(Restrictions.eq("through", Short.valueOf(filter.getData())));
			} else if ("roomNum".equals(filter.getField())) {
				if (filter.getData().equals("6")) {
					query.add(Restrictions.ge("roomNum", Integer.valueOf(filter.getData())));
				} else {
					query.add(Restrictions.eq("roomNum", Integer.valueOf(filter.getData())));
				}
			} else if ("waterVapour".equals(filter.getField())) {
				query.add(Restrictions.eq("waterVapour", Short.valueOf(filter.getData())));
			} else if ("heatingType".equals(filter.getField())) {
				query.add(Restrictions.eq("heatingType", Short.valueOf(filter.getData())));
			} else if ("orientation".equals(filter.getField())) {
				query.add(Restrictions.eq("orientation", Short.valueOf(filter.getData())));
			} else if ("houseNumber".equals(filter.getField())) {
				Disjunction disjunction = Restrictions.disjunction();
				disjunction.add(query.getCriterion("houseNumber", filter));
				disjunction.add(Restrictions.eq("houseNumber", SensitiveDataHelper.encrypt(filter.getData())));
				query.add(disjunction);
			} else if ("status".equals(filter.getField())) {
				query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
			} else if ("buildingArea".equals(filter.getField())) {
				String area[] = filter.getData().split("-");
				query.add(Restrictions.ge("buildArea", Integer.valueOf(area[0])));
				query.add(Restrictions.le("buildArea", Integer.valueOf(area[1])));
			} else if ("parlourType".equals(filter.getField())) {
				query.add(Restrictions.eq("parlourType", Short.valueOf(filter.getData())));
			}
		}
	}

}
