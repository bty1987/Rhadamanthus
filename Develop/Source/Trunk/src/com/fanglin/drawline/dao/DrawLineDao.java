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

package com.fanglin.drawline.dao;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.drawline.po.DrawLinePO;
import com.fanglin.utils.Paging;

public interface DrawLineDao extends Dao<DrawLinePO> {
	
	public List<DrawLinePO> pageDrawLine(Paging paging, List<Filter> filters);
	
	public List<DrawLinePO> queryDrawLine(List<Filter> filters);

	public List<DrawLinePO> queryDrawLine(Timestamp startTime, Timestamp endTime);
	
	public List<DrawLinePO> queryDrawLineByOrderId(String orderId);
	
	public List<DrawLinePO> queryDrawLineByGroupATime(String group, Timestamp startTime, Timestamp endTime);
	
}
