/**
 * @File Name		: AprovalDecorationHouseDaoImpl.java
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

import com.fanglin.approval.dao.ApprovalDecorationHouseDao;
import com.fanglin.approval.po.ApprovalDecorationHousePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalDecorationHouseDao")
public class ApprovalDecorationHouseDaoImpl extends DaoImpl<ApprovalDecorationHousePO> implements ApprovalDecorationHouseDao {
	
	public ApprovalDecorationHouseDaoImpl(){
		super(ApprovalDecorationHousePO.class);
	}

	@Override
	public ApprovalDecorationHousePO queryApprovalDecorationHouseByAId(long aId) {
		return (ApprovalDecorationHousePO) session().createCriteria(ApprovalDecorationHousePO.class).add(Restrictions.eq(ApprovalDecorationHousePO.COLUMN_AID_STR, aId)).setMaxResults(1).uniqueResult();
	}

}
