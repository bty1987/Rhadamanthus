/**
 * @File Name		: ModuleDaoImpl.java
 * @Package   	: com.fanglin.system.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-12-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.ModuleDao;
import com.fanglin.system.po.ModulePO;
import com.fanglin.utils.Paging;

@Repository("moduleDao")
public class ModuleDaoImpl extends DaoImpl<ModulePO> implements ModuleDao {

	public ModuleDaoImpl() {
		super(ModulePO.class);
	}

	@Override
	public List<ModulePO> pageModule(Paging paging, List<Filter> filters) {

		PagingQuery<ModulePO> query = pagingQuery(paging, ModulePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ModulePO> queryModule(Short system, Short level) {

		Criteria query = session().createCriteria(ModulePO.class);

		if (system != null) {
			query.add(Restrictions.eq("system", system));
		}

		if (level != null) {
			query.add(Restrictions.eq("level", level));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ModulePO> queryModuleBySystem(short system) {
		return session().createCriteria(ModulePO.class).add(Restrictions.eq("system", system)).list();
	}

	@SuppressWarnings("unchecked")
	public List<ModulePO> queryModuleByFatherModule(Short system, Integer mid) {

		Criteria query = session().createCriteria(ModulePO.class);

		if (system != null) {
			query.add(Restrictions.eq("system", system));
		}

		query.add(Restrictions.eq("fatherModule.mid", mid));

		return query.list();
	}

	@Override
	public int deleteModule(int mId) {

		String sql = "delete from communion.module where fatherModuleId in ((select o.mId from (select * from communion.module where fatherModuleId = :mId) o))";
		session().createSQLQuery(sql).setInteger("mId", mId).executeUpdate();

		sql = "delete from communion.module where fatherModuleId = :mId";
		session().createSQLQuery(sql).setInteger("mId", mId).executeUpdate();

		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if ("level".equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}

}
