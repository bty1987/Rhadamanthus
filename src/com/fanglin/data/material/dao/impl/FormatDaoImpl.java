package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.FormatDao;
import com.fanglin.data.po.FormatGO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.utils.Paging;

@Repository("formatDao")
public class FormatDaoImpl extends DaoImpl<FormatPO> implements FormatDao {

	public FormatDaoImpl() {
		super(FormatPO.class);
	}

	@Override
	public List<FormatGO> pageFormat(Paging paging, List<Filter> filters, int company) {

		PagingQuery<FormatGO> query = pagingQuery(paging, FormatGO.class);

		query.add(query.getCriterion("goods.company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<FormatPO> queryFormatByGid(long gid) {
		return session().createCriteria(FormatPO.class).add(Restrictions.eq(FormatPO.COLUMN_GID_STR, gid)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<FormatPO> queryFormatForEnableByGid(long gid) {
		return session().createCriteria(FormatPO.class).add(Restrictions.eq(FormatPO.COLUMN_GID_STR, gid)).add(Restrictions.eq(FormatPO.COLUMN_STATUS_STR, FormatPO.STATUS_ENABLE_INT)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<FormatPO> queryFormatForEnableByGids(List<Long> gids) {
		return session().createCriteria(FormatPO.class).add(Restrictions.in(FormatPO.COLUMN_GID_STR, gids)).add(Restrictions.eq(FormatPO.COLUMN_STATUS_STR, FormatPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public FormatPO queryFormatByInfo(long gid, String info) {
		return (FormatPO) session().createCriteria(FormatPO.class).add(Restrictions.eq(FormatPO.COLUMN_GID_STR, gid)).add(Restrictions.eq(FormatPO.COLUMN_INFO_STR, info)).uniqueResult();
	}

	@Override
	public int batchSaveFormat(long gid, long gpid) {

		String sql = "INSERT INTO `data`.format (gid, info, `status`) SELECT :gid, fp.info, fp.`status` FROM communion.formatpool fp WHERE fp.gpid = :gpid";

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
