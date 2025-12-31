package com.fanglin.communion.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

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

		if (filters != null) {
			query.alias("cityProper", "cityProper");
			for (Filter filter : filters) {

				if (StringUtils.isNotEmpty(filter.getData())) {
					if ("villageName".equals(filter.getField())) {
						// 楼盘名称：支持名称、拼音首字母、拼音全拼模糊搜索
						query.add(Restrictions.or(
							Restrictions.ilike("name", filter.getData(), MatchMode.ANYWHERE),
							Restrictions.or(
								Restrictions.ilike("pinyinAB", filter.getData(), MatchMode.ANYWHERE),
								Restrictions.ilike("pinyinAll", filter.getData(), MatchMode.ANYWHERE)
							)
						));
					} else if ("cityProperId".equals(filter.getField())) {
						// 城区ID：精确匹配
						query.add(query.getCriterion("cityProper.cpid", filter));
					} else if ("cityId".equals(filter.getField())) {
						// 城市ID：精确匹配
						query.alias("cityProper.city", "city");
						query.add(Restrictions.eq("city.cid", Integer.valueOf(filter.getData())));
					} else if ("developer".equals(filter.getField())) {
						// 开发商：模糊搜索
						query.add(Restrictions.ilike("developer", filter.getData(), MatchMode.ANYWHERE));
					} else if ("status".equals(filter.getField())) {
						// 状态：精确匹配（0=启用, 1=禁用）
						query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
					} else if ("deliveryTimeStart".equals(filter.getField())) {
						// 交付时间起始：大于等于
						query.add(Restrictions.ge("deliveryTime", filter.getData()));
					} else if ("deliveryTimeEnd".equals(filter.getField())) {
						// 交付时间结束：小于等于
						query.add(Restrictions.le("deliveryTime", filter.getData()));
					} else if ("parentVillageId".equals(filter.getField())) {
						// 父楼盘ID：精确匹配
						query.add(Restrictions.eq("parentVillage.vid", Long.valueOf(filter.getData())));
					}
				}
			}
		}
	}

}
