/**
 * @File Name		: ApprovalActivityDaoImpl.java
 * @Package   	: com.fanglin.approval.dao
 * @Version		: 1.0
 * @Date			: 2015-11-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalActivityPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalActivityDao extends Dao<ApprovalActivityPO> {
	
	public ApprovalActivityPO queryApprovalActivityByAId(int aId);

}
