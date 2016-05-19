/**
 * @File Name		: ApprovalVillageDao.java
 * @Package   	: com.fanglin.approval.dao
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalVillagePO;
import com.fanglin.core.dao.Dao;

public interface ApprovalVillageDao extends Dao<ApprovalVillagePO> {
	
	public ApprovalVillagePO queryApprovalVillageByAId(int aId);

}
