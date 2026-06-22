package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.DecorationMeasureRuleItemDao;
import com.fanglin.data.po.DecorationMeasureRuleItemPO;

@Repository("decorationMeasureRuleItemDao")
public class DecorationMeasureRuleItemDaoImpl extends DaoImpl<DecorationMeasureRuleItemPO> implements DecorationMeasureRuleItemDao {

	public DecorationMeasureRuleItemDaoImpl() {
		super(DecorationMeasureRuleItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationMeasureRuleItemPO> queryDecorationMeasureRuleItem(long dmrid) {
		return session().createCriteria(DecorationMeasureRuleItemPO.class).add(Restrictions.eq("dmrid", dmrid)).list();
	}

}
