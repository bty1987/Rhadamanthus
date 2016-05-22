/**
 * @File Name		: ApprovalCustomerDao.java
 * @Package   	: com.fanglin.approval.dao
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalCustomerPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalCustomerDao extends Dao<ApprovalCustomerPO> {

	public ApprovalCustomerPO queryApprovalCustomerByAId(int aId);
	
}
