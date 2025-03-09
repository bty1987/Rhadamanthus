package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalDecorationContractDao;
import com.fanglin.approval.po.ApprovalDecorationContractPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalDecorationContractDao")
public class ApprovalDecorationContractDaoImpl extends DaoImpl<ApprovalDecorationContractPO> implements ApprovalDecorationContractDao {

	@Override
	public ApprovalDecorationContractPO queryApprovalDecorationContractByAid(long aid) {
		return (ApprovalDecorationContractPO) session().createCriteria(ApprovalDecorationContractPO.class).add(Restrictions.eq(ApprovalDecorationContractPO.COLUMN_AID_STR, aid)).uniqueResult();
	}

}
