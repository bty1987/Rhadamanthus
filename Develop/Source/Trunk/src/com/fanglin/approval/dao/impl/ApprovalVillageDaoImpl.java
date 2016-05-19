/**
 * @File Name		: ApprovalVillageDaoImpl.java
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

import com.fanglin.approval.dao.ApprovalVillageDao;
import com.fanglin.approval.po.ApprovalVillagePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalVillageDao")
public class ApprovalVillageDaoImpl extends DaoImpl<ApprovalVillagePO> implements ApprovalVillageDao {
	
	public ApprovalVillageDaoImpl(){
		super(ApprovalVillagePO.class);
	}

	@Override
	public ApprovalVillagePO queryApprovalVillageByAId(int aId) {
		return (ApprovalVillagePO) session().createCriteria(ApprovalVillagePO.class).add(Restrictions.eq(ApprovalVillagePO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
