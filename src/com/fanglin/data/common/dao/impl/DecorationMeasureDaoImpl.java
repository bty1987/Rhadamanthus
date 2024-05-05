package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.DecorationMeasureDao;
import com.fanglin.data.po.DecorationMeasureItemPO;
import com.fanglin.data.po.DecorationMeasurePO;

@Repository("decorationMeasureDao")
public class DecorationMeasureDaoImpl extends DaoImpl<DecorationMeasurePO> implements DecorationMeasureDao {

	public DecorationMeasureDaoImpl() {
		super(DecorationMeasurePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationMeasurePO> queryDecorationMeasure() {
		return session().createCriteria(DecorationMeasurePO.class).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationMeasureItemPO> queryDecorationMeasure(int company) {

		String sql = "select dm2.* from data.decorationmeasureitem dm1, data.decorationmeasureitem dm2 where dm1.company = :company and dm1.dmid = dm2.dmid";

		Query query = session().createSQLQuery(sql).addEntity(DecorationMeasureItemPO.class).setInteger("company", company);

		return query.list();
	}
}
