/**
 * @File Name		: ApprovalActivityItemDao.java
 * @Package   	: com.fanglin.approval.dao
 * @Version		: 1.0
 * @Date			: 2015-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalActivityItemPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalActivityItemDao extends Dao<ApprovalActivityItemPO> {
	
	public List<ApprovalActivityItemPO> queryApprovalActivityItemByAaId(long aaId);

}
