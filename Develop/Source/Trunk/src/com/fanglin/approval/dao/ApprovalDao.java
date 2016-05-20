/**
 * @File Name		: ApprovalDao.java
 * @Package   	: com.fanglin.approval.dao
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface ApprovalDao extends Dao<ApprovalPO> {
	
	public List<ApprovalPO> pageApprovalByReceiveId(Paging paging, List<FilterVO> filters, String userId);
	
	public ApprovalPO queryApprovalForInitByTypeAIdent(short type, String ident);
	
}
