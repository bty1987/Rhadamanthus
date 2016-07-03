/**
 * @File Name		: DecorationOrderDrawLineDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.construction.po.DecorationOrderDrawLinePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface DecorationOrderDrawLineDao extends Dao<DecorationOrderDrawLinePO> {
	
	public List<DecorationOrderDrawLinePO> pageDecorationOrderDrawLine(Paging paging, List<FilterVO> filters);
	
	public List<DecorationOrderDrawLinePO> queryDecorationOrderDrawLine(List<FilterVO> filters);

	public List<DecorationOrderDrawLinePO> queryDecorationOrderDrawLine(Timestamp startTime, Timestamp endTime);
	
	public List<DecorationOrderDrawLinePO> queryDecorationOrderDrawLineByOrderId(String orderId);
	
	public List<DecorationOrderDrawLinePO> queryDecorationOrderDrawLineByGroupATime(String group, Timestamp startTime, Timestamp endTime);
	
}
