package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalDecorationTerminalItemDao;
import com.fanglin.approval.po.ApprovalDecorationTerminalItemPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalDecorationTerminalItemDao")
public class ApprovalDecorationTerminalItemDaoImpl extends DaoImpl<ApprovalDecorationTerminalItemPO>implements ApprovalDecorationTerminalItemDao{

	public ApprovalDecorationTerminalItemDaoImpl() {
		super(ApprovalDecorationTerminalItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ApprovalDecorationTerminalItemPO> queryApprovalDecorationTerminalItemByAdtId(long adtid) {
		return session().createCriteria(ApprovalDecorationTerminalItemPO.class).add(Restrictions.eq(ApprovalDecorationTerminalItemPO.COLUMN_ATID_STR, adtid)).list();
	}

}
