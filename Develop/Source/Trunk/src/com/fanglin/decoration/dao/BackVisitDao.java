/**
 * @File Name		: BackVisitDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.po.BackVisitPO;
import com.fanglin.utils.Paging;

public interface BackVisitDao extends Dao<BackVisitPO> {
	
	public List<BackVisitPO> pageBackVisitByOrderId(Paging paging, List<FilterVO> filters, String orderId);

	public List<BackVisitPO> queryBackVisitByOrderIdAStartAEndTime(String orderId, Timestamp start, Timestamp end);
	

	
}
