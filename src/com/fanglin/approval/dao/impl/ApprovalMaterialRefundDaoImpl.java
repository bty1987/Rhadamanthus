/**
 * @File Name		: ApprovalMaterialRefundDaoImpl.java
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

import com.fanglin.approval.dao.ApprovalMaterialRefundDao;
import com.fanglin.approval.po.ApprovalMaterialRefundPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalMaterialRefundDao")
public class ApprovalMaterialRefundDaoImpl extends DaoImpl<ApprovalMaterialRefundPO> implements ApprovalMaterialRefundDao {
	
	public ApprovalMaterialRefundDaoImpl(){
		super(ApprovalMaterialRefundPO.class);
	}

	@Override
	public ApprovalMaterialRefundPO queryApprovalMaterialRefundByAId(long aId) {
		return (ApprovalMaterialRefundPO) session().createCriteria(ApprovalMaterialRefundPO.class).add(Restrictions.eq(ApprovalMaterialRefundPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
