package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalDecorationTerminalDao;
import com.fanglin.approval.po.ApprovalDecorationTerminalPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalDecorationTerminalDao")
public class ApprovalDecorationTerminalDaoImpl extends DaoImpl<ApprovalDecorationTerminalPO> implements ApprovalDecorationTerminalDao{

	public ApprovalDecorationTerminalDaoImpl() {
		super(ApprovalDecorationTerminalPO.class);
	}

	@Override
	public ApprovalDecorationTerminalPO queryApprovalDecorationTerminalByAId(long aid) {
		return (ApprovalDecorationTerminalPO) session().createCriteria(ApprovalDecorationTerminalPO.class).add(Restrictions.eq(ApprovalDecorationTerminalPO.COLUMN_AID_STR, aid)).uniqueResult();
	}

}
