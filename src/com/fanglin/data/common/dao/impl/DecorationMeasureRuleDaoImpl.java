package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.DecorationMeasureRuleDao;
import com.fanglin.data.po.DecorationMeasureItemPO;
import com.fanglin.data.po.DecorationMeasureRulePO;

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
	public List<DecorationMeasureItemPO> queryDecorationMeasureRule(int company) {

		String sql = "select dm2.* from data.decorationmeasureitem dm1, data.decorationmeasureitem dm2 where dm1.company = :company and dm1.dmid = dm2.dmid";

		Query query = session().createSQLQuery(sql).addEntity(DecorationMeasureItemPO.class).setInteger("company", company);

		return query.list();
	}
}
