package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.RecruitmentDao;
import com.fanglin.personel.po.RecruitmentPO;
import com.fanglin.utils.Paging;

@Repository("RecruitmentDao")
public class RecruitmentDaoImpl extends DaoImpl<RecruitmentPO> implements RecruitmentDao {

	public RecruitmentDaoImpl() {
		super(RecruitmentPO.class);
	}

	@Override
	public List<RecruitmentPO> pageRecruitment(Paging paging, List<Filter> filters) {

		PagingQuery<RecruitmentPO> query = pagingQuery(paging, RecruitmentPO.class);

		queryFilterExcute(query, filters);

		return query.list();

	}

	private void queryFilterExcute(PagingQuery<RecruitmentPO> query, List<Filter> filters) {
		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", filter));
			} else if ("identity".equals(field)) {
				query.add(query.getCriterion("identity", filter));
			} else if ("education".equals(field)) {
				query.add(Restrictions.eq("education", Short.valueOf(data)));
			} else if ("phone".equals(field)) {
				query.add(query.getCriterion("phone", filter));
			} else if ("employWay".equals(field)) {
				query.add(Restrictions.eq("employWay", Short.valueOf(data)));
			} else if ("status".equals(field)) {
				query.add(Restrictions.eq("status", Short.valueOf(data)));
			}
		}

	}

	@Override
	public RecruitmentPO queryRecruitmentByRid(long rid) {

		return (RecruitmentPO) session().createCriteria(RecruitmentPO.class).add(Restrictions.eq("rid", rid)).uniqueResult();

	}

	@Override
	public RecruitmentPO checkRecruitment(String identity, String phone) {

		Criteria session = session().createCriteria(RecruitmentPO.class);

		if (identity != null) {
			session.add(Restrictions.eq("identity", identity));
		}

		if (phone != null) {
			session.add(Restrictions.eq("phone", phone));
		}

		return (RecruitmentPO) session.uniqueResult();
	}
}
