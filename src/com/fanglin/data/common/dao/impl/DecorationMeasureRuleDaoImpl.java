package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DecorationMeasureRuleDao;
import com.fanglin.data.po.DecorationMeasureRuleItemPO;
import com.fanglin.data.po.DecorationMeasureRulePO;
import com.fanglin.utils.Paging;

@Repository("decorationMeasureRuleDao")
public class DecorationMeasureRuleDaoImpl extends DaoImpl<DecorationMeasureRulePO> implements DecorationMeasureRuleDao {

	public DecorationMeasureRuleDaoImpl() {
		super(DecorationMeasureRulePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationMeasureRulePO> queryDecorationMeasureRule() {
		return session().createCriteria(DecorationMeasureRulePO.class).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationMeasureRuleItemPO> queryDecorationMeasureRule(int company) {

		String sql = "select dm2.* from data.decorationmeasureruleitem dm1, data.decorationmeasureruleitem dm2 where dm1.company = :company and dm1.dmrid = dm2.dmrid";

		Query query = session().createSQLQuery(sql).addEntity(DecorationMeasureRuleItemPO.class).setInteger("company", company);

		return query.list();
	}

	@Override
	public List<DecorationMeasureRulePO> pageDecorationMeasureRule(Paging paging, List<Filter> filters) {

		PagingQuery<DecorationMeasureRulePO> query = pagingQuery(paging, DecorationMeasureRulePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals("name")) {
				query.add(query.getCriterion("name", data, op));
			} else if (field.equals("status")) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			}
		}
	}

}
