package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.FlowitemDao;
import com.fanglin.data.po.FlowitemPO;

@Repository("flowitemDao")
public class FlowitemDaoImpl extends DaoImpl<FlowitemPO> implements FlowitemDao {

	public FlowitemDaoImpl() {
		super(FlowitemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FlowitemPO> queryFlowitem(long fpid) {
		return session().createCriteria(FlowitemPO.class).add(Restrictions.eq("fpid", fpid)).list();
	}

	@Override
	public int deleteFlowitem(long fpid) {

		String sql = "delete from data.flowitem where fpid = :fpid";

		session().createSQLQuery(sql).setLong("fpid", fpid).executeUpdate();

		return 0;
	}

}
