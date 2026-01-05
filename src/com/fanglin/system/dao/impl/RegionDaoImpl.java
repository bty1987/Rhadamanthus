/**
 * @FileName	: RegionDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date		: 2014-7-28
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */

package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.RegionDao;
import com.fanglin.system.po.RegionPO;
import com.fanglin.utils.Paging;

@Repository("regionDaoImpl")
public class RegionDaoImpl extends DaoImpl<RegionPO> implements RegionDao {

	public RegionDaoImpl() {
		super(RegionPO.class);
	}

	@Override
	public List<RegionPO> pageRegion(Paging paging, List<Filter> filters) {

		PagingQuery<RegionPO> query = pagingQuery(paging, RegionPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<RegionPO> pageRegionByName(Paging paging, String name) {

		PagingQuery<RegionPO> query = pagingQuery(paging, RegionPO.class);

		query.add(Restrictions.or(Restrictions.ilike(RegionPO.COLUMN_NAME_STR, name, MatchMode.ANYWHERE), Restrictions.ilike(RegionPO.COLUMN_PINYIN_STR, name, MatchMode.ANYWHERE)));

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RegionPO> queryRegion() {
		return session().createCriteria(RegionPO.class).list();
	}

	@Override
	public RegionPO queryRegion(String name) {
		return (RegionPO) session().createCriteria(RegionPO.class).add(Restrictions.eq("name", name)).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (RegionPO.COLUMN_NAME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			}
		}
	}

}
