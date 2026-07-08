package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.ColorDao;
import com.fanglin.data.po.ColorGO;
import com.fanglin.data.po.ColorPO;
import com.fanglin.utils.Paging;

@Repository("colorDao")
public class ColorDaoImpl extends DaoImpl<ColorPO> implements ColorDao {

	public ColorDaoImpl() {
		super(ColorPO.class);
	}

	@Override
	public List<ColorGO> pageColor(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ColorGO> query = pagingQuery(paging, ColorGO.class);

		query.add(query.getCriterion("goods.company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ColorPO> queryColorByGid(long gid) {
		return session().createCriteria(ColorPO.class).add(Restrictions.eq(ColorPO.COLUMN_GID_STR, gid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ColorPO> queryColorForEnableByGid(long gid) {
		return session().createCriteria(ColorPO.class).add(Restrictions.eq(ColorPO.COLUMN_GID_STR, gid)).add(Restrictions.eq(ColorPO.COLUMN_STATUS_STR, ColorPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ColorPO> queryColorForEnableByGids(List<Long> gids) {
		return session().createCriteria(ColorPO.class).add(Restrictions.in(ColorPO.COLUMN_GID_STR, gids)).add(Restrictions.eq(ColorPO.COLUMN_STATUS_STR, ColorPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public ColorPO queryColorByName(long gid, String name) {
		return (ColorPO) session().createCriteria(ColorPO.class).add(Restrictions.eq(ColorPO.COLUMN_GID_STR, gid)).add(Restrictions.eq(ColorPO.COLUMN_NAME_STR, name)).uniqueResult();
	}

	@Override
	public int batchSaveColor(long gid, long gpid) {

		String sql = "INSERT INTO `data`.color (gid, `name`, `status`) SELECT :gid, cp.`name`, cp.`status` FROM communion.colorpool cp WHERE cp.gpid = :gpid";

		session().createSQLQuery(sql).setLong("gid", gid).setLong("gpid", gpid).executeUpdate();

		return 0;

	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("goods", "goods");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("goods".equals(filter.getField())) {
				query.add(query.getCriterion("goods.no", data, op));
			} else if ("goods".equals(field)) {
				query.add(query.getCriterion("goods.name", data, op));
			} else if ("goods".equals(field)) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			}
		}
	}

}
