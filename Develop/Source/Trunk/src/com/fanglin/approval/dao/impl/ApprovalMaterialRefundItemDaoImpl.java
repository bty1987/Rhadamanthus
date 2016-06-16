/**
 * @File Name		: ApprovalMaterialRefundItemDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalMaterialRefundItemDao;
import com.fanglin.approval.po.ApprovalMaterialRefundItemPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalMaterialRefundItemDao")
public class ApprovalMaterialRefundItemDaoImpl extends DaoImpl<ApprovalMaterialRefundItemPO> implements ApprovalMaterialRefundItemDao {
	
	public ApprovalMaterialRefundItemDaoImpl(){
		super(ApprovalMaterialRefundItemPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ApprovalMaterialRefundItemPO> queryApprovalMaterialRefundItemByAmrId(int amrId) {
		return session().createCriteria(ApprovalMaterialRefundItemPO.class).add(Restrictions.eq(ApprovalMaterialRefundItemPO.COLUMN_AMRID_STR, amrId)).list();
	}

}
