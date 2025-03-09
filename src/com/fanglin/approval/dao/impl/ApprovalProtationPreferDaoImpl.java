/**
 * @File Name		: ApprovalProtationPreferDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalProtationPreferDao;
import com.fanglin.approval.po.ApprovalProtationPreferPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalProtationPreferDao")
public class ApprovalProtationPreferDaoImpl extends DaoImpl<ApprovalProtationPreferPO> implements ApprovalProtationPreferDao {

	public ApprovalProtationPreferDaoImpl() {
		super(ApprovalProtationPreferPO.class);
	}

	@Override
	public ApprovalProtationPreferPO queryApprovalProtationPreferByAId(long aId) {
		return (ApprovalProtationPreferPO) session().createCriteria(ApprovalProtationPreferPO.class).add(Restrictions.eq(ApprovalProtationPreferPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
