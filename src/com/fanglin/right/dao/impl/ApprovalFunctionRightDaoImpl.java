package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.ApprovalFunctionRightDao;
import com.fanglin.right.po.ApprovalFunctionRightPO;

@Repository("approvalFunctionRightDao")
public class ApprovalFunctionRightDaoImpl extends DaoImpl<ApprovalFunctionRightPO> implements ApprovalFunctionRightDao {

	public ApprovalFunctionRightDaoImpl() {
		super(ApprovalFunctionRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ApprovalFunctionRightPO> queryApprovalFunctionRight(String name) {
		return session().createCriteria(ApprovalFunctionRightPO.class).add(Restrictions.eq("name", name)).list();
	}

	@Override
	public int deleteApprovalFunctionRightByName(String name) {

		String sql = "delete from platform.approvalfunctionright where name = :name";
		session().createSQLQuery(sql).setString("name", name).executeUpdate();

		return 0;
	}

}
