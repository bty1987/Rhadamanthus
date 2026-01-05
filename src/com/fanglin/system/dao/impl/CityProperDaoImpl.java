package com.fanglin.system.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.CityProperDao;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.utils.Paging;

@Repository("cityProperDao")
public class CityProperDaoImpl extends DaoImpl<CityProperPO> implements CityProperDao {

	public CityProperDaoImpl() {
		super(CityProperPO.class);
	}

	@Override
	public List<CityProperPO> pageCityProper(Paging paging, List<Filter> filters) {

		PagingQuery<CityProperPO> query = pagingQuery(paging, CityProperPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<CityProperPO> pageCityProper(Paging paging, String name) {

		PagingQuery<CityProperPO> query = pagingQuery(paging, CityProperPO.class);

		query.add(Restrictions.or(Restrictions.ilike(CityProperPO.COLUMN_NAME_STR, name, MatchMode.ANYWHERE), Restrictions.ilike(CityProperPO.COLUMN_PINYIN_STR, name, MatchMode.ANYWHERE)));

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CityProperPO> queryCityProper(Integer cid) {
		return session().createCriteria(CityProperPO.class).add(Restrictions.eq("city.cid", cid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CityProperPO> queryCityProper(List<Integer> cids) {
		return session().createCriteria(CityProperPO.class).add(Restrictions.in("city.cid", cids)).list();
	}

	@Override
	public int countCityProper(Integer cid) {
		String sql = "select count(*) from communion.cityProper where cid = :cid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("cid", cid.intValue()).uniqueResult();

		return count.intValue();
	}

	@Override
	public CityProperPO queryCityProper(String name) {
		return (CityProperPO) session().createCriteria(CityProperPO.class).add(Restrictions.eq("name", name)).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("city", "city");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (CityProperPO.COLUMN_NAME_STR.equals(field)) {
				query.add(query.getCriterion(CityProperPO.COLUMN_NAME_STR, data, op));
			} else if ("cityId".equals(field)) {
				query.add(query.getCriterion("city.cid", Integer.valueOf(data), op));
			} else if ("regionId".equals(field)) {
				query.alias("city.region", "region");
				query.add(query.getCriterion("region.rid", Integer.valueOf(data), op));
			}
		}
	}

}
