package com.fanglin.communion.dao.impl;

import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.List;

@Repository("villageDao")
public class VillageDaoImpl extends DaoImpl<VillagePO> implements VillageDao {

	public VillageDaoImpl() {
		super(VillagePO.class);
	}

	@Override
	public List<VillagePO> pageVillage(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<VillagePO> query = pagingQuery(paging, VillagePO.class);

		queryFilterExcute(query, filters);

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			query.add(Restrictions.eq("company", company));
		}

		query.asc("vid");

		return query.list();
	}

	@Override
	public List<VillagePO> queryVillageByPinyin(Paging paging, String pinyinName, Long pvid, Integer company) {

		PagingQuery<VillagePO> query = pagingQuery(paging, VillagePO.class);

		if (StringUtils.isNotEmpty(pinyinName)) {
			query.add(Restrictions.eq(VillagePO.COLUMN_STATUS_STR, VillagePO.STATUS_ENABLE_INT)).add(Restrictions.or(Restrictions.ilike("name", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("pinyinAB", pinyinName, MatchMode.ANYWHERE)));
		}

		if (pvid != null) {
			query.alias("parentVillage", "parentVillage").add(Restrictions.eq(VillagePO.COLUMN_PVID_STR, pvid));
		}

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			query.add(Restrictions.eq("company", company));
		}

		query.add(Restrictions.sqlRestriction(String.format("1=1 ORDER BY CASE WHEN this_.company = %s THEN 1 ELSE 2 END", company)));

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<VillagePO> queryVillageByCityProperId(Integer cityProperId) {
		return session().createCriteria(VillagePO.class).add(Restrictions.eq("cityProper.cpid", cityProperId)).list();
	}

	@Override
	public int countVillageByCpid(Integer cpid) {

		String sql = "select count(*) from communion.village where cityProperId = :cityProperId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("cityProperId", cpid).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countVillageByNameACpid(String name, Integer cpid, Integer company) {

		StringBuffer sql = new StringBuffer();

		sql.append("select count(*) from communion.village where name = :name and cityProperId = :cityProperId");

		if (SystemConfig.getInt("multicompany", 0) != 0) {

			sql.append("and company =:company ");
		}

		SQLQuery query = session().createSQLQuery(sql.toString());

		query.setString("name", name).setInteger("cityProperId", cpid);

		if (SystemConfig.getInt("multicompany", 0) != 0) {

			query.setInteger("company", company);

		}

		return ((BigInteger) query.uniqueResult()).intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if (!StringUtils.isNotEmpty(data)) continue;

			if ("villageName".equals(field)) {
				// 楼盘名称：支持名称、拼音首字母、拼音全拼模糊搜索
				query.add(Restrictions.or(Restrictions.ilike("name", data, MatchMode.ANYWHERE), Restrictions.or(Restrictions.ilike("pinyinAB", data, MatchMode.ANYWHERE), Restrictions.ilike("pinyinAll", data, MatchMode.ANYWHERE))));
			} else if ("cityProperId".equals(field)) {
				// 城区ID：精确匹配
				query.add(query.getCriterion("cityProper.cpid", filter));
			} else if ("cityId".equals(field)) {
				// 城市ID：精确匹配
				query.alias("cityProper", "cityProper").alias("cityProper.city", "city").add(Restrictions.eq("city.cid", Integer.valueOf(data)));
			} else if ("developer".equals(field)) {
				// 开发商：模糊搜索
				query.add(Restrictions.ilike("developer", data, MatchMode.ANYWHERE));
			} else if ("status".equals(field)) {
				// 状态：精确匹配（0=启用, 1=禁用）
				query.add(Restrictions.eq("status", Short.valueOf(data)));
			} else if ("deliveryTimeStart".equals(field)) {
				// 交付时间起始：大于等于
				query.add(Restrictions.ge("deliveryTime", data));
			} else if ("deliveryTimeEnd".equals(field)) {
				// 交付时间结束：小于等于
				query.add(Restrictions.le("deliveryTime", data));
			} else if ("parentVillageId".equals(field)) {
				// 父楼盘ID：精确匹配
				query.add(Restrictions.eq("parentVillage.vid", Long.valueOf(data)));
			}
		}
	}
}
